<template>
  <div class="mx-auto w-full flex justify-center">
    <canvas id="webgl" class="border w-[500px] h-[500px] webgl"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Viewer from "../modules/Viewer";

export default defineComponent({
  mounted() {
    const canvas = document.getElementById("webgl");
    if (canvas) {
      new Viewer(canvas, "asd");
    }
  },
});
</script>
