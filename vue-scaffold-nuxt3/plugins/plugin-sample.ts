export default defineNuxtPlugin({
    name: 'my-plugin',
    enforce: 'pre', // or 'post'
    async setup(nuxtApp) {
        // 기존의 vueApp에서 등록하던 플러그인들은 아래처럼 등록한다.
        // nuxtApp.vueApp.use(Toast)
    },
    hooks: {
        'app:created'() {
            const nuxtApp = useNuxtApp()
        }
    }
})
