/*

간혹 빌드 시 서버 사이드 랜더링 시 플러그인을 사용할 수 없는 에러가 발생하는 플러그인들이 있는데 (nuxt용 플러그인이 아닌 경우 들),
아래 처럼 등록, provide를 통해 $toast 처럼 사용이 가능하다(서버 사이드에서 사용)
또한 process.client, process.server 를 통해, 랜더링 영역에 따른 분리가 가능하니 참고할 것

import * as vt from 'vue-toastification'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vt.default, {
        transition: 'Vue-Toastification__fade',
        maxToasts: 1
    })

    return {
        provide: {
            toast: vt.useToast()
        }
    }
})


*/
