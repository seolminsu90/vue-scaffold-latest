<template>
    <div class="ms-calendar-component position-relative" @click.stop.prevent="showCalandar = true">
        <div class="position-relative d-flex-center">
            <input
                ref="inputRef" @focus="updateCalendarPosition"
                class="ms-calendar-component-input"
                type="text"
                :placeholder="placeholder"
                readonly
                :class="typeof inputClass === 'function' ? inputClass() : inputClass"
                :value="computedModelValue"
            />
            <i v-if="modelValue && xBtnShow" class="fa-solid fa-xmark input-x-btn"
               @click.stop.prevent="modelValue = null"></i>
        </div>
        <div class="calendar-dim" v-show="showCalandar"
             @click.stop.prevent="showCalandar = false"></div>
        <div
            ref="msCalendarWrap"
            class="ms-calendar-wrap ms-calendar-down"
            :style="{ top: `${position.top}px`, left: `${position.left}px` }"
            v-show="showCalandar"
            @click.stop.prevent="onCalendarFocus"
        >
            <MsCalendarHeader :year="year" :month="month" :time-view="!isCalendarView"
                              @onMove="onMove"/>
            <transition name="ms-slide-up">
                <div class="ms-calendar" v-if="isCalendarView">
                    <div class="ms-calendar-day week" v-for="(week, idx) in WEEKS" :key="idx">
                        {{ week.toUpperCase() }}
                    </div>
                    <div
                        class="ms-calendar-day"
                        :class="{
                                holyday: day.w === 'sun' || day.w === 'sat',
                                today: day.today,
                                blur: day.blur,
                                selected: isSelected(day),
                                start: isCompletedStart(day),
                                end: isCompletedEnd(day),
                                'select-range': isSelectRange(day),
                                disabled: isDisableDay(day),
                            }"
                        v-for="(day, idx) in cal"
                        :key="idx"
                        @click="selectDay(day)"
                    >
                        {{ day.d }}
                    </div>
                </div>
            </transition>
            <transition name="ms-slide-up">
                <div class="ms-calendar-timer" v-if="!isCalendarView">
                    <div class="ms-timer">
                        <div class="ms-timer-text" v-if="props.range">시작 시간</div>
                        <div class="d-flex-center" :class="{ zoom: !props.range }">
                            <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                 @focusout="isBlur">
                                <input
                                    type="text"
                                    min="0"
                                    v-model="model.startTime.h"
                                    ref="startHour"
                                    @keydown.up="upTimeData($event, 'h', model.startTime)"
                                    @keydown.down="downTimeData($event, 'h', model.startTime)"
                                    @keyup="checkAndNext($event, 'h', model.startTime)"
                                />
                                <div class="arrow-btn-wrap">
                                    <i class="fa-solid fa-caret-up" @click="upData(model.startTime, 'h')"></i>
                                    <i class="fa-solid fa-caret-down" @click="downData(model.startTime, 'h')"></i>
                                </div>
                            </div>
                            <span>:</span>
                            <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                 @focusout="isBlur">
                                <input
                                    type="text"
                                    min="0"
                                    v-model="model.startTime.m"
                                    ref="startMinute"
                                    @keydown.up="upTimeData($event, 'm', model.startTime)"
                                    @keydown.down="downTimeData($event, 'm', model.startTime)"
                                    @keyup="checkAndNext($event, 'm', model.startTime)"
                                />
                                <div class="arrow-btn-wrap">
                                    <i class="fa-solid fa-caret-up" @click="upData(model.startTime, 'm')"></i>
                                    <i class="fa-solid fa-caret-down" @click="downData(model.startTime, 'm')"></i>
                                </div>
                            </div>
                            <template v-if="isUseSecond">
                                <span>:</span>
                                <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                     @focusout="isBlur">
                                    <input
                                        type="text"
                                        min="0"
                                        v-model="model.startTime.s"
                                        ref="startSecond"
                                        @keydown.up="upTimeData($event, 's', model.startTime)"
                                        @keydown.down="downTimeData($event, 's', model.startTime)"
                                        @keyup="checkAndNext($event, 's', model.startTime)"
                                    />
                                    <div class="arrow-btn-wrap">
                                        <i class="fa-solid fa-caret-up" @click="upData(model.startTime, 's')"></i>
                                        <i class="fa-solid fa-caret-down" @click="downData(model.startTime, 's')"></i>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <template v-if="props.range">
                        <div style="padding-top: 1em">~</div>
                        <div class="ms-timer">
                            <div class="ms-timer-text">종료 시간</div>
                            <div class="d-flex-center">
                                <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                     @focusout="isBlur">
                                    <input
                                        type="text"
                                        min="0"
                                        v-model="model.endTime.h"
                                        ref="endHour"
                                        @keydown.up="upTimeData($event, 'h', model.endTime)"
                                        @keydown.down="downTimeData($event, 'h', model.endTime)"
                                        @keyup="checkAndNext($event, 'h', model.endTime)"
                                    />
                                    <div class="arrow-btn-wrap">
                                        <i class="fa-solid fa-caret-up" @click="upData(model.endTime, 'h')"></i>
                                        <i class="fa-solid fa-caret-down" @click="downData(model.endTime, 'h')"></i>
                                    </div>
                                </div>
                                <span>:</span>
                                <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                     @focusout="isBlur">
                                    <input
                                        type="text"
                                        min="0"
                                        v-model="model.endTime.m"
                                        ref="endMinute"
                                        @keydown.up="upTimeData($event, 'm', model.endTime)"
                                        @keydown.down="downTimeData($event, 'm', model.endTime)"
                                        @keyup="checkAndNext($event, 'm', model.endTime)"
                                    />
                                    <div class="arrow-btn-wrap">
                                        <i class="fa-solid fa-caret-up" @click="upData(model.endTime, 'm')"></i>
                                        <i class="fa-solid fa-caret-down" @click="downData(model.endTime, 'm')"></i>
                                    </div>
                                </div>
                                <template v-if="isUseSecond">
                                    <span>:</span>
                                    <div class="position-relative hover-arrow-show" @focusin="isFocus"
                                         @focusout="isBlur">
                                        <input
                                            type="text"
                                            min="0"
                                            v-model="model.endTime.s"
                                            ref="endSecond"
                                            @keydown.up="upTimeData($event, 's', model.endTime)"
                                            @keydown.down="downTimeData($event, 's', model.endTime)"
                                            @keyup="checkAndNext($event, 's', model.endTime)"
                                        />
                                        <div class="arrow-btn-wrap">
                                            <i class="fa-solid fa-caret-up" @click="upData(model.endTime, 's')"></i>
                                            <i class="fa-solid fa-caret-down" @click="downData(model.endTime, 's')"></i>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </transition>
            <div class="ms-calendar-icon-wrap" @click="toggleCalendarView" v-if="isPossibleToggle">
                    <span v-if="!isCalendarView">
                        <i class="fa-regular fa-calendar-check"/>
                        <span class="icon-text">날짜 선택</span>
                    </span>
                <span v-else-if="isCalendarView">
                        <i class="fa-regular fa-clock"/>
                        <span class="icon-text">시간 선택</span>
                    </span>
            </div>
            <MsCalendarFooter :range="props.range" :results="model" @ok="onOk" @close="onClose"
                              :type="type" :second-display="isUseSecond"/>
        </div>
    </div>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useCalendarData} from './calendar-func.js'
