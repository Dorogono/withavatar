<template>
  <section class="w-full">
    <video autoplay="true" loop="true" muted class="object-cover w-full">
      <source src="/mainVideo.mp4" />
    </video>
    <div
      class="flex flex-col justify-center items-center video-text w-full h-full absolute top-0"
    >
      <div class="text-xl text-white subtitle mb-3">
        모델의 모든 정보를 담아
      </div>
      <div class="font-bold text-7xl text-white">with AVATAR</div>
      <router-link to="/viewer" class="btn btn-secondary absolute bottom-12">
        아바타 보러가기
      </router-link>
    </div>
  </section>
</template>

<style scoped>
section {
  position: relative;
}
section,
video {
  height: 32rem;
}
.video-text {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
