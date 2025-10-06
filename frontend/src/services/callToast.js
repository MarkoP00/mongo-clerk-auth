import { toast } from "vue3-toastify";

export default function callToast(type, message) {
  toast[type](message, {
    autoClose: 3000,
    theme: "dark",
  });
}
