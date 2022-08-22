<template>
  <div
    class="flex justify-between px-5 h-20 items-center shadow"
    v-for="bone in bones"
    :key="bone.name"
  >
    <bone-items :name="bone.name" :boneList="bones" :renderer="renderer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import BoneItems from "./BoneItems.vue";

export default defineComponent({
  components: { BoneItems },
  props: ["bones", "renderer"],
  setup(props) {
    const { bones, renderer } = toRefs(props);

    return { bones, renderer };
  },
});
</script>
