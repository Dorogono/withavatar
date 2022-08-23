<template>
  <div class="hero h-[400px] bg-base-200 background">
    <div class="hero-content">
      <div class="max-w-md">
        <h1 class="text-3xl font-bold">3D 모델을 더 잘 알 수 있도록</h1>
        <p class="py-6">
          withAvatar 프로젝트는 '제한된 3D 모델 정보를 누구나 잘 알 수 있도록
          한다'는 이념으로 만든 개인 프로젝트입니다.
          <br />
          <br />
          단순히 사진만 보고 3D 모델을 사기에는 너무 많은 위험이 있습니다.
          Bone이 없다거나, BlendShape가 없다거나 하는 기본 정보도 없습니다.
          <br />
          <br />
          이런 문제를 해결하고 싶어 이 프로젝트를 시작했습니다.
          <br />
          아직 구현된 기능이 많지는 않습니다.
          <br />
          여러분이 더 원하는 기능이 있다면 아래 있는 링크에 접속해 보내주시면
          빠른 시일 내에 추가하도록 하겠습니다.
        </p>
        <router-link class="btn btn-primary" to="/suggestion">
          건의 사항 보내기
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background: url("/background.png") no-repeat;
  background-size: cover;
}
</style>
