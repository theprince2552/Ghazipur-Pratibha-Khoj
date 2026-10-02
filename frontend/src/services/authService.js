import api from "../api/axios";


// ===============================
// REGISTER
// ===============================

export const registerUser = async (data) => {
    const response = await api.post(
        "/users/register/",
        data
    );

    return response.data;
};


// ===============================
// VERIFY OTP
// ===============================

export const verifyOTP = async (data) => {
    const response = await api.post(
        "/users/verify-otp/",
        data
    );

    return response.data;
};

export const resendOTP = async (data) => {
  const response = await api.post("/users/resend-otp/", data);
  return response.data;
};

// ===============================
// LOGIN
// ===============================

export const loginUser = async (data) => {
    const response = await api.post(
        "/users/login/",
        data
    );

    return response.data;
};


// ===============================
// CURRENT USER
// ===============================

export const getCurrentUser = async () => {
    const response = await api.get(
        "/users/me/"
    );

    return response.data;
};


// ===============================
// LOGOUT
// ===============================

export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (data) => {

  const response = await api.post(
    "/core/forgot-password/",
    data
  );

  return response.data;
};


// ==========================================
// VERIFY FORGOT PASSWORD OTP
// ==========================================

export const verifyForgotPasswordOTP = async (data) => {

  const response = await api.post(
    "/core/verify-forgot-otp/",
    data
  );

  return response.data;
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (data) => {

  const response = await api.post(
    "/core/reset-password/",
    data
  );

  return response.data;
};