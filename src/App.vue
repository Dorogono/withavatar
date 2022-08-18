<template>
  <the-header></the-header>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from "./components/TheHeader.vue";

export default defineComponent({
  components: {
    TheHeader,
  },
  setup() {},
});
</script>
