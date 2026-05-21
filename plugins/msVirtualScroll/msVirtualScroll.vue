<template>

    <div ref="scrollContainer" class="virtual-scroll"
         @mousedown="onMouseDown"
         :style="{ height: containerHeightStyle, overflowY: 'auto' }" @scroll="onScroll">

        <div class="virtual-scroll-header">
            <slot name="header"/>
        </div>
        <div
            class="virtual-scroll-inner"
            :style="innerStyle">
            <div
                v-for="(item, i) in visibleItems"
                :key="(unique || 'KEY') + i"
                class="virtual-scroll-item"
                :style="{
          height: autoHeight ? null : getItemHeight(startIndex + i) + 'px',
        }"
                :ref="autoHeight ? el => itemRefs[startIndex + i] = el : null"
            >
                <slot name="item" :item="item" :index="startIndex + i"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
    // 여러 인스턴스가 공존할 때 v-for key 충돌을 방지하기 위한 고유 prefix
    // saveScroll 사용 시 localStorage key의 식별자로도 사용됨
    unique: String,

    // 렌더링할 아이템 배열
    items: { type: Array, default: () => [] },

    // 컨테이너 높이. 숫자면 px 단위, 문자열이면 CSS 값을 그대로 사용
    // 예: 500 → '500px', 'calc(100vh - 150px)' → 그대로
    height: [Number, String],

    // true일 때 스크롤 위치를 localStorage에 저장하고 마운트 시 복원
    // unique prop을 함께 사용해야 여러 인스턴스가 충돌하지 않음
    saveScroll: Boolean,

    // autoHeight가 false일 때 모든 아이템에 적용되는 고정 높이 (px)
    // autoHeight가 true일 때는 실측 전 초기 추정값으로 사용됨
    rowHeight: { type: Number, default: 40 },

    // true일 때 각 아이템의 실제 렌더링 높이를 ResizeObserver로 측정해 가변 높이를 지원
    autoHeight: Boolean,

    // 뷰포트 위아래로 미리 렌더링해 둘 아이템 수.
    // 값이 클수록 빠른 스크롤에도 빈 영역이 보이지 않지만 렌더링 비용이 증가함
    overscan: { type: Number, default: 5 },

    // 리스트 맨 아래에 추가할 여백 (px). 스크롤 끝에 여유 공간이 필요할 때 사용
    bottomGap: { type: Number, default: 0 },

    // true일 때 가상 스크롤을 끄고 모든 아이템을 한 번에 렌더링.
    // 아이템 수가 적거나 디버깅 시 유용
    disableVirtualScroll: { type: Boolean, default: false },

    // 동일한 groupKey를 가진 MsVirtualScroll 인스턴스들의 세로 스크롤 위치를 연동
    // 부모에서 v-model:groups 로 공유 객체를 전달해야 함
    groupKey: { type: String, default: null },
})

// ─── 공유 상태 ────────────────────────────────────────────────────────────────

// groupKey로 묶인 인스턴스들이 공유하는 스크롤 컨테이너 맵 ({ [groupKey]: HTMLElement[] })
// 부모 컴포넌트에서 v-model:groups="sharedObj" 로 주입
const groups = defineModel('groups')

// ─── 내부 상태 ────────────────────────────────────────────────────────────────

// 현재 세로 스크롤 위치 (px). onScroll rAF 콜백에서 갱신되며 가상 윈도우 계산의 기준
const scrollTop = ref(0)

// 스크롤 컨테이너 DOM 참조
const scrollContainer = ref(null)

// autoHeight 모드에서 각 아이템의 DOM 요소를 인덱스로 관리 { [index]: HTMLElement }
const itemRefs = ref({})

// autoHeight 모드에서 ResizeObserver가 측정한 실제 아이템 높이 캐시 { [index]: number }
// items 배열이 교체될 때 초기화됨 (아래 watch 참고)
const itemHeights = ref({})

// 스크롤 컨테이너의 현재 표시 영역 높이 (px). 컨테이너 크기 변화 시 ResizeObserver가 갱신
const heightPx = ref(0)

// groupKey 동기화 루프를 막기 위한 플래그.
// A가 B의 scrollTop을 바꾸면 B의 onScroll이 발화하는데, 이때 B가 다시 A를 바꾸지 않도록 차단
const isSyncing = ref(false)

