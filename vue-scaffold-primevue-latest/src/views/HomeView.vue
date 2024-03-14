<template>
  <HeaderLayout/>
  <div>
    <SidebarLayout/>
    <div class="content-wrapper">
      <RouterView class="p-2"/>
    </div>
  </div>
</template>
<script setup>
import {RouterView} from "vue-router";
import HeaderLayout from "@/components/HeaderLayout.vue";
import SidebarLayout from "@/components/SidebarLayout.vue";
</script>
<style scoped>
.content-wrapper {
  width: calc(100% - 220px);
  padding-left: 220px;
}
</style>