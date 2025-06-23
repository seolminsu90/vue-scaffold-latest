
<!-- GridItem.vue -->
<template>
  <div
    class="resizable-box"
    :style="{ gridArea: `${rowStart} / ${colStart} / ${rowEnd} / ${colEnd}` }"
    ref="boxRef"
  >
    <div
      v-for="corner in corners"
      :key="corner"
      class="resizer"
      :class="corner"
      @mousedown.prevent="startResize(corner, $event)"
    />
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  rowStart: { type: Number, default: 2 },
  colStart: { type: Number, default: 2 },
  rowEnd: { type: Number, default: 4 },
  colEnd: { type: Number, default: 4 }
})

const grid = inject('gridConfig')
const boxRef = ref(null)

const rowStart = ref(props.rowStart)
const colStart = ref(props.colStart)
const rowEnd = ref(props.rowEnd)
const colEnd = ref(props.colEnd)

const corners = ['corner-tl', 'corner-tr', 'corner-bl', 'corner-br']

let startX, startY, startValues = {}, activeCorner = ''

const startResize = (corner, e) => {
  startX = e.clientX
  startY = e.clientY
  startValues = {
    rowStart: rowStart.value,
    rowEnd: rowEnd.value,
    colStart: colStart.value,
    colEnd: colEnd.value
  }
  activeCorner = corner
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  const deltaX = e.clientX - startX
  const deltaY = e.clientY - startY
  const container = grid.gridRef.value
  const cellW = container.clientWidth / grid.cols
  const cellH = container.clientHeight / grid.rows
  const moveCols = Math.round(deltaX / cellW)
  const moveRows = Math.round(deltaY / cellH)

  switch (activeCorner) {
    case 'corner-tl':
      rowStart.value = Math.min(rowEnd.value - 1, Math.max(1, startValues.rowStart + moveRows))
      colStart.value = Math.min(colEnd.value - 1, Math.max(1, startValues.colStart + moveCols))
      break
    case 'corner-tr':
      rowStart.value = Math.min(rowEnd.value - 1, Math.max(1, startValues.rowStart + moveRows))
      colEnd.value = Math.max(colStart.value + 1, Math.min(grid.cols + 1, startValues.colEnd + moveCols))
      break
    case 'corner-bl':
      rowEnd.value = Math.max(rowStart.value + 1, Math.min(grid.rows + 1, startValues.rowEnd + moveRows))
      colStart.value = Math.min(colEnd.value - 1, Math.max(1, startValues.colStart + moveCols))
      break
    case 'corner-br':
      rowEnd.value = Math.max(rowStart.value + 1, Math.min(grid.rows + 1, startValues.rowEnd + moveRows))
      colEnd.value = Math.max(colStart.value + 1, Math.min(grid.cols + 1, startValues.colEnd + moveCols))
      break
  }
}

const stopResize = () => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}
</script>

<style scoped>
.resizable-box {
  position: relative;
  background: rgba(0, 128, 255, 0.5);
  z-index: 10;
}

.resizer {
  width: 12px;
  height: 12px;
  background: #007bff;
  position: absolute;
  z-index: 10;
}

.corner-tl {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.corner-tr {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.corner-bl {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.corner-br {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}
</style>
