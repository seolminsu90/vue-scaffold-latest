# Vue 관련 여러가지 scaffold 저장

뷰 신규 프로젝트를 만들때 각 항목들을 부분적으로 참조해서 사용하는 용도.

컴포넌트(페이징,테이블) 등은 이전 old 세대 참조

기본 구성으로 생각할 것들...

- 어떤 뷰 버전 (vue3)
- AJAX 요청은 어떤걸 (Axios, fetch, JQuery)
- 저장소를 (pinia / vuex)
- SPA 라우터 설정
- 공통 라이브러리들 (toast, datepicker, dayjs, xlsx 등등..)
- Prettier / ESLint / editconfig

---
# HISTORY

## Nuxt3 버전의 scaffold 추가
- 기본 상태 저장소로 pinia 사용 (vuex보다 훨씬 모듈링이 편하고 사용도 간편함)
- 대부분 내부서비스 하느랴 SSR의 이점이 굳이 없긴 하지만 만들어놓음

## Vue3 composite api 버전의 scaffold 추가
- 기본 골격만 저장

