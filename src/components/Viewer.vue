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
      <div>{{ modelInfo.vertexes }}, {{ modelInfo.triangles }}</div>
      <div
        class="flex justify-between px-5 h-20 items-center shadow"
        v-for="morph in morphOptions"
        :key="morph[0]"
      >
        <div class="text-2xl font-normal">{{ morph[0] }}</div>
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
import { ref, reactive } from "vue";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";

export default {
  setup() {
    const jszip = new JSZip();
    const zipURL = "baelz/baelz.zip";

    const renderer = ref(null);
    const isModelLoading = ref(true);
    const url = ref("");
    const morphTargets = ref<any>(null);
    const morphTargetNames = ref<any>(null);
    const morphOptions = ref({});
    const modelInfo = reactive({
      vertexes: 0,
      triangles: 0,
    });

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

    function onLoad(obj: any) {
      const mesh = obj.scene;
      mesh.traverse((child: any) => {
        if (child.isMesh) {
          modelInfo.vertexes += child.geometry.attributes.position.count;
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
        target.parentNode.classList.add("bg-accent");
      } else {
        target.parentNode.classList.remove("bg-accent");
        morphTargets.value[idx] = 0;
      }
    }

    function getTriangles() {
      if (
        renderer.value?.["renderer"]?.["info"]?.["render"]?.["triangles"] !==
          0 &&
        renderer.value
      ) {
        modelInfo.triangles =
          renderer.value?.["renderer"]?.["info"]?.["render"]?.["triangles"];
      } else {
        requestAnimationFrame(getTriangles);
      }
    }

    getTriangles();

    return {
      url,
      isModelLoading,
      onLoad,
      morphOptions,
      onMorphValueChange,
      renderer,
      modelInfo,
    };
  },
};
</script>

<style scoped>
.options {
  width: 500px;
  height: 500px;
}
</style>
