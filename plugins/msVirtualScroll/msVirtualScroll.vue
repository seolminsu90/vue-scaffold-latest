<template>
  <div ref="scrollContainer" class="virtual-scroll"
       :style="{ height: containerHeightStyle, overflowY: 'auto' }" @scroll="onScroll">
    <div class="virtual-scroll-inner" :style="innerStyle">
      <div
          v-for="(item, i) in visibleItems"
          :key="startIndex + i"
          class="virtual-scroll-item"
          :style="{
            height: autoHeight ? null : getItemHeight(startIndex + i) + 'px',
          }"
          :ref="autoHeight ? el => itemRefs[startIndex + i] = el : null"
      >
        <slot :item="item" :index="startIndex + i"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  height: {
    type: [Number, String], // 숫자도 받고 문자열도 받아용!
    required: true,
  },
  saveScroll: {
    type: Boolean,
    required: false,
  },
  rowHeight: {
    type: Number,
    default: 40,
  },
  autoHeight: {
    type: Boolean,
    required: false,
  },
  overscan: {
    type: Number,
    default: 5,
  },
})

const scrollTop = ref(0)
const scrollContainer = ref(null)
const itemRefs = ref({}) // { index: HTMLElement }
const itemHeights = ref({}) // { index: height }
const heightPx = ref(0)

const getItemHeight = index => props.autoHeight ? itemHeights.value[index] ?? props.rowHeight : props.rowHeight
const containerHeightStyle = computed(() =>
    typeof props.height === 'number' ? `${props.height}px` : props.height
)
const visibleCount = computed(() =>
    Math.ceil(heightPx.value / props.rowHeight) + props.overscan * 2
)

const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan)
)

const endIndex = computed(() =>
    Math.min(props.items.length, startIndex.value + visibleCount.value)
)

const visibleItems = computed(() =>
    props.items.slice(startIndex.value, endIndex.value)
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
  return sum
})
const innerStyle = computed(() => ({
  paddingTop: `${paddingTop.value}px`,
  paddingBottom: `${paddingBottom.value}px`
}))

const onScroll = () => {
  scrollTop.value = scrollContainer.value.scrollTop
}

onMounted(() => {
  if (props.saveScroll) {
    const savedPosition = localStorage.getItem('virtual-scroll-position')
    if (savedPosition) {
      nextTick(() => {
        scrollContainer.value.scrollTop = parseInt(savedPosition)
      })
    }
  }
})
onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      heightPx.value = scrollContainer.value.clientHeight
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
        if (el && props.autoHeight) {
          el.dataset.index = i
          observer.observe(el)
        }
      }
    })
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
</style>
