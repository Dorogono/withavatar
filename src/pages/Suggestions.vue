<template>
  <div class="flex-col mx-auto bg-base-200 min-h-screen pt-10">
    <h1 class="font-bold text-5xl text-center w-96 mx-auto">Suggestion</h1>
    <form
      action="POST"
      class="pt-10 w-96 text-center mx-auto"
      @submit.prevent="sendMail"
    >
      <input
        type="text"
        placeholder="Title"
        name="from_name"
        class="input w-96 mb-5"
        v-model="title"
        required
      />
      <textarea
        class="textarea textarea-info border border-base-200"
        rows="5"
        cols="50"
        placeholder="Description"
        name="message"
        v-model="bodyMessage"
        required
      ></textarea>
      <button
        type="submit"
        class="btn btn-primary w-60"
        :disabled="alreadySent"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import emailjs from "@emailjs/browser";

export default defineComponent({
  setup() {
    const title = ref("");
    const bodyMessage = ref("");
    const alreadySent = ref(false);

    const router = useRouter();

    emailjs.init(import.meta.env.VITE_PUBLIC_KEY);
    const serviceID = import.meta.env.VITE_SERVICE_ID;
    const templateID = import.meta.env.VITE_TEMPLATE_ID;

    function sendMail({ target }) {
      alreadySent.value = true;
      emailjs.sendForm(serviceID, templateID, target).then(
        (result) => {
          title.value = "";
          bodyMessage.value = "";
          alert("메일을 보내주셔서 감사합니다.");
          router.push("/");
          alreadySent.value = false;
        },
        (error) => {
          alert("오늘은 더이상 메일을 받지 않습니다. 죄송합니다.");
          router.push("/");
          alreadySent.value = false;
        }
      );
    }

    return { sendMail, title, bodyMessage, alreadySent };
  },
});
</script>