import './ms-datepicker.scss'
import MsCalendarHeader from './MsCalendarHeader.vue'
import MsCalendarFooter from './MsCalendarFooter.vue'

const {
    generate,
    WEEKS,
    formatDateTime,
    formatDate,
    formatTime,
    isAfter,
    parseDateDay,
    parseHHMMSS,
    diffDay,
    parseYYYYMMDD,
    removeSecond
} = useCalendarData()
const cal = ref([])
const isCalendarView = ref(true)
const modelValue = defineModel()
const modelStart = defineModel('start')
const modelEnd = defineModel('end')
const computedModelValue = computed(() => {
    if (modelStart.value && modelEnd.value) {
        return modelStart.value + " ~ " + modelEnd.value
    }

    if (Array.isArray(modelValue.value)) {
        return modelValue.value.map((m) => (props.isUseSecond ? m : removeSecond(m))).join(' ~ ')
    }

    return props.isUseSecond ? modelValue.value : removeSecond(modelValue.value)
})

const props = defineProps({
    onCalendarFocus: {
        type: Function,
        default: () => {
        },
    },
    xBtnShow: {
        type: Boolean,
        default: true,
    },
    inputClass: {
        type: String || Array || Function,
        default: '',
    },
    // 날짜를 구간 검색합니다.
    range: {
        type: Boolean,
        default: false,
    },
    // 시,분,초 데이터를 서로 관여합니다.
    isRelationTimes: {
        type: Boolean,
        default: true,
    },
    // 날짜 선택을 완료하면 자동으로 시간 선택으로 전환합니다.
    isAutoSwap: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        default: 'datetime', // 'time', 'datetime', 'date'
    },
    maxDate: {
        type: String, //YYYY-MM-DD
        required: false,
    },
    minDate: {
        type: String, //YYYY-MM-DD
        required: false,
    },
    isUseSecond: {
        type: Boolean,
        default: true,
    },
    placeholder: {
        type: String,
        default: null,
    }
})

