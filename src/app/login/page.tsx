
"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import loginImage from "../../../public/images/login.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Logged in successfully!");
        router.push("/");
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#F3F5F7]">
      {/* --- Full Background Image --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background-1.avif"
          alt="Background Pattern"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F3F5F7]/90 via-transparent to-white/30 backdrop-blur-[1px]"></div>
      </div>

      <div className="max-w-[1100px] w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24 relative z-10">
        <div className="flex flex-1 justify-center items-center w-full max-w-[300px] md:max-w-[500px]">
          <div className="relative w-full aspect-square drop-shadow-2xl">
            <Image
              src={loginImage}
              alt="Login Illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-[450px] bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="flex flex-col items-center mb-6 sm:mb-8 text-center">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="bg-[#007AFF] p-1.5 rounded-lg shadow-lg shadow-blue-200">
                <span className="text-white font-bold text-lg sm:text-xl">
                  S
                </span>
              </div>
              <h2 className="text-[#007AFF] text-xl sm:text-2xl font-bold italic tracking-tight">
                BuddyScript
              </h2>
            </div>
            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
              Welcome back
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              Login to your account
            </h1>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-100 py-2.5 sm:py-3 rounded-md hover:bg-gray-50 transition-all mb-5 sm:mb-6 active:scale-95">
            <Image
              src="/images/google.webp"
              alt="Google"
              width={22}
              height={22}
            />
            <span className="text-gray-700 font-medium text-sm sm:text-[15px]">
              Or sign-in with google
            </span>
          </button>

          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-gray-400 text-xs sm:text-sm">Or</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <form className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-100 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all text-sm"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                />
                <span className="text-gray-500 group-hover:text-gray-900 transition-colors font-medium">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-[#007AFF] font-bold hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[#007AFF] text-white py-3.5 sm:py-4 rounded-md font-bold text-sm sm:text-[16px] hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer mt-4"
            >
              {isLoading ? "Logging in..." : "Login now"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8">
            New here?{" "}
            <Link
              href="/register"
              className="text-[#007AFF] font-extrabold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
