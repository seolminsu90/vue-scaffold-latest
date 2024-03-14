<template>
  <div class="card">
    <Menubar :model="items">

      <template #end>
        <div class="flex align-items-center gap-2">
          <InputText placeholder="Search" type="text" class="w-8rem sm:w-auto"/>
        </div>
      </template>
    </Menubar>

  </div>
</template>

<script setup>
import {ref} from "vue";
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import {useThemes} from "@/composables/useThemes.js";

const {
  theme,
  themes
} = useThemes();

const items = ref([
  {
    label: 'Themes',
    icon: 'pi pi-search',
    items: themes
  },
  {
    label: theme,
  }
]);

</script>
<style scoped>
:deep(.p-menubar) {
  border-radius: 0;
}
</style>