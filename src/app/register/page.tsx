/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegister } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import registerImage from "../../../public/images/register.png";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    agree: "",
  });

  // ✅ FIXED
  const registerMutation = useRegister();
  const router = useRouter();

  const handleRegister = async () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      agree: "",
    };

    // validation
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }
    if (!agree) {
      newErrors.agree = "You must agree to terms and conditions";
    }

    setErrors(newErrors);

    if (
      newErrors.firstName ||
      newErrors.lastName ||
      newErrors.email ||
      newErrors.password ||
      newErrors.repeatPassword ||
      newErrors.agree
    ) {
      return;
    }

    setIsLoading(true);

    registerMutation.mutate(
      { firstName, lastName, email, password },
      {
        onSuccess: (res: any) => {
          setIsLoading(false);

          const token = res?.data?.accessToken;

          if (!token) {
            toast.error("Failed to get verification token");
            return;
          }

          toast.success("Account created successfully!");
          router.push("/");
        },
        onError: (error: any) => {
          setIsLoading(false);

          console.error("Error registering user:", error);

          toast.error(
            error.message || "Registration failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#F3F5F7]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background-2.webp"
          alt="Background Pattern"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F3F5F7]/90 via-transparent to-white/30 backdrop-blur-[1px]"></div>
      </div>

      <div className="max-w-[1100px] w-full flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24 relative z-10">
        <div className="flex flex-1 justify-center items-center w-full max-w-[300px] md:max-w-[500px]">
          <div className="relative w-full aspect-square drop-shadow-2xl">
            <Image
              src={registerImage}
              alt="Registration Illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-[450px] bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12">
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
              Get Started Now
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              Registration
            </h1>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-100 py-2.5 sm:py-3 rounded-md hover:bg-gray-50 transition-all mb-5 sm:mb-6 active:scale-95"
          >
            <Image
              src="/images/google.webp"
              alt="Google"
              width={22}
              height={22}
            />
            <span className="text-gray-700 font-medium text-sm sm:text-[15px]">
              Register with google
            </span>
          </button>

          <div className="flex items-center gap-4 mb-5 sm:mb-6">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-gray-400 text-xs sm:text-sm">Or</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <form className="space-y-4 sm:space-y-5">
            <label
              htmlFor="firstName"
              className="block text-gray-600 font-medium text-sm sm:text-[15px]"
            >
              First Name
            </label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}

            <label
              htmlFor="lastName"
              className="block text-gray-600 font-medium text-sm sm:text-[15px]"
            >
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}

            <label
              htmlFor="email"
              className="block text-gray-600 font-medium text-sm sm:text-[15px]"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <label
              htmlFor="password"
              className="block text-gray-600 font-medium text-sm sm:text-[15px]"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <label
              htmlFor="email"
              className="block text-gray-600 font-medium text-sm sm:text-[15px]"
            >
              Repeat Password
            </label>
            <input
              type="password"
              placeholder="Repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-100"
            />
            {errors.repeatPassword && (
              <p className="text-red-500 text-xs">{errors.repeatPassword}</p>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I agree to terms
            </label>
            {errors.agree && (
              <p className="text-red-500 text-xs">{errors.agree}</p>
            )}

            <button
              type="button" // ✅ important fix
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-[#007AFF] text-white py-3 rounded-md font-bold"
            >
              {isLoading ? "Registering..." : "Register now"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#007AFF] font-bold">
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
