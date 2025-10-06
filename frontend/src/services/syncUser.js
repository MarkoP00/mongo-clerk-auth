import callToast from "./callToast";
import axios from "axios";

const syncUser = async (token) => {
  try {
    const baseURL = import.meta.env.VITE_API_URL;

    const response = await axios.post(
      `${baseURL}/register`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // callToast("success", "Signing in...");
  } catch (err) {
    console.error(
      "Error syncing user:",
      err.response?.data.message || err.message
    );
    callToast("error", "Error while syncing user");
    throw new Error(err);
  }
};

export default syncUser;
