<template>
  <Renderer ref="renderer" orbitCtrl width="500" height="500">
    <Camera :position="{ z: 10 }" />
    <Scene>
      <AmbientLight />
      <FbxModel src="shoes.fbx" @load="onLoad" />
    </Scene>
  </Renderer>
  <input type="file" accept="image/*" @change="handleTexture" />
  <img :src="inputImageTexture" />
</template>

<script lang="ts">
import { ref } from "vue";
import { MeshStandardMaterial, TextureLoader } from "three";

export default {
  setup() {
    const model = ref();
    const inputImageTexture = ref("");

    function onLoad(object: any) {
      model.value = object.children[0];
    }

    function handleTexture(e: any) {
      const [file] = e.target.files;
      if (file) {
        inputImageTexture.value = URL.createObjectURL(file);
      }

      const texture = new TextureLoader().load(inputImageTexture.value);
      if (model.value) {
        model.value.material = new MeshStandardMaterial({
          map: texture,
        });
      }
    }

    return { onLoad, handleTexture, inputImageTexture };
  },
};
</script>
