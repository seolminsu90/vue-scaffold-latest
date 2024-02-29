// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 3000
    },
    devtools: {enabled: false},
    vite: {
        vue: {
            customElement: true
        },
        vueJsx: {
            mergeProps: true
        }
    },
    plugins: ['@/plugins/plugin-sample.ts'],
    modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
    css: [
        '@fortawesome/fontawesome-free/css/all.css'
        // css here
    ],
    routeRules: {
        // Path에 따라 랜더링 방식을 다르게 할 수 있다.
        // '/': { prerender: true },
        '/': {ssr: false},
        '/**': {ssr: false},
        '/ssr': {ssr: true},
        '/ssr/**': {ssr: true},
        // '/api/**': { cors: true }
    },
    runtimeConfig: {
        apiSecret: 'this is not public',
        public: {
            apiSecret: 'this is public' // const runtimeConfig = useRuntimeConfig() 로 접근
        }
    },
    experimental: {
        inlineSSRStyles: (id) => !id?.includes('entry')
    }
})
