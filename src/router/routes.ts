import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Viewer from "../pages/Viewer.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/viewer", component: Viewer },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
