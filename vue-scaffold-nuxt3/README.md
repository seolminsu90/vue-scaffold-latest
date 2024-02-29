# Nuxt3 Vue3 Scaffold

기본 프로젝트 만들때 뼈대로 참조할 용도

```bash
# 프로덱트의 생성
npx nuxi@latest init vue-scaffold-nuxt3
```

#### Nuxt SSR 처리 메모

**기본적인 사용**   
   
```javascript
const { id } = useRoute().params

const { data, error } = await useAsyncData(`user:${id}`, () => {
  return myGetFunction('users', { id })
})
```

useAsyncData의 첫번째 인수는 응답을 캐시하는 데 사용되는 데이터 캐싱 키이다.

**useFetchuseAsyncData아래 나열된 것과 동일한 반환 값을 갖는다.**   
   
data: 전달된 비동기 함수의 결과.   
pending: 데이터를 아직 가져오는 중인지 여부를 나타내는 부울.   
refresh/ execute: 함수에서 반환된 데이터를 새로 고치는 데 사용할 수 있는 함수 handler.   
error: 데이터 가져오기에 실패한 경우 오류 개체.   
status: 데이터 요청 상태를 나타내는 문자열( "idle", "pending", "success", "error").   

**패치 데이터의 리턴값**   
   
```html
<script setup lang="ts">
const { data, error, execute, refresh } = await useFetch('/api/users')
</script>

<template>
  <div>
    <p>{{ data }}</p>
    <!-- 데이터를 새로 가져오거나 실행 필요 시 -->
    <button @click="refresh">Refresh data</button>
  </div>
</template>

```

**패치 데이터 리턴 시 주의**
```javascript
const { data: test } = await useAsyncData('data-key', async () => {
    return {
        name: 'babo',
        func: () => ({ 1234: '1234' })
    }
})

console.log(test.value)
```
위처럼 실행해보면 함수 직렬화 오류가 발생하며, 콘솔에 func는 찍히지 않는 것을 알 수 있다   
*JSON.stringify*가 적용되는 항목만 리턴이 가능하다(커스텀 가능하지만 굳이..)



[참조][ref]   
[데이터 패치 방법 차이][ref2]

[ref]: https://nuxt.com/docs/getting-started/data-fetching
[ref2]: https://jongmin4943.tistory.com/entry/Nuxt3-fetch-useAsyncData-useFetch-%EC%9D%98-%EC%B0%A8%EC%9D%B4


---

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
