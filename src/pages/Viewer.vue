<template>
  <section class="flex justify-center items-center py-10 w-[1000px]">
    <article class="w-[500px] h-[500px]">
      <Renderer ref="renderer" orbitCtrl resize="true">
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
      <div v-if="clickedNav === 'info'">
        <div>Vertexes : {{ modelInfo.vertexes }}</div>
        <div>Triangles : {{ modelInfo.triangles }}</div>
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
      <div v-if="clickedNav === 'bone'">
        <label class="swap text-xl">
          <input type="checkbox" v-model="boneChecked" @click="viewBones" />
          <div class="swap-off btn">Show Bones</div>
          <div class="swap-on btn bg-accent">Hide Bones</div>
        </label>
      </div>
      <div v-show="clickedNav === 'morph'">
        <div
          class="flex justify-between px-5 h-20 items-center shadow"
          v-for="morph in morphOptions"
          :key="morph[0]"
        >
          <morph-items
            :name="morph[0]"
            :morphList="morphTargets"
            :targetNamesList="morphTargetNames"
          />
        </div>
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { MeshBasicMaterial, SkeletonHelper } from "three";
import MorphItems from "../components/MorphItems.vue";

export default {
  components: { MorphItems },
  setup() {
    const jszip = new JSZip();
    const zipURL = "baelz/baelz.zip";

    const renderer = ref(null);
    const isModelLoading = ref(true);
    const url = ref("");
    const model = ref<any>(null);
    const meshes = ref<any>({});
    const prevMat = ref<any>({});
    const morphTargets = ref<any>(null);
    const morphTargetNames = ref<any>(null);
    const morphOptions = ref({});
    const modelInfo = reactive({
      vertexes: 0,
      triangles: 0,
    });
    const boneChecked = ref(false);
    const wireframeChecked = ref(false);
    const clickedNav = ref("info");
    const morphChecked = ref(false);

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

    function viewBones() {
      let skeleton: SkeletonHelper;
      const scene: any = renderer.value?.["scene"];
      if (boneChecked.value === false) {
        skeleton = new SkeletonHelper(model.value);
        scene.add(skeleton);
      } else {
        scene.remove(scene.children[scene.children.length - 1]);
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
      viewBones,
      boneChecked,
      wireframeChecked,
      morphChecked,
      morphTargets,
      morphTargetNames,
    };
  },
};
</script>
