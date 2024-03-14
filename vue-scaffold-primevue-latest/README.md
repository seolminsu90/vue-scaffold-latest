# vue-scaffold-primevue

[Primevue][ref] 기반의 완전 기본 구성만 되어있는 vue sample   
여러 프로젝트에 동일하게 사용하면 디자인 일관성이 유지는 될듯   
러닝 커브가 조금 있어서 일일히 API 참조해야 하고, 세부 커스텀이 어려운 단점이 있다.   
기존 스타일과 짬뽕해서 쓰면 괜찮을 것 같다.

- vue3
- pinia
- router
- axios
- docker (+ nginx)
- primevue

살은 하나하나 직접 붙여야 한다.

## Project Setup

```sh
npm install
npm run dev
```

```sh
docker-compose up
```

### 전역 폰트 조절

```css
/* main.scss*/
html { 
    font-size: 14px;
}
```

```javascript 
document.documentElement.style.fontSize = '16px';
```

### 숏 링크

[테마 선택][ref2]
[아이콘 목록][ref3]
[CSS 유틸리티][ref4]

### 기타

- 테마를 선택형으로 쓰려면, useTheme목록에서 사용할 테마만 node_modules에서 public/themes에 넣어서 사용해야한다. (index.html이 교체되는 방식)
- Bootstrap theme css랑 겹치면 UI 다깨진다. 흠... 몇개는 커스텀으로 정의해서 따로 써야할 것 같다.
- API server와 /api/** 으로 proxy 되어있다. (localhost:3000)


[ref][https://primevue.org/vite/]
[ref2][https://primevue.org/theming/#themes]
[ref3][https://primevue.org/icons/]
[ref4][https://primeflex.org/]