// ─── 높이 계산 ────────────────────────────────────────────────────────────────

// autoHeight 모드에서 미측정 아이템의 추정치로 사용할 평균 높이.
// rowHeight 고정값보다 실제 높이에 빠르게 수렴해 paddingBottom 오차를 줄인다.
const averageItemHeight = computed(() => {
    const heights = Object.values(itemHeights.value)
    if (heights.length === 0) return props.rowHeight
    return heights.reduce((a, b) => a + b, 0) / heights.length
})

/**
 * 특정 인덱스 아이템의 높이를 반환한다.
 * - autoHeight: 실측값이 있으면 사용, 아직 측정 전이면 측정된 평균값으로 추정
 * - 고정 높이: 항상 rowHeight
 */
const getItemHeight = index =>
    props.autoHeight ? (itemHeights.value[index] ?? averageItemHeight.value) : props.rowHeight

/**
 * 누적 높이 배열 (prefix sum).
 * prefixHeights[i] = items[0..i] 높이의 합계
 *
 * autoHeight 모드에서 이진 탐색으로 startIndex를 O(log n)에 구할 때 사용.
 * itemHeights가 갱신될 때마다 재계산됨
 */
const prefixHeights = computed(() => {
    const arr = []
    let sum = 0
    for (let i = 0; i < props.items.length; i++) {
        sum += getItemHeight(i)
        arr[i] = sum
    }
    return arr
})

// ─── 가상 윈도우 계산 ─────────────────────────────────────────────────────────

/**
 * autoHeight 모드에서 이진 탐색으로 현재 scrollTop에 해당하는 첫 번째 아이템 인덱스를 반환.
 * prefixHeights[i] < scrollTop 을 만족하는 가장 큰 i + 1이 결과
 */
