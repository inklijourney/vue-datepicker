# DatePicker



##  安装

```bash
npm i @inkli/vue-datepicker
```



## 使用

**在你的Vue 3应用程序中引入@inkli/vue-datepicker 并将其添加到组件中：**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import DatePicker from '@inkli/vue-datepicker'
import '@inkli/vue-datepicker/style.css'

const date = ref(new Date())
</script>

<template>
  <DatePicker v-model="date" />
</template>

<style scoped>
</style>
```



## demo

| <img src="https://img.zishuo.online/i/2023/09/02/64f33ffd53cb2.png" alt="3.png" style="zoom: 50%;" /> | <img src="https://img.zishuo.online/i/2023/09/02/64f33ffd53ade.png" alt="2.png" style="zoom: 50%;" /> | <img src="https://img.zishuo.online/i/2023/09/02/64f33ffd531ad.png" alt="1.png" style="zoom:50%;" /> |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |



## Attributes

|    属性名    |             类型              | **默认值** |
| :----------: | :---------------------------: | :--------: |
|   **mode**   | 'date' \| 'dateTime' \|'time' |    date    |
| **dateMode** |       'month' \| 'week'       |   month    |
| **timeMode** |     'default' \| 'simple'     |  default   |
|  **format**  |            string             |            |



## Slots

| 插槽名  | **说明** |
| :-----: | :------: |
| default |          |
