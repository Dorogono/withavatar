<template>
  <section class="flex justify-center items-center w-[1000px] my-0 mx-auto">
    <article class="w-[500px] h-[500px]">
      <Renderer ref="renderer" orbitCtrl resize="true">
        <Camera :position="{ x: 0, y: 0, z: 120 }" :aspect="75" />
        <Scene background="#efede4">
          <AmbientLight />
          <GltfModel
            v-if="!isModelLoading"
            :src="url"
            :position="{ x: 0, y: -55, z: 0 }"
            @load="onLoad"
          />
        </Scene>
      </Renderer>
    </article>
    <article class="overflow-scroll overflow-x-hidden w-[500px] h-[500px]">
      <div class="tabs">
        <button
          class="tab tab-lifted w-1/3 tab-lg"
          id="info"
          @click="handleSelected"
          :class="{ 'tab-active': clickedNav === 'info' }"
        >
          Information
        </button>
        <button
          class="tab tab-lifted w-1/3 tab-lg"
          id="bone"
          @click="handleSelected"
          :class="{ 'tab-active': clickedNav === 'bone' }"
        >
          Bone
        </button>
        <button
          class="tab tab-lifted w-1/3 tab-lg"
          id="morph"
          @click="handleSelected"
          :class="{ 'tab-active': clickedNav === 'morph' }"
        >
          Morph Target
        </button>
      </div>
      <div v-show="clickedNav === 'info'">
        <model-info
          :modelInfo="modelInfo"
          :meshes="meshes"
          :prevMaterial="prevMat"
        ></model-info>
      </div>
      <div v-show="clickedNav === 'bone'">
        <bone-list :bones="boneList" :renderer="renderer"></bone-list>
      </div>
      <div v-show="clickedNav === 'morph'">
        <morph-list
          :morphOptions="morphOptions"
          :morphNames="morphTargetNames"
          :morphTargets="morphTargets"
        ></morph-list>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import MorphList from "../components/MorphList.vue";
import BoneList from "../components/BoneList.vue";
import ModelInfo from "../components/ModelInfo.vue";

import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { MeshBasicMaterial } from "three";

export default {
  components: { MorphList, BoneList, ModelInfo },
  setup() {
    const jszip = new JSZip();
    const zipURL = "baelz/baelz.zip";

    const renderer = ref(null);
    const isModelLoading = ref(true);
    const clickedNav = ref("info");
    const morphChecked = ref(false);
    const wireframeChecked = ref(false);

    const url = ref("");
    const model = ref<any>(null);
    const meshes = ref<any>({});
    const prevMat = ref<any>({});
    const morphTargets = ref<any>(null);
    const morphTargetNames = ref<any>(null);
    const morphOptions = ref({});
    const boneList = ref({});
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
      model.value = mesh;
      mesh.traverse((child: any) => {
        if (child.isMesh) {
          meshes.value[child.name] = child;
          prevMat.value[child.name] = child.material;
          modelInfo.vertexes += child.geometry.attributes.position.count;
          child.material.morphtargets = true;
          if (child.morphTargetInfluences) {
            morphTargets.value = child.morphTargetInfluences;
          }
          if (child.morphTargetDictionary) {
            morphTargetNames.value = child.morphTargetDictionary;
          }
        }
        if (child.isBone) {
          boneList.value[child.name] = child;
        }
        if (morphTargets.value && morphTargetNames.value) {
          morphOptions.value = Object.entries(
            getListOfMorphTargets(morphTargets.value, morphTargetNames.value)
          );
        }
      });
    }

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
          meshes.value[mesh].material = prevMat.value[mesh];
        });
      }
    }

    function getListOfMorphTargets(morphT: Object, morphN: Object) {
      const morphMap = {};
      const morphArr = Object.entries(morphN);

      morphArr.forEach((morph) => {
        morphMap[morph[0]] = morphT[`${morph[1]}`];
      });

      return morphMap;
    }

    function handleSelected({ target }) {
      clickedNav.value = target.id;
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
      renderer,
      modelInfo,
      handleSelected,
      clickedNav,
      viewWireframe,
      wireframeChecked,
      morphChecked,
      morphTargets,
      morphTargetNames,
      boneList,
      meshes,
      prevMat,
    };
  },
};
</script>
