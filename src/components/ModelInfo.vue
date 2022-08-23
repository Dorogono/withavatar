<template>
  <div class="flex">
    <div class="stat">
      <div class="stat-title">Vertexes</div>
      <div class="stat-value text-primary text-3xl overflow-hidden">
        {{ toNumberFormat(modelInfo.vertexes) }}
      </div>
    </div>
    <div class="stat">
      <div class="stat-title">Triangles</div>
      <div class="stat-value text-primary text-3xl overflow-hidden">
        {{ toNumberFormat(modelInfo.triangles) }}
      </div>
    </div>
    <div class="stat">
      <label class="swap text-xl">
        <input
          type="checkbox"
          v-model="wireframeChecked"
          @click="viewWireframe"
        />
        <div class="swap-on btn bg-accent">Hide Wireframe</div>
        <div class="swap-off btn">Show Wireframe</div>
      </label>
    </div>
  </div>
  <hr />
  <div class="hero flex mb-10">
    <div class="hero-content flex-col items-start">
      <h1 class="font-bold text-4xl">Mouse Event</h1>
      <ol>
        <li>1. 상하좌우로 드래그해 모델을 둘러보세요.</li>
        <li>2. 오른쪽 버튼으로 화면 이동이 가능합니다.</li>
        <li>3. 마우스 휠로 확대/축소가 가능합니다.</li>
      </ol>
    </div>
  </div>
  <button
    class="w-1/2 btn left-1/4 relative outline outline-offset-2 outline-2 outline-pink-500 bg-red-200 border-none text-[#000] hover:outline-blue-500 hover:text-[#fff]"
    @click="downloadFile"
  >
    Avatar Download
  </button>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref } from "vue";
import { toNumberFormat } from "../helpers/helpers";
import { saveAs } from "file-saver";
import { MeshBasicMaterial } from "three";

export default defineComponent({
  props: ["modelInfo", "meshes", "prevMaterial"],
  setup(props) {
    const { modelInfo, meshes, prevMaterial } = toRefs(props);
    const wireframeChecked = ref(false);

    function viewWireframe() {
      if (wireframeChecked.value === false) {
        Object.keys(meshes.value).map((mesh) => {
          meshes.value[mesh].material = new MeshBasicMaterial({
            color: 0xff00ff,
            wireframe: true,
          });
        });
      } else {
        Object.keys(meshes.value).map((mesh) => {
          meshes.value[mesh].material = prevMaterial.value[mesh];
        });
      }
    }

    function downloadFile() {
      saveAs("baelz/baelz-fbx.zip", "baelz-fbx.zip");
    }

    return {
      modelInfo,
      toNumberFormat,
      downloadFile,
      wireframeChecked,
      viewWireframe,
    };
  },
});
</script>
