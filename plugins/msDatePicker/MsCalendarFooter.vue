<template>
    <div class="ms-calendar-footer">
        <div class="ms-display-wrap">
            <div class="d-flex-center" v-if="type !== 'time'">
                <div class="ms-datetime-display" v-if="computedDisplayShow" :class="{ column: computedSubDisplayShow }">
                    <div class="p-0 ms-date" v-if="type !== 'time'">{{ computedStart }}</div>
                    <div class="is-only-one"></div>
                    <div class="p-0 ms-time" v-if="['datetime', 'time'].includes(type)">{{ computedStartTime }}</div>
                </div>
                <template v-if="computedSubDisplayShow">
                    <div class="result-separator">~</div>
                    <div class="ms-datetime-display column">
                        <div class="p-0 ms-date" v-if="type !== 'time'">{{ computedEnd }}</div>
                        <div class="p-0 ms-time" v-if="['datetime', 'time'].includes(type)">
                            {{ computedEndTime }}
                        </div>
                    </div>
                </template>
            </div>
            <div class="ms-datetime-display ms-button-wrap">
                <button type="button" class="button-text" @click="() => emit('ok')">선택</button>
                <button type="button" class="button-text close" @click="() => emit('close')">닫기</button>
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
        return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`
    }
    return null
})

const computedStartTime = computed(() => {
    if (props.results && props.results.startTime) {
        const d = props.results.startTime
        if (d.h.length > 2 || d.m.length > 2 || d.s.length > 2) return null
        let display = `${String(d.h).padStart(2, '0')}:${String(d.m).padStart(2, '0')}`
        return props.secondDisplay ? `${display}:${String(d.s).padStart(2, '0')}` : display
    }
    return null
})

const computedEnd = computed(() => {
    if (props.results && props.results.endDate) {
        const d = props.results.endDate
        return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`
    }
    return null
})

const computedEndTime = computed(() => {
    if (props.results && props.results.endTime) {
        const d = props.results.endTime
        if (d.h.length > 2 || d.m.length > 2 || d.s.length > 2) return null
        let display = `${String(d.h).padStart(2, '0')}:${String(d.m).padStart(2, '0')}`
        return props.secondDisplay ? `${display}:${String(d.s).padStart(2, '0')}` : display
    }
    return null
})

const props = defineProps(['range', 'results', 'type', 'secondDisplay'])
const emit = defineEmits(['ok', 'close'])
</script>
