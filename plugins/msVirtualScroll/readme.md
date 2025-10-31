#### Virtual scroll sample

- vue3, bootstrap(css)를 이용합니다.

### 📦 Props

| Prop 이름     | 타입                  | 필수 여부 | 기본값    | 설명 |
|---------------|-----------------------|-----------|-----------|------|
| `items`       | `Array`               | ✅        | -         | 렌더링할 전체 아이템 배열이에요. |
| `height`      | `Number` \| `String`  | ✅        | -         | 스크롤 영역의 높이 지정 값이에요. `100px`, `100%`, `100vh` 등도 가능해요! |
| `saveScroll`  | `Boolean`             | ❌        | `false`   | 스크롤 위치를 `localStorage`에 저장하고 복원할지 여부예요. |
| `rowHeight`   | `Number`              | ❌        | `40`      | 아이템의 기본(예상) 높이 값이에요. `autoHeight`가 꺼져있을 때 사용돼요. |
| `autoHeight`  | `Boolean`             | ❌        | `false`   | 아이템 높이를 실제 DOM 기준으로 자동 측정할지 여부예요. 켜면 `ResizeObserver`를 사용해요. |
| `overscan`    | `Number`              | ❌        | `5`       | 화면 위·아래로 렌더링할 여분 아이템 개수예요. 성능과 부드러운 스크롤을 위해 사용해요. |
| `bottomGap`    | `Number`              | ❌        | `0`       | 테이블 최하단의 여백을 주고싶을 때 사용해요. |
| `disableVirtualScroll`    | `Boolean`              | ❌        | false       | 가상 테이블 기능을 끄고싶을 때, 사용해요. 부분 로드 기능이 적용되지 않아요. |
| `groupKey`  | `String`  |❌ |null|테이블간 스크롤 동기화|


*아래와 같이 사용*

```vue
<MsVirtualScroll :items="itemsAll" height="20vh" :auto-height="true" :rowHeight="41">
  <template #default="{ item, index }">
    <div>
      <div>{{ item.name }}</div>
      <div style="white-space: pre-wrap;">{{ item.description }}</div>
      <!-- 커스터마이즈 가능한 내용들 -->
    </div>
  </template>
</MsVirtualScroll>

const groups = ref({}) // 그룹화 할 경우 상위 바인딩 객체

const itemsAll = ref([
  {name: 'Item 1', description: 'Description for Item 1'},
  {name: 'Item 2', description: 'Description for Item 2'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 4', description: 'Description for Item 3'},
  {name: 'Item 5', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3Description for\n Item 3Description for Item 3Description\n for Item 3Description for \nItem 3Description for Item 3Des\ncription for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 3', description: 'Description for Item 3'},
  {name: 'Item 300', description: 'Description for Item 3'}
  // ... (많은 아이템들)
])
```

기본적인 무한 스크롤 동작에 대한 구현이며, 세부적인 사항은 추가 구현해서 쓰면 됨
