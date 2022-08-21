<template>
  <div class="navbar bg-base-100 items-center sticky top-0 px-7">
    <div class="flex-1">
      <router-link to="/" class="normal-case text-3xl font-bold">
        withAvatar
      </router-link>
    </div>
    <div class="flex-none tabs tabs-boxed">
      <router-link to="/viewer" class="tab"> Viewer </router-link>
      <router-link to="/" class="tab"> Editor </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
