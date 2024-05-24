<template>
    <div class="ms-calendar-footer">
        <div class="ms-display-wrap">
            <div class="ms-datetime-display" v-if="computedDisplayShow">
                <div class="ms-date" v-if="type !== 'time'"><i class="fa-regular fa-calendar-check"></i>{{ computedStart }}</div>
                <div class="ms-time" v-if="['datetime', 'time'].includes(type)"><i class="fa-regular fa-clock"></i>{{ computedStartTime }}</div>
            </div>
            <div class="ms-datetime-display" v-if="computedSubDisplayShow">
                <div class="ms-date" v-if="type !== 'time'"><i class="fa-regular fa-calendar-check"></i>{{ computedEnd }}</div>
                <div class="ms-time" v-if="['datetime', 'time'].includes(type)"><i class="fa-regular fa-clock"></i>{{ computedEndTime }}</div>
            </div>
            <div class="ms-datetime-display ms-button-wrap">
                <button type="button" class="button-text" @click="() => emit('ok')">선택</button>
                <button type="button" class="button-text" @click="() => emit('close')">닫기</button>
            </div>
        </div>
        <div></div>
    </div>
</template>
<script setup>
import { computed } from 'vue'

const computedDisplayShow = computed(
    () =>
        (props.type !== 'time' && computedStart.value) ||
        (props.type === 'time' && computedStartTime.value) ||
        (props.type === 'datetime' && computedStart.value && computedStartTime.value),
)

const computedSubDisplayShow = computed(
    () =>
        ((props.type !== 'time' && computedEnd.value) ||
            (props.type === 'time' && computedEndTime.value) ||
            (props.type === 'datetime' && computedEnd.value && computedEndTime.value)) &&
        props.range,
)

const computedStart = computed(() => {
    if (props.results && props.results.startDate) {
        const d = props.results.startDate
        return `${d.y}년${String(d.m).padStart(2, '0')}월${String(d.d).padStart(2, '0')}일`
    }
    return null
})

const computedStartTime = computed(() => {
    if (props.results && props.results.startTime) {
        const d = props.results.startTime
        if (d.h.length > 2 || d.m.length > 2 || d.s.length > 2) return null
        return `${String(d.h).padStart(2, '0')}시${String(d.m).padStart(2, '0')}분${String(d.s).padStart(2, '0')}초`
    }
    return null
})

const computedEnd = computed(() => {
    if (props.results && props.results.endDate) {
        const d = props.results.endDate
        return `${d.y}년${String(d.m).padStart(2, '0')}월${String(d.d).padStart(2, '0')}일`
    }
    return null
})

const computedEndTime = computed(() => {
    if (props.results && props.results.endTime) {
        const d = props.results.endTime
        if (d.h.length > 2 || d.m.length > 2 || d.s.length > 2) return null
        return `${String(d.h).padStart(2, '0')}시${String(d.m).padStart(2, '0')}분${String(d.s).padStart(2, '0')}초`
    }
    return null
})

const props = defineProps(['range', 'results', 'type'])
const emit = defineEmits(['ok', 'close'])
</script>
