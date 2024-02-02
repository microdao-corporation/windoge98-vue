  <script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: 'Shutdown',
    setup() {
        const shutdown = () => {
            window.close();
        }
    },
  });
  </script>


<template>
    <div>
        <h1>test</h1>
        <h1>test</h1>
        <h1>test</h1>
    </div>
</template>

<style scoped>
</style>

  