# MsVirtualScroll 사용법

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `unique` | `String` | - | 인스턴스 식별자. `saveScroll` 사용 시 필수, 여러 인스턴스 공존 시 key 충돌 방지 |
| `items` | `Array` | `[]` | 렌더링할 아이템 배열 |
| `height` | `Number \| String` | - | 컨테이너 높이. 숫자면 px, 문자열이면 CSS 값 그대로 사용 (예: `500`, `'calc(100vh - 100px)'`) |
| `rowHeight` | `Number` | `40` | 고정 높이 모드의 행 높이(px). autoHeight 모드에서는 초기 추정값 |
| `autoHeight` | `Boolean` | `false` | 각 아이템의 실제 렌더링 높이를 자동 측정해 가변 높이 지원 |
| `overscan` | `Number` | `5` | 뷰포트 앞뒤로 미리 렌더링할 아이템 수 |
| `bottomGap` | `Number` | `0` | 리스트 하단 여백(px) |
| `saveScroll` | `Boolean` | `false` | 스크롤 위치를 localStorage에 저장하고 마운트 시 복원. `unique`와 함께 사용 |
| `disableVirtualScroll` | `Boolean` | `false` | 가상 스크롤 비활성화, 모든 아이템을 한 번에 렌더링 |
| `groupKey` | `String` | `null` | 동일한 key를 가진 인스턴스들의 스크롤 위치를 동기화. `v-model:groups`와 함께 사용 |

---

## Slots

| Slot | Props | 설명 |
|------|-------|------|
| `header` | - | 스크롤 시 상단 고정되는 헤더 영역 |
| `item` | `item`, `index` | 각 아이템 행 렌더링 |

---

## 기본 사용 예시

### 고정 높이 모드
```vue
<MsVirtualScroll
  :items="list"
  :height="500"
  :row-height="40"
>
  <template #item="{ item, index }">
    <div>{{ index }}: {{ item.name }}</div>
  </template>
</MsVirtualScroll>
```

### 가변 높이 모드 (autoHeight)
```vue
<MsVirtualScroll
  :items="list"
  :height="500"
  :row-height="40"
  auto-height
>
  <template #item="{ item }">
    <div>{{ item.description }}</div>
  </template>
</MsVirtualScroll>
```

### 헤더 + 스크롤 위치 저장
```vue
<MsVirtualScroll
  unique="user-list"
  :items="list"
  :height="600"
  :row-height="40"
  save-scroll
>
  <template #header>
    <div class="table-header">이름 / 나이 / 직책</div>
  </template>
  <template #item="{ item }">
    <div>{{ item.name }}</div>
  </template>
</MsVirtualScroll>
```

### 스크롤 위치 동기화 (groupKey)
여러 컬럼이 나란히 있을 때 세로 스크롤을 연동합니다.
```vue
<script setup>
const sharedGroups = ref({})
</script>

<template>
  <div style="display: flex">
    <MsVirtualScroll
      v-model:groups="sharedGroups"
      group-key="main-table"
      :items="columnA"
      :height="500"
      :row-height="40"
    >
      <template #item="{ item }">
        <div>{{ item.name }}</div>
      </template>
    </MsVirtualScroll>

    <MsVirtualScroll
      v-model:groups="sharedGroups"
      group-key="main-table"
      :items="columnB"
      :height="500"
      :row-height="40"
    >
      <template #item="{ item }">
        <div>{{ item.value }}</div>
      </template>
    </MsVirtualScroll>
  </div>
</template>
```

---

## 주의사항

- `saveScroll` 사용 시 반드시 `unique` prop을 지정해야 인스턴스 간 localStorage key 충돌이 없습니다.
- `groupKey` 사용 시 부모에서 `ref({})` 로 만든 객체를 `v-model:groups` 로 전달해야 합니다.
- `autoHeight` 모드에서 `rowHeight`는 측정 전 초기 추정값으로만 사용됩니다. 실제 행 높이와 가까울수록 초기 렌더링 정확도가 높아집니다.
- `disableVirtualScroll`은 아이템 수가 적거나 디버깅 시에만 사용하세요. 아이템이 많으면 성능 저하가 발생합니다.
