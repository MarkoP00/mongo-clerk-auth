<template>
  <section class="form-section">
    <Spinner v-if="isLoading"></Spinner>
    <div class="box">
      <form class="form" @submit.prevent>
        <div class="title">
          <h2>Sign In</h2>
          <p>Please fill in the details to get started</p>
        </div>
        <div class="clerk-button-wrapper">
          <ClerkButton :title="'Sign in with Google or Git'"></ClerkButton>
        </div>
        <div class="separation-paragraph">
          <p>or</p>
        </div>
        <div class="input-box">
          <input
            type="email"
            required
            v-model="formData.email.value"
            @blur="formData.email.invalid = false"
          />
          <label for="">Email</label>
          <p v-if="formData.email.invalid">{{ formData.email.message }}</p>
        </div>
        <div class="input-box">
          <input
            type="password"
            required
            v-model="formData.password.value"
            @blur="formData.password.invalid = false"
          />
          <label for="">Password</label>
          <p v-if="formData.password.invalid">
            {{ formData.password.message }}
          </p>
        </div>
        <div class="submit-form">
          <button type="button" @click="loginUser">Login</button>
        </div>
        <div class="links">
          <span>Dont have an account?</span>
          <span @click="emits('onShowRegister')">Sign In</span>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUser, useAuth } from "@clerk/vue";
import { useRouter } from "vue-router";

import syncUser from "../../services/syncUser.js";
import ClerkButton from "../ui/ClerkButton.vue";
import axios from "axios";
import callToast from "../../services/callToast.js";
import objectFormValidation from "../../services/objectFormValidation.js";
import Spinner from "../global/Spinner.vue";

const emits = defineEmits("onShowRegister");
const { user } = useUser();
const router = useRouter();

const auth = useAuth();
// const signOut = () => auth.signOut.value();

const isLoading = ref(false);
const baseURL = import.meta.env.VITE_API_URL;

const formData = ref({
  email: { value: "", message: "", invalid: false },
  password: { value: "", message: "", invalid: false },
});

async function loginUser() {
  const formIsValid = objectFormValidation(formData.value);

  if (!formIsValid) {
    return;
  }

  const userData = {
    email: formData.value.email.value,
    password: formData.value.password.value,
  };

  isLoading.value = true;

  try {
    const response = await axios.post(`${baseURL}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // set user info
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    router.push("/welcome");
  } catch (error) {
    console.error(error);
    callToast("warning", error.response?.data.message || error.message);
  } finally {
    isLoading.value = false;
  }
}

const handleSync = async () => {
  if (!user.value || !auth.isSignedIn.value) return;
  const token = await auth.getToken.value();
  const sessionId = auth.sessionId.value;

  try {
    isLoading.value = true;
    await syncUser(token);

    localStorage.setItem("clerkSessionId", sessionId);
    router.push("/welcome");
  } catch (err) {
    console.error("Sync failed.");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

watch(
  // if user signs with clerk, watch catch data, and fires handleSync() which will add user to mongo db
  () => auth.isSignedIn.value,
  (signedIn) => {
    if (signedIn) {
      handleSync();
    }
  }
);
</script>

<style scoped src="../account/authForm.css"></style>

<style scoped>
.box {
  position: relative;
  width: 450px;
  max-height: 550px;
  min-height: 500px;
  background: #1c1c1c;
  border-radius: 8px;
  overflow: hidden;
}
</style>
