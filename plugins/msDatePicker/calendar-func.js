const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const useCalendarData = () => {
    function generate(year, month) {
        const monthIndex = month - 1
        const startDate = new Date(year, monthIndex, 1)
        const startDay = startDate.getDay()
        const calendarStartDate = new Date(startDate)
        const nowDate = new Date()
        calendarStartDate.setDate(calendarStartDate.getDate() - startDay)

        const calendar = []

        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(calendarStartDate)
            currentDate.setDate(currentDate.getDate() + i)

            const calcYear = currentDate.getFullYear()
            const calcMonth = currentDate.getMonth() + 1
            const calcDay = currentDate.getDate()

            const _day = {
                i: i,
                y: calcYear,
                m: calcMonth,
                d: calcDay,
                w: WEEKS[currentDate.getDay()],
            }
            _day.f = formatDate(_day)

            if (nowDate.getFullYear() === calcYear && nowDate.getMonth() + 1 === calcMonth && nowDate.getDate() === calcDay) _day.today = true
            if (calcMonth !== month) _day.blur = true

            calendar.push(_day)
        }

        return calendar
    }

    function formatDate(date) {
        if (!date) return null
        const year = date.y
        const month = String(date.m).padStart(2, '0')
        const day = String(date.d).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    function diffDay(a, b) {
        if (!a || !b) return null
        const dateA = new Date(a.y, a.m - 1, a.d)
        const dateB = new Date(b.y, b.m - 1, b.d)

        const diffTime = Math.abs(dateB - dateA)

        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }

    function isAfter(date1, date2, sameIsAfter = false, isConsole = false) {
        if (!date1 || !date2) return null
        // 1이 2보다 빠른지 체크
        const date1Year = Number(date1.y)
        const date1Month = Number(date1.m)
        const date1Day = Number(date1.d)
        const date2Year = Number(date2.y)
        const date2Month = Number(date2.m)
        const date2Day = Number(date2.d)

        if (isConsole) {
            console.log('======================')
            console.log(date1, date2)
            console.log(date1Year > date2Year, date1Year, date2Year)
            console.log(date1Year < date2Year, date1Year, date2Year)
            console.log(date1Month > date2Month, date1Month, date2Month)
            console.log(date1Month < date2Month, date1Month, date2Month)
            console.log(date1Day > date2Day, date1Day, date2Day)
            console.log(date1Day < date2Day, date1Day, date2Day)
            console.log('======================')
        }

        //연도 비교
        if (date1Year > date2Year) return true
        if (date1Year < date2Year) return false

        //연도 같음, 월 비교
        if (date1Month > date2Month) return true
        if (date1Month < date2Month) return false

        // 연도 같음, 월 같음, 날짜 비교
        if (date1Day > date2Day) return true
        if (date1Day < date2Day) return false

        return sameIsAfter
    }

    function formatDateTime(date, time) {
        if (!date || !time) return null
        const year = date.y
        const month = String(date.m).padStart(2, '0')
        const day = String(date.d).padStart(2, '0')
        const hour = String(time.h).padStart(2, '0')
        const minute = String(time.m).padStart(2, '0')
        const second = String(time.s).padStart(2, '0')

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    }

    function formatTime(time) {
        if (!time) return null
        const hour = String(time.h).padStart(2, '0')
        const minute = String(time.m).padStart(2, '0')
        const second = String(time.s).padStart(2, '0')
        return `${hour}:${minute}:${second}`
    }

    function parseYYYYMMDD(yyyymmdd) {
        try {
            const split = yyyymmdd.split('-')
            return {
                y: split[0],
                m: split[1],
                d: split[2],
            }
        } catch (e) {
            return null
        }
    }

    function parseHHMMSS(hhmmss) {
        try {
            const split = hhmmss.split(':')
            return {
                h: split[0],
                m: split[1],
                s: split[2],
            }
        } catch (e) {
            return null
        }
    }

    function parseDateDay(dateString) {
        const calendarStartDate = new Date(dateString)
        const day = {
            y: calendarStartDate.getFullYear(),
            m: calendarStartDate.getMonth() + 1,
            d: calendarStartDate.getDate(),
            w: WEEKS[calendarStartDate.getDay()],
        }
        day.f = formatDate(day)
        return day
    }

    return {
        generate,
        formatDate,
        formatDateTime,
        formatTime,
        isAfter,
        parseHHMMSS,
        parseYYYYMMDD,
        parseDateDay,
        diffDay,
        WEEKS,
    }
}