const showCalandar = ref(false)
watch(
    () => showCalandar.value,
    async () => {
        init()
        await showFocus()
    },
)
const isFocus = (el) => el.target.parentNode.classList.add('focus')
const isBlur = (el) => el.target.parentNode.classList.remove('focus')
const onClose = () => (showCalandar.value = false)
const onOk = () => {
    if (props.range) {
        if (props.type === 'datetime') {
            const start = formatDateTime(model.value.startDate, model.value.startTime, props.isUseSecond)
            const end = formatDateTime(model.value.endDate, model.value.endTime, props.isUseSecond)
            if (!start || !end) return alert('날짜 구간 및 시간을 모두 선택해야 합니다.')

            modelStart.value = start
            modelEnd.value = end
            modelValue.value = [start, end]
        } else if (props.type === 'date') {
            const start = formatDate(model.value.startDate)
            const end = formatDate(model.value.endDate)
            if (!start || !end) return alert('날짜 구간을 모두 선택해야 합니다.')

            modelStart.value = start
            modelEnd.value = end
            modelValue.value = [start, end]
        } else if (props.type === 'time') {
            const start = formatTime(model.value.startTime, props.isUseSecond)
            const end = formatTime(model.value.endTime, props.isUseSecond)
            if (!start || !end) return alert('시간 구간을 모두 설정해야 합니다.')

            modelStart.value = start
            modelEnd.value = end
            modelValue.value = [start, end]
        }
    } else {
        if (props.type === 'datetime') {
            modelValue.value = formatDateTime(model.value.startDate, model.value.startTime, props.isUseSecond)
        } else if (props.type === 'date') {
            modelValue.value = formatDate(model.value.startDate)
        } else if (props.type === 'time') {
            modelValue.value = formatTime(model.value.startTime, props.isUseSecond)
        }
    }
    onClose()
}

const model = ref({
    startDate: null,
    endDate: null,
    startTime: {
        h: '00',
        m: '00',
        s: '00',
    },
    endTime: {
        h: '00',
        m: '00',
        s: '00',
    },
})

const selectDay = (day) => {
    if (isDisableDay(day)) return

    if (props.range) {
        if (!model.value.startDate) model.value.startDate = day
        else {
            if (model.value.startDate && model.value.startDate.f === day.f) {
                model.value.endDate = {...model.value.startDate}
                return
            } else if (model.value.endDate && model.value.endDate.f === day.f) {
                model.value.startDate = {...model.value.endDate}
                return
            }

            const isAfterStart = isAfter(day, model.value.startDate)

            if (model.value.startDate && !model.value.endDate) {
                if (!isAfterStart) {
                    model.value.endDate = {...model.value.startDate}
                    model.value.startDate = day
                } else {
                    model.value.endDate = day
                }
            } else if (model.value.startDate && model.value.endDate) {
                const isBeforeEnd = isAfter(model.value.endDate, day)
                if (isAfterStart && isBeforeEnd) {
                    const startDiff = diffDay(day, model.value.startDate)
                    const endDiff = diffDay(day, model.value.endDate)
                    if (startDiff < endDiff) model.value.endDate = day
                    else model.value.startDate = day
                } else if (!isAfterStart) {
                    model.value.startDate = day
                } else if (!isBeforeEnd) {
                    model.value.endDate = day
                }
            }

            if (model.value.startDate && model.value.endDate && props.type === 'datetime' && props.isAutoSwap) toggleCalendarView()
        }
    } else {
        model.value.startDate = day
        if (props.type === 'datetime' && props.isAutoSwap) toggleCalendarView()
    }
}

