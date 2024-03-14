<template>

  <nav class="flex justify-content-start">
    <Menu :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ navigate }" :to="item.route" custom>
          <a v-ripple v-bind="props.action" @click="navigate">
            <span :class="item.icon"/>
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" v-bind="props.action">
          <span :class="item.icon"/>
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </nav>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from 'vue-router';

const router = useRouter();

const items = ref([
  {
    label: 'LoginPage1',
    icon: 'pi pi-palette',
    route: '/login'
  },
  {
    label: 'LoginPage2',
    icon: 'pi pi-link',
    command: () => {
      router.push('/login');
    }
  },
  {
    separator: true
  }
]);
</script>
<style scoped>
nav {
  width: 220px;
  height: 100vh;
  position: fixed;

  &:deep(.p-menu) {
    border-radius: 0;
    border-top: none;
    border-bottom: none;
    border-left: none;
    width: 100%;
    height: 100%;
  }
}

</style>
