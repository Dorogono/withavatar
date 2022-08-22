<template>
  <div class="navbar bg-base-100 items-center sticky top-0 px-7">
    <div class="flex mr-10">
      <router-link to="/" class="normal-case text-3xl font-bold">
        withAvatar
      </router-link>
    </div>
    <router-link to="/viewer"> Viewer </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
