import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

async function logoutUser(redirect = false) {
  // i have to make a secure logout if user deletes sessionId
  try {
    const sessionId = localStorage.getItem("clerkSessionId");

    if (sessionId) {
      await axios.post(`${baseURL}/clerk/logout`, { sessionId });
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("clerkSessionId");

    if (redirect) {
      return (window.location.href = "/#/register");
    }
  } catch (error) {
    console.error("Logout failed:", err);
  }
}

export default logoutUser;
