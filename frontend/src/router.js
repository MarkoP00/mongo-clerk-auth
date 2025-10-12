import { createRouter, createWebHashHistory } from "vue-router";

import verifyToken from "./services/verifyToken";
import logoutUser from "./services/logoutUser";
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
    if (!tokenIsValid) {
      await logoutUser();
      return next("/register");
    }
  }

  if (to.path === "/register" || to.path === "/") {
    // always logout if trying to go to /register
    await logoutUser();
  }

  next();
});

export default router;