const isSelected = (day) => {
    return (
        (model.value.startDate && model.value.startDate.y === day.y && model.value.startDate.m === day.m && model.value.startDate.d === day.d) ||
        (model.value.endDate && model.value.endDate.y === day.y && model.value.endDate.m === day.m && model.value.endDate.d === day.d)
    )
}

const isPossibleToggle = computed(() => {
    return props.type === 'datetime' && (!props.range || (props.range && model.value.startDate && model.value.endDate))
})
const isCompletedStart = (day) => model.value.startDate && model.value.endDate && model.value.startDate.f === day.f
const isCompletedEnd = (day) => model.value.endDate && model.value.endDate && model.value.endDate.f === day.f
const isSelectRange = (day) => model.value.startDate && isAfter(day, model.value.startDate) && model.value.endDate && isAfter(model.value.endDate, day)

const isDisableDay = (day) => {
    if (props.maxDate) {
        const maxDay = parseYYYYMMDD(props.maxDate)
        return isAfter(day, maxDay)
    }
    if (props.minDate) {
        const minDay = parseYYYYMMDD(props.minDate)
        return isAfter(minDay, day)
    }
}

const startHour = ref(null)
const startMinute = ref(null)
const startSecond = ref(null)
const endHour = ref(null)
const endMinute = ref(null)
const endSecond = ref(null)

const upTimeData = (e, type, _ref) => {
    const min = 0
    const max = type === 'h' ? 23 : 59
    const nextVal = Number(e.target.value) + 1

    if (props.isRelationTimes) {
        if (max < nextVal && type === 'm') {
            upData(_ref, 'h')
        } else if (max < nextVal && type === 's') {
            upData(_ref, 'm')
        }
    }

    e.target.value = String(max < nextVal ? min : nextVal).padStart(2, '0')
    _ref[type] = e.target.value
}
const downTimeData = (e, type, _ref) => {
    const min = 0
    const max = type === 'h' ? 23 : 59
    const nextVal = Number(e.target.value) - 1

    if (props.isRelationTimes) {
        if (min > nextVal && type === 'm') {
            downData(_ref, 'h')
        } else if (min > nextVal && type === 's') {
            downData(_ref, 'm')
        }
    }

    e.target.value = String(min > nextVal ? max : nextVal).padStart(2, '0')
    _ref[type] = e.target.value
}
const checkAndNext = (e, type, _ref) => {
    const max = type === 'h' ? 23 : 59
    e.target.value = e.target.value.replace(/[^\d-]/g, '')
    const value = Number(e.target.value)

    if (value < 0) {
        e.target.value = String(max)
    } else if (value > max) {
        e.target.value = '00'
    } else {
        e.target.value = value.toString().padStart(2, '0')
    }
    _ref[type] = e.target.value
}

const toggleCalendarView = async () => {
    isCalendarView.value = !isCalendarView.value
    await showFocus()
}
const showFocus = async () => {
    if (!isCalendarView.value) {
        await nextTick()
        setTimeout(() => {
            if (startHour.value) {
                startHour.value.focus()
                startHour.value.select()
            }
        }, 333)
    }
}

const upData = (_ref, key) => {
    let up = Number(_ref[key]) + 1
    const max = key === 'h' ? 24 : 60

    if (props.isRelationTimes) {
        if (up === max && key === 'm') {
            upData(_ref, 'h')
        } else if (up === max && key === 's') {
            upData(_ref, 'm')
        }
    }

    if (up >= max) up = 0

    _ref[key] = String(up).padStart(2, '0')
}

const downData = (_ref, key) => {
    let down = Number(_ref[key]) - 1

    if (props.isRelationTimes) {
        if (down < 0 && key === 'm') {
            downData(_ref, 'h')
        } else if (down < 0 && key === 's') {
            downData(_ref, 'm')
        }
    }

    if (down < 0) down = key === 'h' ? 23 : 59
    _ref[key] = String(down).padStart(2, '0')
}

