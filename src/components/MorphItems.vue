<template>
  <div class="text-2xl font-normal">{{ name }}</div>
  <input
    type="checkbox"
    class="toggle"
    v-model="morphChecked"
    @click="onChangeValue"
    :id="name"
  />
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";

export default defineComponent({
  props: ["name", "morphList", "targetNamesList"],
  setup(props) {
    const { name, morphList, targetNamesList } = toRefs(props);
    const morphChecked = ref(false);

    function onChangeValue({ target }) {
      const idx = targetNamesList.value[target.id];
      if (!morphChecked.value) {
        morphList.value[idx] = 1;
        target.parentNode.classList.add("bg-accent");
      } else {
        target.parentNode.classList.remove("bg-accent");
        morphList.value[idx] = 0;
      }
    }

    return { name, onChangeValue, morphChecked };
  },
});
</script>
