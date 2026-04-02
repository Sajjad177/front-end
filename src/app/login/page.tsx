import Image from "next/image";
import Link from "next/link";
import loginImage from "../../../public/images/login.png";

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/background-1.avif"
          alt="Background Pattern"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#F3F5F7]/80 via-transparent to-white/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-[1100px] w-full flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
        <div className="hidden md:flex flex-1 justify-center items-center">
          <div className="relative w-full aspect-square max-w-[500px] drop-shadow-2xl">
            <Image
              src={loginImage}
              alt="Login Illustration"
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>
        </div>

        <div className="w-full max-w-[450px] bg-white/90 backdrop-blur-md rounded-2xl p-8 lg:p-12">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#007AFF] p-1.5 rounded-lg shadow-lg shadow-blue-200">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h2 className="text-[#007AFF] text-2xl font-bold italic tracking-tight">
                BuddyScript
              </h2>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
              Welcome back
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
              Login to your account
            </h1>
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all mb-6">
            <Image
              src="/images/google.webp"
              alt="Google"
              width={25}
              height={25}
            />
            <span className="text-gray-700 font-medium text-[15px]">
              Or sign-in with google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-gray-400 text-sm">Or</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
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

            <button className="w-full bg-[#007AFF] text-white py-4 rounded-xl font-bold text-[16px] hover:bg-blue-600 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer mt-4">
              Login now
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            New here?{" "}
            <Link
              href="/signup"
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