const onMove = (action, quick = false) => {
    if (action === 'prev') {
        if (!quick) {
            year.value = month.value - 1 === 0 ? year.value - 1 : year.value
            month.value = month.value - 1 === 0 ? 12 : month.value - 1
        } else {
            year.value = year.value - 1
        }
    } else if (action === 'next') {
        if (!quick) {
            year.value = month.value + 1 > 12 ? year.value + 1 : year.value
            month.value = month.value + 1 > 12 ? 1 : month.value + 1
        } else {
            year.value = year.value + 1
        }
    }
    cal.value = generate(year.value, month.value)
}

const year = ref(0)
const month = ref(0)
const init = () => {
    year.value = 0
    month.value = 0
    isCalendarView.value = true

    model.value = {
        startDate: null,
        endDate: null,
        startTime: {
            h: '00',
            m: '00',
            s: '00',
        },
        endTime: {
            h: '00',
            m: '00',
            s: '00',
        },
    }

    if (props.type === 'time') {
        toggleCalendarView()
    } else {
        let date = new Date()
        if (modelValue.value !== undefined && modelValue.value !== null) {
            if (props.range && Array.isArray(modelValue.value) && modelValue.value.length === 2) {
                date = new Date(modelValue.value[1])
            } else if (!props.range) {
                date = new Date(modelValue.value)
            }
        }

        if (isNaN(date.getTime())) console.warn('[warn] model is Invalid date')
        year.value = date.getFullYear()
        month.value = date.getMonth() + 1
        cal.value = generate(date.getFullYear(), date.getMonth() + 1)
    }

    if (modelValue.value || (modelStart.value && modelEnd.value && props.range)) {
        if (props.range) {
            if (modelValue.value.length === 2) {
                const st = modelStart.value || (modelValue.value && modelValue.value[0].split(' '))
                const ed = modelEnd.value || (modelValue.value && modelValue.value[1].split(' '))

                if (props.type === 'datetime' || props.type === 'date') {
                    model.value.startDate = parseDateDay(st[0])
                    model.value.endDate = parseDateDay(ed[0])
                }

                if (props.type === 'datetime' || props.type === 'time') {
                    const modelStartTime = props.type === 'datetime' ? st[1] : st[0]
                    const modelEndTime = props.type === 'datetime' ? ed[1] : ed[0]

                    model.value.startTime = parseHHMMSS(modelStartTime)
                    model.value.endTime = parseHHMMSS(modelEndTime)
                }
            }
        } else {
            const st = modelValue.value.split(' ')
            if (props.type === 'datetime' || props.type === 'date') {
                model.value.startDate = parseDateDay(st[0])
            }

            if (props.type === 'datetime' || props.type === 'time') {
                const modelStartTime = props.type === 'datetime' ? st[1] : st[0]
                model.value.startTime = parseHHMMSS(modelStartTime)
            }
        }
    }
}

const msCalendarWrap = ref(null)
const inputRef = ref(null)
const position = ref({top: 0, left: 0})
const updateCalendarPosition = async () => {
    if (!inputRef.value || !msCalendarWrap.value) return

    showCalandar.value = true
    await nextTick()

    const inputRect = inputRef.value.getBoundingClientRect()
    const calendarEl = msCalendarWrap.value

    const downMargin = 0
    const upMargin = 0

    let top = inputRect.bottom
    let left = inputRect.left


    const calendarHeight = calendarEl.offsetHeight || 300
    if (top + calendarHeight > window.innerHeight) {
        top = inputRect.top - calendarHeight - upMargin
    } else {
        top += downMargin
    }

    const calendarWidth = calendarEl.offsetWidth || 300
    const sideMargin = 10
    if (left + calendarWidth > window.innerWidth) {
        left = Math.max(sideMargin, window.innerWidth - calendarWidth - sideMargin)
    }

    position.value = {top, left}
}

onMounted(() => {
    window.addEventListener('scroll', updateCalendarPosition)
    window.addEventListener('resize', updateCalendarPosition)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateCalendarPosition)
    window.removeEventListener('resize', updateCalendarPosition)
})

const doClick = () => (showCalandar.value = true)

defineExpose({
    doClick,
})
</script>
