<!-- GridLayout.vue -->
<template>
  <div
    class="grid-container"
    :style="{
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`
    }"
    ref="gridRef"
  >
    <slot />
  </div>
</template>

<script setup>
import { defineProps, ref, provide } from 'vue'

const props = defineProps({
  rows: { type: Number, default: 10 },
  cols: { type: Number, default: 10 }
})

const gridRef = ref(null)

provide('gridConfig', {
  rows: props.rows,
  cols: props.cols,
  gridRef
})
</script>

<style scoped>
.grid-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  background: #eee;
  gap: 1px;
  position: relative;
}
</style>
