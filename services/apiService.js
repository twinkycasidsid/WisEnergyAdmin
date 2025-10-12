import axios from "axios";

const api = axios.create({
  // baseURL: "https://wisenergy-backend.onrender.com",
  baseURL: 'http://192.168.1.9:10000',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/admin/login", { email, password });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Login failed. Please try again.",
    };
  }
};

export const generate_otp = async (email, userVerification) => {
  try {
    const response = await api.post(`/generate-otp`, {
      email, userVerification
    })
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response.data.detail };
  }
}

export const verify_otp = async (email, code) => {
  try {
    const response = await api.post(`/verify-otp`, {
      email,
      code
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "OTP verification failed"
    };
  }
};

export const reset_password = async (email, password) => {
  try {
    const response = await api.post(`/reset-password`, {
      email,
      new_password: password
    })
    return { success: true, message: response.data.message }
  } catch (error) {
    return { success: false, message: error.response.data.detail };
  }
}
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching total users:", error);
  }
};

export const addNewUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    console.log(userData);

    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to create user",
    };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update user",
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete user",
    };
  }
};

export const fetchAllDevices = async () => {
  try {
    const response = await api.get("/devices");
    return response.data;
  } catch (error) {
    console.error("Error fetching total devices:", error);
  }
};

export const fetchDeviceById = async (id) => {
  try {
    const response = await api.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
  }
};

export const fetchAllReviews = async () => {
  try {
    const response = await api.get("/reviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching total devices:", error);
  }
};

export const fetchAllFeedbacks = async () => {
  try {
    const response = await api.get("/feedback");
    return response.data;
  } catch (error) {
    console.error("Error fetching total devices:", error);
  }
};

export const updateFeedbackStatus = async (id, newStatus) => {
  try {
    const response = await api.patch(`/feedback/${id}`, { status: newStatus });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.detail || "Failed to update feedback status",
    };
  }
};

export const fetchAllRates = async () => {
  try {
    const response = await api.get("/rates");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching electricity rates:", error);
    return [];
  }
};

// 🟢 Add or update rate
export const addOrUpdateRate = async (rateData) => {
  try {
    const response = await api.post("/rates", rateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding/updating rate:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to add or update rate.",
    };
  }
};

// 🔴 Delete rate
export const deleteRate = async (city, year, month) => {
  try {
    const encodedCity = encodeURIComponent(city);
    const response = await api.delete(`/rates/${encodedCity}/${year}/${month}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error deleting rate:", error);
    return {
      success: false,
      message: error.response?.data?.detail || "Failed to delete rate.",
    };
  }
};
