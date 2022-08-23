<template>
  <router-link
    class="card card-compact w-[800px] h-[300px] mx-auto my-10 bg-base-100 shadow-xl viewer-promotion"
    to="/viewer"
  >
    <div class="card-body relative top-1/4 ml-10">
      <div class="text-sm">3D Model Viewer</div>
      <h1 class="card-title text-4xl font-bold">Avatar Viewer</h1>
      <p>들어가서 모델의 모든 정보를 둘러보세요.</p>
    </div>
  </router-link>
  <div class="flex mx-auto w-[800px] mb-10">
    <div
      class="card card-compact w-[300px] h-[400px] mx-auto bg-base-100 shadow-xl comming-promotion"
    >
      <div class="card-body relative top-1/3">
        <div class="text-sm">3D Model Editor</div>
        <h1 class="card-title text-4xl font-bold">Avatar Editor</h1>
        <p>조금만 기다려주세요...</p>
      </div>
    </div>
    <div
      class="card card-compact w-[300px] h-[400px] mx-auto bg-base-100 shadow-xl comming-promotion"
    >
      <div class="card-body relative top-1/3">
        <div class="text-sm">3D Model Shop</div>
        <h1 class="card-title text-4xl font-bold">Avatar Shop</h1>
        <p>조금만 기다려주세요...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.viewer-promotion {
  background: url("/viewerPic.png") no-repeat;
  background-size: 60%;
  background-position-x: 120%;
  background-position-y: 50%;
}
.viewer-promotion:hover {
  transform: scale(1.02);
}
.comming-promotion {
  background-color: #000;
  color: white;
}
</style>
