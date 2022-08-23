<template>
  <back-video />
  <product-list />
  <introduct-product />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BackVideo from "../components/BackVideo.vue";
import IntroductProduct from "../components/IntroduceProduct.vue";
import ProductList from "../components/ProductList.vue";

export default defineComponent({
  components: { BackVideo, IntroductProduct, ProductList },
  setup() {},
});
</script>
