<template>
    <div class="ms-calendar-header">
        <div class="arrow-wrap" :class="{ 'opacity-0': timeView }" @click="onMoveEmit('prev', true)">
            <i class="fa-solid fa-angles-left arrow"></i>
        </div>
        <div class="arrow-wrap" :class="{ 'opacity-0': timeView }" @click="onMoveEmit('prev')">
            <i class="fa-solid fa-angle-left arrow"></i>
        </div>

        <div class="calendar-header-text" v-if="!timeView">{{ year }}년 {{ month }}월</div>
        <div class="calendar-header-text" v-else>시간 선택</div>

        <div class="arrow-wrap" :class="{ 'opacity-0': timeView }" @click="onMoveEmit('next')">
            <i class="fa-solid fa-angle-right arrow"></i>
        </div>

        <div class="arrow-wrap" :class="{ 'opacity-0': timeView }" @click="onMoveEmit('next', true)">
            <i class="fa-solid fa-angles-right arrow"></i>
        </div>
    </div>
</template>
<script setup>
defineProps(['year', 'month', 'timeView'])
const emit = defineEmits(['onMove'])

const onMoveEmit = (type, bool = false) => {
    emit('onMove', type, bool)
}
</script>
