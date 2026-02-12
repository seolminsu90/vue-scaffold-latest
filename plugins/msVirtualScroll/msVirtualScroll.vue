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
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

const props = defineProps({
    unique: String,
    items: Array,
    height: [Number, String],
    saveScroll: Boolean,
    rowHeight: {type: Number, default: 40},
    autoHeight: Boolean,
    overscan: {type: Number, default: 5},
    bottomGap: {type: Number, default: 0},
    disableVirtualScroll: {
        type: Boolean,
        default: false
    },
    groupKey: {
        type: String,
        default: null
    },
    delay: { // scroll delay
        type: Number,
        default: 30
    }
})

const groups = defineModel('groups')
const scrollTop = ref(0)
const scrollContainer = ref(null)
const itemRefs = ref({})
const itemHeights = ref({})
const heightPx = ref(0)
const isSyncing = ref(false)

const getItemHeight = index =>
    props.autoHeight ? itemHeights.value[index] ?? props.rowHeight : props.rowHeight

const containerHeightStyle = computed(() =>
    typeof props.height === 'number' ? `${props.height}px` : props.height
)
const rawStartIndex = computed(() => {
    if (!props.autoHeight) {
        return Math.floor(scrollTop.value / props.rowHeight)
    }
    return getDynamicStartIndex()
})
const startIndex = computed(() => {
    return Math.max(0, rawStartIndex.value - props.overscan)
})

const getDynamicStartIndex = () => {
    let low = 0
    let high = prefixHeights.value.length - 1
    let target = scrollTop.value

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

const prefixHeights = computed(() => {
    const arr = []
    let sum = 0
    for (let i = 0; i < props.items.length; i++) {
        sum += getItemHeight(i)
        arr[i] = sum
    }
    return arr
})

const getDynamicVisibleCount = () => {
    let sum = 0
    let count = 0

    for (let i = startIndex.value; i < props.items.length; i++) {
        const h = itemHeights.value[i] ?? props.rowHeight
        sum += h
        count++
        if (sum > heightPx.value) break
    }

    return count + props.overscan
}
const rawEndIndex = computed(() => {
    if (!props.autoHeight) {
        const visible = Math.ceil(heightPx.value / props.rowHeight)
        return Math.min(
            props.items.length,
            rawStartIndex.value + visible
        )
    }

    let sum = 0
    let i = rawStartIndex.value

    while (i < props.items.length && sum < heightPx.value) {
        sum += getItemHeight(i)
        i++
    }

    return i
})
const endIndex = computed(() => {
    return Math.min(
        props.items.length,
        rawEndIndex.value + props.overscan
    )
})

const visibleItems = computed(() =>
    props.disableVirtualScroll
        ? props.items
        : props.items.slice(startIndex.value, endIndex.value)
)

const paddingTop = computed(() => {
    if (!props.autoHeight) {
        return startIndex.value * props.rowHeight
    }
    return startIndex.value > 0
        ? prefixHeights.value[startIndex.value - 1]
        : 0
})

const paddingBottom = computed(() => {
    if (!props.autoHeight) {
        return (props.items.length - endIndex.value) * props.rowHeight + props.bottomGap
    }

    const total = prefixHeights.value[prefixHeights.value.length - 1] || 0
    const visible = prefixHeights.value[endIndex.value - 1] || 0
    return total - visible + props.bottomGap
})

const innerStyle = computed(() =>
    props.disableVirtualScroll
        ? {}
        : {
            paddingTop: `${paddingTop.value}px`,
            paddingBottom: `${paddingBottom.value}px`
        }
)

let lastTime = 0
const onScroll = (e) => {
    const now = performance.now()
    if (now - lastTime < props.delay) return
    lastTime = now

    if (isSyncing.value) return

    const currentTop = e.target.scrollTop
    scrollTop.value = currentTop

    if (props.groupKey) {
        const group = groups.value?.[props.groupKey]
        if (!group) return

        isSyncing.value = true
        for (const el of group) {
            if (el !== e.target && el.scrollTop !== currentTop) {
                el.scrollTop = currentTop
            }
        }
        isSyncing.value = false
    }
}


onMounted(async () => {
    await nextTick()
    if (!props.groupKey || !scrollContainer.value) return

    if (!groups.value[props.groupKey]) {
        groups.value[props.groupKey] = []
    }
    groups.value[props.groupKey].push(scrollContainer.value)
})

const resizeObserver = ref(null)
const observedElements = new Set()
onMounted(() => {
    console.info("[v1.0.1] virtual scroll is enabled.")
    nextTick(() => {
        if (scrollContainer.value) {
            heightPx.value = scrollContainer.value.clientHeight
        }

        if (props.saveScroll && !props.disableVirtualScroll) {
            const saved = localStorage.getItem('virtual-scroll-position')
            if (saved && scrollContainer.value) {
                scrollContainer.value.scrollTop = parseInt(saved)
            }
        }

        const resize = new ResizeObserver(() => {
            if (scrollContainer.value instanceof Element) {
                heightPx.value = scrollContainer.value.clientHeight
            }
        })

        if (scrollContainer.value instanceof Element) {
            resize.observe(scrollContainer.value)
        }
    })

    if (props.autoHeight) {
        resizeObserver.value = new ResizeObserver(entries => {
            for (const entry of entries) {
                const index = Number(entry.target.dataset.index)
                if (!isNaN(index)) {
                    const height = entry.contentRect.height
                    if (height > 0 && itemHeights.value[index] !== height) {
                        itemHeights.value[index] = height
                    }
                }
            }
        })

        watch(visibleItems, async () => {
            if (!props.autoHeight || !resizeObserver.value) return

            await nextTick()

            const currentVisible = new Set()

            for (let i = startIndex.value; i < endIndex.value; i++) {
                const el = itemRefs.value[i]
                if (el instanceof Element) {
                    el.dataset.index = i
                    currentVisible.add(el)

                    if (!observedElements.has(el)) {
                        resizeObserver.value.observe(el)
                        observedElements.add(el)
                    }
                }
            }

            // 🔥 화면에서 사라진 요소는 unobserve
            for (const el of observedElements) {
                if (!currentVisible.has(el)) {
                    resizeObserver.value.unobserve(el)
                    observedElements.delete(el)
                }
            }
        })
    }
})

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
    const x = e.pageX
    const walk = x - startX.value
    scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

const onMouseUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}


onBeforeUnmount(() => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect()
    }

    if (!props.groupKey || !scrollContainer.value) return
    const group = groups.value?.[props.groupKey]
    if (group) {
        const idx = group.indexOf(scrollContainer.value)
        if (idx !== -1) group.splice(idx, 1)
        if (group.length === 0) delete groups.value[props.groupKey]
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
