import { createApp } from "vue";
import { clerkPlugin } from "@clerk/vue";

import App from "./App.vue";
import Vue3Toastify from "vue3-toastify";
import router from "./router.js";

import "vue3-toastify/dist/index.css";
import "./style.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const app = createApp(App);

app.use(Vue3Toastify, {
  position: "top-right",
  autoClose: 3000,
});

app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY });
app.use(router);
app.mount("#app");
