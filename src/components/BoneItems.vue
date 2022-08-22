<template>
  <div class="text-2xl font-normal">{{ name }}</div>
  <input
    type="checkbox"
    class="toggle"
    v-model="boneChecked"
    @click="showBone"
    :id="name"
  />
</template>

<script lang="ts">
import { SkeletonHelper } from "three";
import { defineComponent, toRefs, ref } from "vue";

export default defineComponent({
  props: ["name", "boneList", "renderer"],
  setup(props) {
    const { name, boneList, renderer } = toRefs(props);
    const boneChecked = ref(false);
    const selectedBone = ref({});

    function showBone({ target }) {
      const name = target.id;
      const bone = boneList.value[name];
      const scene: any = renderer.value?.["scene"];
      console.log(scene.children);
      if (!boneChecked.value) {
        target.parentNode.classList.add("bg-accent");
        const skeleton = new SkeletonHelper(bone);
        skeleton.name = name;
        selectedBone.value[name] = skeleton.name;
        scene.add(skeleton);
      } else {
        const skeletonName = selectedBone.value[name];
        console.log(skeletonName);
        const selectedInScene = scene.children.findIndex(
          (child) => child.name === skeletonName
        );
        target.parentNode.classList.remove("bg-accent");
        scene.remove(scene.children[selectedInScene]);
      }
    }

    return { name, boneChecked, showBone };
  },
});
</script>
