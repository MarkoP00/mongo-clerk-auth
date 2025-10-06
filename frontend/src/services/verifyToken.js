import axios from "axios";

async function verifyToken() {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${baseURL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error(
      "Token verification failed:",
      error.response?.data || error.message
    );
    return false;
  }
}

export default verifyToken;
