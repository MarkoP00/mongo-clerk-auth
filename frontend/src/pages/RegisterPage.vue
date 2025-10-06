<template>
  <LoginAccount v-if="loginVisible" @show-register="toggleForms"></LoginAccount>
  <CreateAccount v-else @show-login="toggleForms"></CreateAccount>
</template>

<script setup>
import { ref } from "vue";
import LoginAccount from "../components/account/LoginAccount.vue";
import CreateAccount from "../components/account/CreateAccount.vue";

const loginVisible = ref(true);

function toggleForms() {
  loginVisible.value = !loginVisible.value;
}
</script>
