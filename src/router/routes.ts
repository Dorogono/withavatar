import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Viewer from "../pages/Viewer.vue";
import Suggestions from "../pages/Suggestions.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/viewer", component: Viewer },
  { path: "/suggestion", component: Suggestions },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
