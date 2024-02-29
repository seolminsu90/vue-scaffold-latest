<template>
  <div>
    이 페이지는 ssr로 처리되요.
    F12를 통해 랜더링 전에 값들이 변경되는 것을 볼 수 있어요.
  </div>
</template>
<script setup lang="ts">
const test = ref("Test OG tags")
const {data: dataName} = await useAsyncData<string>('data', async () => {
  // 이 블럭은 서버에서 deserialize됩니다. 
  // [nuxt] [request error] [unhandled] [500] Cannot stringify a function 에러가 최초 한번 발생하는데,, 함수 관련 serialize 에러로 보임(작동은 정상)
  // experimental: { renderJsonPayloads: false }을 추가하면 조금 간단해짐 에러만.. 그래도 뜸..
  
  // const Axios = useAxios()
  //const res = Axios.get('/api/status')
  return '동적 서버 사이드 랜더링을 처리해요'
})

console.log(dataName) // ref로감싸진 데이터로 나옵니다.

useSeoMeta({
  title: '페이지 타이틀',
  ogTitle: () => (test.value ? test.value : 'n'),
  description: () => (test.value ? test.value : 'n'),
  ogDescription: () => (test.value ? test.value : 'n'),
  ogImage: () => (test.value ? test.value : 'n')
})
</script>
