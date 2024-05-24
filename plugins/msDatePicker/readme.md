#### datepicker vue3

제일 자주 쓰는 포맷 및 사용 사례만 집약해서 플러그인화 시킴.   
자유롭게 커스터마이징 하기엔 일반 라이브러리 사용이 너무 번거로워서 만듬.   


#### 설치

**main.js**
```javascript
import MsDatepicker from '@/plugins/msDatePicker/ms-datepicker.js'
const app = createApp(App)
app.use(MsDatepicker)
```

#### 사용

```vue
<MsDatePicker v-model="date" />
<MsDatePicker v-model="date1" type="date" />
<MsDatePicker v-model="date2" type="time" />
<MsDatePicker v-model="date3" :range="true" :is-auto-swap="false" />
<MsDatePicker v-model="date4" :range="true" type="time" />
```

> range의 경우 start,end 배열 형태로 리턴함.
> yyyy-MM-dd HH:mm:ss 를 기본 포맷으로 사용. 이외에는 쓸일이 없어서 구현안함.
