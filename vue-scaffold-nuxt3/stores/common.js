import {defineStore} from 'pinia'

export const useCommonStore = defineStore('store-ids', {
    state: () => ({
        key: "myValue"
    }),
    getters: {
        getKey: (state) => state.key,
    },
    actions: {
        setKey(value) {
            this.key = value
        }
    },
    persist: {
        storage: persistedState.cookies // 상태를 persisted 할 저장소 명
    }
})
