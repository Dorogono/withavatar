<template>
  <section class="flex">
    <Renderer ref="renderer" orbitCtrl width="500" height="500">
      <Camera :position="{ x: 0, y: 0, z: 120 }" :aspect="75" />
      <Scene background="gray">
        <AmbientLight />
        <GltfModel
          v-if="!isModelLoading"
          :src="url"
          :position="{ x: 0, y: -55, z: 0 }"
          @load="onLoad"
        />
      </Scene>
    </Renderer>
    <article class="overflow-scroll options overflow-x-hidden">
      <div
        class="flex justify-between w-full"
        v-for="morph in morphOptions"
        :key="morph[0]"
      >
        <div>{{ morph[0] }}</div>
        <input
          type="checkbox"
          class="toggle"
          @click="onMorphValueChange"
          :id="morph[0]"
        />
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { ref } from "vue";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";

export default {
  setup() {
    const jszip = new JSZip();
    const isModelLoading = ref(true);
    const url = ref("");
    const zipURL = "baelz/baelz.zip";
    const morphTargets = ref<any>(null);
    const morphTargetNames = ref<any>(null);
    const morphOptions = ref({});

    JSZipUtils.getBinaryContent(zipURL, (err, data) => {
      jszip.loadAsync(data).then((zip) => {
        zip.forEach((filename) => {
          const file = zip.file(filename);
          file?.async("arraybuffer").then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/octet-stream",
            });
            url.value = URL.createObjectURL(blob);
            isModelLoading.value = false;
          });
        });
      });
    });

    function onLoad(obj) {
      const mesh = obj.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.material.morphtargets = true;
          if (child.morphTargetInfluences) {
            morphTargets.value = child.morphTargetInfluences;
          }
          if (child.morphTargetDictionary) {
            morphTargetNames.value = child.morphTargetDictionary;
          }
        }
        if (child.name === "Armature") {
          // console.log(child);
        }
        if (morphTargets.value && morphTargetNames.value) {
          morphOptions.value = Object.entries(
            getListOfMorphTargets(morphTargets.value, morphTargetNames.value)
          );
        }
      });
    }

    function getListOfMorphTargets(morphT: Object, morphN: Object) {
      const morphMap = {};
      const morphArr = Object.entries(morphN);

      morphArr.forEach((morph) => {
        morphMap[morph[0]] = morphT[`${morph[1]}`];
      });

      return morphMap;
    }

    function onMorphValueChange({ target }) {
      const idx = morphTargetNames.value[target.id];
      if (morphTargets.value[idx] === 0) {
        morphTargets.value[idx] = 1;
      } else {
        morphTargets.value[idx] = 0;
      }
    }

    return { url, isModelLoading, onLoad, morphOptions, onMorphValueChange };
  },
};
</script>

<style scoped>
.options {
  width: 500px;
  height: 500px;
}
</style>
