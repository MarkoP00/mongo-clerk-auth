<template>
  <section class="welcome-section">
    <div class="wrapper">
      <h1>Welcome {{ displayName }}</h1>
      <p>
        Your token is: <span>{{ token }}</span>
      </p>
    </div>

    <!-- clerk logout -->
    <SignOutButton :redirect-url="'/#/register'" v-if="isClerkUser">
      <button class="sign-out-button">Sign out (Clerk)</button>
    </SignOutButton>

    <!-- manual logout -->
    <button v-else class="sign-out-button" @click="manualLogout">
      Sign out (Manual)
    </button>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { SignOutButton, useUser } from "@clerk/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const { user } = useUser();

const token = ref(localStorage.getItem("token"));
const manualUser = ref(JSON.parse(localStorage.getItem("user")));

const isClerkUser = computed(() => !!user.value);
const displayName = computed(
  () => user.value?.username || manualUser.value?.username
);

const manualLogout = () => {
  router.push("/register");
};
</script>

<style scoped>
.welcome-section {
  display: flex;
  justify-content: top;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  color: #fff;
  padding: 20px 40px;
  gap: 20px;
}

.wrapper {
  text-align: center;
  max-width: 450px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.wrapper span {
  color: #fff;
  word-break: break-all;
}
.wrapper h1,
p {
  color: #e61c69;
}

.sign-out-button {
  padding: 10px 15px;
  background: #e61c69;
  outline: none;
  border: 1px solid #971044;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}
.sign-out-button:hover {
  background: #960a40;
}
</style>