const getDynamicStartIndex = () => {
    let low = 0
    let high = prefixHeights.value.length - 1
    const target = scrollTop.value

    while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        if (prefixHeights.value[mid] < target) {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return low
}

// overscan 적용 전, 현재 스크롤 위치에서 실제로 화면 상단에 걸리는 아이템 인덱스
const rawStartIndex = computed(() => {
    if (!props.autoHeight) {
        return Math.floor(scrollTop.value / props.rowHeight)
    }
    return getDynamicStartIndex()
})

// overscan만큼 위쪽으로 확장한 실제 렌더링 시작 인덱스 (0 미만 방지)
const startIndex = computed(() => Math.max(0, rawStartIndex.value - props.overscan))

// overscan 적용 전, 뷰포트 하단을 벗어나는 첫 번째 아이템 인덱스 (exclusive)
const rawEndIndex = computed(() => {
    if (!props.autoHeight) {
        // 고정 높이: 뷰포트 높이를 rowHeight로 나눠 보이는 아이템 수를 계산
        const visible = Math.ceil(heightPx.value / props.rowHeight)
        return Math.min(props.items.length, rawStartIndex.value + visible)
    }

    // 가변 높이: rawStartIndex부터 높이를 누적해 뷰포트 높이를 초과하는 지점까지 탐색
    let sum = 0
    let i = rawStartIndex.value
    while (i < props.items.length && sum < heightPx.value) {
        sum += getItemHeight(i)
        i++
    }
    return i
})

// overscan만큼 아래쪽으로 확장한 실제 렌더링 종료 인덱스 (exclusive, items.length 초과 방지)
const endIndex = computed(() =>
    Math.min(props.items.length, rawEndIndex.value + props.overscan)
)

// 현재 DOM에 렌더링할 아이템 슬라이스
const visibleItems = computed(() =>
    props.disableVirtualScroll
        ? props.items
        : props.items.slice(startIndex.value, endIndex.value)
)

// ─── 패딩 계산 ────────────────────────────────────────────────────────────────
// 렌더링하지 않는 영역의 높이를 paddingTop / paddingBottom으로 시뮬레이션해
// 전체 스크롤 가능 높이를 실제 아이템 수에 맞게 유지한다.

// startIndex 위쪽 아이템들의 총 높이 → inner 컨테이너 상단 패딩으로 사용
const paddingTop = computed(() => {
    if (!props.autoHeight) {
        return startIndex.value * props.rowHeight
    }
    return startIndex.value > 0 ? prefixHeights.value[startIndex.value - 1] : 0
})

// endIndex 아래쪽 아이템들의 총 높이 + bottomGap → inner 컨테이너 하단 패딩으로 사용
const paddingBottom = computed(() => {
    if (!props.autoHeight) {
        return (props.items.length - endIndex.value) * props.rowHeight + props.bottomGap
    }

    const total = prefixHeights.value[prefixHeights.value.length - 1] || 0
    const rendered = prefixHeights.value[endIndex.value - 1] || 0
    return total - rendered + props.bottomGap
})

const containerHeightStyle = computed(() =>
    typeof props.height === 'number' ? `${props.height}px` : props.height
)

const innerStyle = computed(() =>
    props.disableVirtualScroll
        ? {}
        : {
            paddingTop: `${paddingTop.value}px`,
            paddingBottom: `${paddingBottom.value}px`,
        }
)

// ─── 스크롤 처리 ──────────────────────────────────────────────────────────────

let rafId = null
const onScroll = (e) => {
    // isSyncing이 true인 동안은 groupKey 동기화로 인해 발생한 scroll 이벤트이므로 무시
    if (isSyncing.value) return

    // rAF 디바운스: 이전 예약을 취소하고 새로 등록해
    // 빠른 스크롤 중 마지막 이벤트도 반드시 처리되도록 보장.
    // (단순 throttle은 마지막 이벤트가 버려져 하단에 잔여 여백이 생기는 버그 유발)
    cancelAnimationFrame(rafId)
    const target = e.target
    rafId = requestAnimationFrame(() => {
        rafId = null
        if (!scrollContainer.value) return

        // e.target.scrollTop (이벤트 발생 시점 값)이 아니라
        // rAF 실행 시점의 DOM 최신값을 읽어 지연 없이 정확한 위치를 반영
        const currentTop = scrollContainer.value.scrollTop
        scrollTop.value = currentTop

        // saveScroll: 스크롤 위치를 localStorage에 저장
        if (props.saveScroll && !props.disableVirtualScroll) {
            const key = `virtual-scroll-position:${props.unique || 'default'}`
            localStorage.setItem(key, String(currentTop))
        }

        // groupKey 동기화: 같은 그룹의 다른 스크롤러를 동일한 위치로 이동
        if (props.groupKey) {
            const group = groups.value?.[props.groupKey]
            if (!group) return

            isSyncing.value = true
            for (const el of group) {
                // 자기 자신을 제외하고, 이미 같은 위치면 불필요한 scroll 이벤트 발화를 방지
                if (el !== target && el.scrollTop !== currentTop) {
                    el.scrollTop = currentTop
                }
            }
            isSyncing.value = false
        }
    })
}

// ─── 마우스 드래그 (가로 스크롤) ──────────────────────────────────────────────

const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const onMouseDown = (e) => {
    if (!scrollContainer.value) return
    isDragging.value = true
    startX.value = e.pageX
    scrollLeft.value = scrollContainer.value.scrollLeft
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

const onMouseMove = (e) => {
    if (!isDragging.value) return
    e.preventDefault()
    scrollContainer.value.scrollLeft = scrollLeft.value - (e.pageX - startX.value)
}

const onMouseUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

// ─── ResizeObserver ───────────────────────────────────────────────────────────

// 컨테이너 크기 변화 감지용 (창 리사이즈 등으로 heightPx가 바뀔 때 가상 윈도우 재계산)
// onBeforeUnmount에서 disconnect하기 위해 ref로 보관
const containerResizeObserver = ref(null)

// autoHeight 모드에서 각 아이템의 실제 높이를 측정하는 관찰자
const resizeObserver = ref(null)

// resizeObserver가 현재 감시 중인 DOM 요소 집합 (중복 등록 방지 및 unobserve 추적용)
const observedElements = new Set()

// autoHeight 모드: 렌더링 범위가 바뀔 때마다 ResizeObserver 대상을 동기화
// setup 시점에 등록해야 onBeforeUnmount에서 자동 정리됨
// (async onMounted 내부의 await 이후 watch 등록은 자동 정리가 보장되지 않음)
if (props.autoHeight) {
    watch(visibleItems, async () => {
        // onMounted에서 resizeObserver가 초기화되기 전엔 실행하지 않음
        if (!resizeObserver.value) return

        await nextTick()

        const currentVisible = new Set()

        for (let i = startIndex.value; i < endIndex.value; i++) {
            const el = itemRefs.value[i]
            if (!(el instanceof Element)) continue

            // ResizeObserver 콜백에서 높이를 인덱스와 매핑하기 위해 data-index를 설정
            el.dataset.index = i
            currentVisible.add(el)

            // 이미 감시 중인 요소는 중복 등록하지 않음
            if (!observedElements.has(el)) {
                resizeObserver.value.observe(el)
                observedElements.add(el)
            }
        }

        // 뷰포트에서 사라진 요소는 unobserve해 불필요한 콜백 호출을 줄임
        for (const el of observedElements) {
            if (!currentVisible.has(el)) {
                resizeObserver.value.unobserve(el)
                observedElements.delete(el)
            }
        }
    })
}

// items 배열이 교체될 때(정렬·필터 등) 높이 캐시를 초기화한다.
// 초기화하지 않으면 새 items[i]에 이전 items[i]의 높이가 남아 prefixHeights가 틀어짐
watch(() => props.items, () => {
    itemHeights.value = {}
})

// ─── 라이프사이클 ─────────────────────────────────────────────────────────────

onMounted(async () => {
    await nextTick()

    // ── 컨테이너 높이 초기화 ──
    if (scrollContainer.value) {
        heightPx.value = scrollContainer.value.clientHeight
    }

    // ── 저장된 스크롤 위치 복원 ──
    if (props.saveScroll && !props.disableVirtualScroll) {
        const key = `virtual-scroll-position:${props.unique || 'default'}`
        const saved = localStorage.getItem(key)
        if (saved && scrollContainer.value) {
            scrollContainer.value.scrollTop = parseInt(saved, 10)
        }
    }

    // ── 컨테이너 크기 변화 감지 ──
    // 창 리사이즈, 패널 접힘 등으로 컨테이너 높이가 바뀌면 heightPx를 갱신
    containerResizeObserver.value = new ResizeObserver(() => {
        if (scrollContainer.value instanceof Element) {
            heightPx.value = scrollContainer.value.clientHeight
        }
    })
    if (scrollContainer.value instanceof Element) {
        containerResizeObserver.value.observe(scrollContainer.value)
    }

    // ── groupKey 동기화 등록 ──
    // 같은 groupKey를 가진 인스턴스들이 공유하는 배열에 이 컨테이너를 추가
    if (props.groupKey && scrollContainer.value) {
        if (!groups.value[props.groupKey]) {
            groups.value[props.groupKey] = []
        }
        groups.value[props.groupKey].push(scrollContainer.value)
    }

    // ── autoHeight: 아이템 높이 측정 초기화 ──
    if (props.autoHeight) {
        resizeObserver.value = new ResizeObserver(entries => {
            for (const entry of entries) {
                const index = Number(entry.target.dataset.index)
                if (isNaN(index)) continue

                const height = entry.contentRect.height
                // 실제로 변경된 경우에만 갱신해 불필요한 반응성 트리거를 방지
                if (height > 0 && itemHeights.value[index] !== height) {
                    itemHeights.value[index] = height
                }
            }
        })
    }
})

onBeforeUnmount(() => {
    // 예약된 rAF 취소 (언마운트 후 scrollTop 갱신이 발생하지 않도록)
    if (rafId !== null) {
        cancelAnimationFrame(rafId)
    }

    // 컨테이너 크기 감지 종료
    containerResizeObserver.value?.disconnect()

    // 아이템 높이 측정 종료
    resizeObserver.value?.disconnect()

    // groupKey 그룹에서 이 인스턴스를 제거
    if (props.groupKey && scrollContainer.value) {
        const group = groups.value?.[props.groupKey]
        if (group) {
            const idx = group.indexOf(scrollContainer.value)
            if (idx !== -1) group.splice(idx, 1)
            if (group.length === 0) delete groups.value[props.groupKey]
        }
    }
})
</script>

<style scoped>
.virtual-scroll {
    position: relative;
}

.virtual-scroll-inner {
    display: flex;
    flex-direction: column;
}

.virtual-scroll-item {
    box-sizing: border-box;
}

.virtual-scroll-header {
    position: sticky;
    top: 0;
    z-index: 10;
}

.virtual-scroll-inner:active {
    cursor: grabbing;
}
</style>
