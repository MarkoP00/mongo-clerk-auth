<template>
  <section class="form-section">
    <Spinner v-if="isLoading"></Spinner>
    <div class="box">
      <form class="form" @submit.prevent>
        <div class="title">
          <h2>Create account</h2>
          <p>Please fill in the details to get started</p>
        </div>
        <div class="clerk-button-wrapper">
          <ClerkButton></ClerkButton>
        </div>
        <div class="separation-paragraph">
          <p>or</p>
        </div>
        <div class="input-box">
          <input
            @blur="formData.username.invalid = false"
            type="text"
            required
            v-model="formData.username.value"
          />
          <label for="">Username</label>
          <p v-if="formData.username.invalid">
            {{ formData.username.message }}
          </p>
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
          <button type="button" @click="createUser">Create account</button>
        </div>
        <div class="links">
          <span>Already have account?</span>
          <span @click="emits('onShowLogin')">Sign Up</span>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuth, useUser } from "@clerk/vue";
import { useRouter } from "vue-router";

import syncUser from "../../services/syncUser.js";
import ClerkButton from "../ui/ClerkButton.vue";
import axios from "axios";
import callToast from "../../services/callToast.js";
import objectFormValidation from "../../services/objectFormValidation.js";
import Spinner from "../global/Spinner.vue";

const emits = defineEmits(["onShowLogin"]);
const { user } = useUser();

const router = useRouter();
const auth = useAuth();
const signOut = () => auth.signOut.value();

const isLoading = ref(false);
const baseURL = import.meta.env.VITE_API_URL;

const formData = ref({
  username: {
    value: "",
    message: "",
    invalid: false,
  },
  email: {
    value: "",
    message: "",
    invalid: false,
  },
  password: {
    value: "",
    message: "",
    invalid: false,
  },
});

async function createUser() {
  const formIsValid = objectFormValidation(formData.value);

  if (!formIsValid) {
    return;
  }

  isLoading.value = true;

  const userData = {
    username: formData.value.username.value,
    email: formData.value.email.value,
    password: formData.value.password.value,
  };

  try {
    const response = await axios.post(`${baseURL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    callToast("success", response?.data.message || "User created");
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

  try {
    isLoading.value = true;
    await syncUser(token);
    router.push("/welcome");
  } catch (err) {
    console.error("Sync failed.");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => auth.isSignedIn.value,
  (signedIn) => {
    if (signedIn) {
      handleSync();
    }
  }
);

// onMounted(async () => {
//   // this validation is if user manually types /register /login route. clerk must signout, otherwise, problems can be occured

//   const token = localStorage.getItem("token");

//   if (token) {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     return await signOut();
//   }
// });
</script>

<style scoped src="../account/authForm.css"></style>
