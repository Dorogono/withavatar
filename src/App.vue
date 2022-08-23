<template>
  <the-header />
  <main>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from "./components/TheHeader.vue";

export default defineComponent({
  components: {
    TheHeader,
  },
});
</script>
