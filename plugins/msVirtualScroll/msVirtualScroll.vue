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
                :key="(unique || 'KEY') + startIndex + i"
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

const startIndex = computed(() =>
    props.autoHeight ? getDynamicStartIndex() : Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan)
)

const visibleCount = computed(() =>
    props.autoHeight ? getDynamicVisibleCount() : Math.ceil(heightPx.value / props.rowHeight) + props.overscan * 2
)
const getDynamicStartIndex = () => {
    let sum = 0
    for (let i = 0; i < props.items.length; i++) {
        const h = itemHeights.value[i] ?? props.rowHeight
        if (sum + h > scrollTop.value) return i
        sum += h
    }
    return 0
}

const getDynamicVisibleCount = () => {
    let sum = 0
    let count = 0
    for (let i = startIndex.value; i < props.items.length; i++) {
        const h = itemHeights.value[i] ?? props.rowHeight
        sum += h
        count++
        if (sum > heightPx.value) break
    }
    return count + props.overscan * 2
}

const endIndex = computed(() =>
    Math.min(props.items.length, startIndex.value + visibleCount.value)
)

const visibleItems = computed(() =>
    props.disableVirtualScroll
        ? props.items
        : props.items.slice(startIndex.value, endIndex.value)
)

const paddingTop = computed(() => {
    let sum = 0
    for (let i = 0; i < startIndex.value; i++) {
        sum += getItemHeight(i)
    }
    return sum
})

const paddingBottom = computed(() => {
    let sum = 0
    for (let i = endIndex.value; i < props.items.length; i++) {
        sum += getItemHeight(i)
    }
    return sum + props.bottomGap
})

const innerStyle = computed(() =>
    props.disableVirtualScroll
        ? {}
        : {
            paddingTop: `${paddingTop.value}px`,
            paddingBottom: `${paddingBottom.value}px`
        }
)

const onScroll = (e) => {
    if (!props.groupKey) {
        scrollTop.value = scrollContainer.value.scrollTop
        return
    }

    const group = groups.value?.[props.groupKey]
    if (!group) return
    const currentTop = e.target.scrollTop
    scrollTop.value = currentTop
    isSyncing.value = true
    for (const el of group) {
        if (el !== e.target) {
            el.scrollTop = currentTop
        }
    }
    isSyncing.value = false
}


onMounted(async () => {
    await nextTick()
    if (!props.groupKey || !scrollContainer.value) return

    if (!groups.value[props.groupKey]) {
        groups.value[props.groupKey] = []
    }
    groups.value[props.groupKey].push(scrollContainer.value)
})

onMounted(() => {
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
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                const index = Number(entry.target.dataset.index)
                if (!isNaN(index)) {
                    const height = entry.contentRect.height
                    if (height > 0) {
                        itemHeights.value[index] = height
                    }
                }
            }
        })

        watch(visibleItems, async () => {
            await nextTick()
            for (let i = startIndex.value; i < endIndex.value; i++) {
                const el = itemRefs.value[i]
                if (el instanceof Element) {
                    el.dataset.index = i
                    observer.observe(el)
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
