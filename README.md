# Vue 관련 여러가지 scaffold 저장

뷰 신규 프로젝트를 만들때 각 항목들을 부분적으로 참조해서 사용하는 용도.

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

---

## purple-admin-vue3-sample 추가
- PurpleAdmin 테마를 Vue3 프로젝트에 정리
- Composition api setup 활용하기
- sass Warning이 뜨는데 (color 관련..) 추후 sass 버전업 되면 없어질 것으로 보임 ㅡㅡ;

[공홈][ref] 참조

---

## vue 3이 기본 생성 버전이 되었고 vue 2.x에 비해 달라진것들이 많아서 샘플 골격 프로젝트 저장용
- 실무하며 공용으로 사용할만한 것들 메모
- 실무에 사용할만 한 것들 기록하여 필요할 때 사용할 용도
- vue-scaffold-after 가 얼추 어드민페이지 사용할 기본 뼈대 완성
- nust-scaffold 생성해서 ssr기반 뼈대도 구축(TODO)

### 메모
- 대규모 개발 시엔 composition API로 코드 재사용..(생소)
- vuex-persistedstate
- vue-bootstrap3 이 알파버전이라 아직은 안되는것들이 조금 있다
  - https://cdmoro.github.io/bootstrap-vue-3
  - 테마도 딱히 찾기 힘든 상태
- 아직까지는 vue2.x, bootstrap4.x 기반으로 하는게 나을 듯. 
  - bootstrap-vue 무료 테마도 제공한다(Argon). 레포지토리 내 참조
  - 아니면 admin-lte 같은 테마의 js/css만 받아서 써도 무방은 할듯.(대신 jquery씀..)
- 부트스트랩 css 테마 사이트
  - bootswatch.com css 다운로드 후 Import 하면 적용됨


[ref]: https://vuejs.org/api/composition-api-setup.html
