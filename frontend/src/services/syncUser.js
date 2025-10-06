import callToast from "./callToast";
import axios from "axios";

const syncUser = async (token) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/clerk/register",
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
