<template>
  <div>
    인덱스 페이지
    라우팅 처리는 폴더 구조로 처리된다.

    기본 구성만 담았기에 알아서 개발~~
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'my-layout',
  middleware: ['auth'],
  roles: ['Admin']
})
</script>