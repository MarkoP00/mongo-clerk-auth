import { createRouter, createWebHashHistory } from "vue-router";

import verifyToken from "./services/verifyToken";
import WelcomePage from "./pages/WelcomePage.vue";
import RegisterPage from "./pages/RegisterPage.vue";

const routes = [
  { path: "/", component: RegisterPage },
  { path: "/register", component: RegisterPage },
  { path: "/welcome", component: WelcomePage },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/welcome") {
    const tokenIsValid = await verifyToken();

    if (!tokenIsValid) return next("/register");
  }

  next();
});

export default router;
