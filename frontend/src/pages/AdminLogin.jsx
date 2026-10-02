import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/login/", {
        email,
        password,
      });

      const data = response.data;

      // Login response ko AuthContext me save karo
      login(data);

      const loggedInUser = data?.data?.user || data?.user;

      // Security: frontend par bhi admin check
      if (loggedInUser?.role !== "admin") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        toast.error("You are not authorized as an admin.");
        return;
      }

      toast.success("Admin login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Invalid admin email or password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-[-180px] left-[-150px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-180px] right-[-150px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">

        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Icon */}
          <div className="flex justify-center mb-6">

            <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">

              <ShieldCheck
                size={32}
                className="text-cyan-300"
              />

            </div>

          </div>

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-2xl font-bold text-white">
              Admin Login
            </h1>

            <p className="text-gray-400 text-sm mt-2">
              Ghazipur Pratibha Khoj 2026
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="email"
                className="
                  w-full
                  h-13
                  px-4
                  rounded-xl
                  bg-white/5
                  border border-white/10
                  text-white
                  placeholder-gray-500
                  outline-none
                  focus:border-cyan-400/50
                  transition
                "
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  className="
                    w-full
                    h-13
                    px-4
                    pr-20
                    rounded-xl
                    bg-white/5
                    border border-white/10
                    text-white
                    placeholder-gray-500
                    outline-none
                    focus:border-cyan-400/50
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-0
                    h-13
                    flex
                    items-center
                    text-sm
                    font-medium
                    text-gray-500
                    hover:text-cyan-300
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-13
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                text-white
                font-semibold
                shadow-lg
                shadow-cyan-500/10
                hover:scale-[1.01]
                active:scale-[0.99]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Signing in..."
                : "Sign In as Admin"}
            </button>

          </form>

          {/* Security note */}
          <div className="mt-6 text-center">

            <p className="text-xs text-gray-500">
              🔒 Authorized administrators only
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;