<template>
  <div
    class="flex justify-between px-5 h-20 items-center shadow"
    v-for="morph in morphOptions"
    :key="morph[0]"
  >
    <morph-items
      :name="morph[0]"
      :morphList="morphTargets"
      :targetNamesList="morphNames"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import MorphItems from "./MorphItems.vue";

export default defineComponent({
  components: { MorphItems },
  props: ["morphOptions", "morphNames", "morphTargets"],
  setup(props) {
    const { morphOptions, morphNames, morphTargets } = toRefs(props);

    return { morphOptions, morphNames, morphTargets };
  },
});
</script>
