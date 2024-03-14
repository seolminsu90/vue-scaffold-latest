<template>
  <div>
    <Button label="Submit"/>
    <Button label="Go to PrimeVue Website" :to="{ path: 'https://www.primefaces.org/primevue/' }"/>
    <div>

      <!-- <ComponentTag pt:[passthrough_key]:[attribute]="value" />-->
      <Panel
          pt:root:class="border-1 border-solid"
          pt:header:id="headerId"
          pt:header:data-test-id="testId"
          pt:header:class="bg-blue-500"
      >
        Test Path Through (근데 아직은 굳이 용도가 흠..)
      </Panel>
    </div>
  </div>
</template>
<script setup>
import Button from 'primevue/button';
</script>