"use client";
import Image from "next/image";
import BackGroundImage from "../../../../public/images/pexels-olly-3807769.jpg";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  login,
  registration,
  resetLogoutData,
  resetRegisterUserData,
} from "@/redux/slices/auth.slice";
import { useRouter } from "next/navigation";
import LoadingComp from "@/components/LoadingComp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const loginSchema = yup
  .object({
    email: yup.string().email("Invalid email!").required("Email is required!"),
    password: yup
      .string()
      .required("Password is required!")
      .min(6, "Password must be at least 6 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one numeric digit")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  })
  .required();

const registrationSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required!")
      .min(4, "Username must be at least 4 characters"),
    email: yup.string().email("Invalid email!").required("Email is required!"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one numeric digit")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  })
  .required();

export default function Authentication() {
  const router = useRouter();
  const [screen, setScreen] = useState("Login");
  const [isHidePassword, setIsHidePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      screen === "Login" ? loginSchema : registrationSchema
    ),
  });

  const dispatch = useDispatch();
  const { loginUserData, registerUserData, error, isLoading } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (data) => {
    dispatch(login(data));
    dispatch(resetLogoutData());
    console.log("login button clicked!");
  };
  const handleRegister = (data) => {
    dispatch(registration(data));
    console.log("registration button clicked!");
  };
  const handleLoginClick = () => {
    setScreen("Login");
    dispatch(resetRegisterUserData());
  };
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      router.push("/conversations");
    }
  }, [loginUserData, registerUserData, isLoading]);

  return (
    <>
      {isLoading ? (
        <LoadingComp />
      ) : (
        <>
          <div className="flex h-screen">
            <section className="w-full lg:w-1/2 flex items-center justify-center">
              <BackgroundLines className="flex items-center justify-center w-full h-full flex-col px-4">
                {screen === "Login" && (
                  <>
                    <div className="w-full max-w-[496px] z-50">
                      <Link
                        href={"/"}
                        className="font-semibold text-gray-300 text-2xl"
                      >
                        MERN Chat App
                      </Link>
                      <div className="my-4">
                        <h4 className="text-4xl font-semibold">Login 👋</h4>
                        <p className="text-gray-500 mt-3">
                          A chat app where you can have unlimited chats...
                        </p>
                      </div>
                      <form
                        onSubmit={handleSubmit(handleLogin)}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex flex-col gap-2">
                          <label htmlFor="email" className="text-gray-400">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="border border-gray-500 rounded-md py-2 px-3"
                            placeholder="Enter your email here..."
                            defaultValue=""
                            {...register("email")}
                          />
                          {errors?.email?.message && (
                            <span className="text-sm text-red-500">
                              {errors?.email?.message}
                            </span>
                          )}
                        </div>
                        <div className="flex relative flex-col gap-2">
                          <label htmlFor="email" className="text-gray-400">
                            Password
                          </label>
                          <input
                            type={isHidePassword ? "password" : "text"}
                            name="password"
                            className="border border-gray-500 rounded-md py-2 px-3"
                            placeholder={
                              isHidePassword
                                ? "*******"
                                : "Enter your password here..."
                            }
                            defaultValue=""
                            {...register("password")}
                          />
                          {errors?.password?.message && (
                            <span className="text-sm text-red-500">
                              {errors?.password?.message}
                            </span>
                          )}
                          <span
                            className="absolute top-11 right-4"
                            onClick={() => setIsHidePassword(!isHidePassword)}
                          >
                            {isHidePassword && isHidePassword ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="py-2 px-3 text-black bg-white rounded-[5px] font-semibold hover:bg-gray-300 my-4"
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin align-middle"></div>
                          ) : (
                            "Login"
                          )}
                        </button>
                        <span>
                          <p
                            onClick={() => setScreen("Registration")}
                            className="hover:underline cursor-pointer"
                          >
                            Don't have an account??
                          </p>
                        </span>
                      </form>
                    </div>
                  </>
                )}
                {screen === "Registration" && (
                  <>
                    <div className="w-full max-w-[496px] z-50">
                      <Link
                        href={"/"}
                        className="font-semibold text-gray-300 text-2xl"
                      >
                        MERN Chat App
                      </Link>
                      <div className="my-4">
                        <h4 className="text-4xl font-semibold">Sign Up 👋</h4>
                        <p className="text-gray-500 mt-3">
                          A chat app where you can have unlimited chats...
                        </p>
                      </div>
                      <form
                        onSubmit={handleSubmit(handleRegister)}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex flex-col gap-2">
                          <label htmlFor="username" className="text-gray-400">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            className="border border-gray-500 rounded-md py-2 px-3"
                            placeholder="Enter your username here..."
                            defaultValue=""
                            {...register("username")}
                          />
                          {errors?.username?.message && (
                            <span className="text-sm text-red-500">
                              {errors?.username?.message}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="email" className="text-gray-400">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="border border-gray-500 rounded-md py-2 px-3"
                            placeholder="Enter your email here..."
                            defaultValue=""
                            {...register("email")}
                          />
                          {errors?.email?.message && (
                            <span className="text-sm text-red-500">
                              {errors?.email?.message}
                            </span>
                          )}
                        </div>
                        <div className="relative flex flex-col gap-2">
                          <label htmlFor="email" className="text-gray-400">
                            Password
                          </label>
                          <input
                            type={isHidePassword ? "password" : "text"}
                            name="password"
                            className="border border-gray-500 rounded-md py-2 px-3"
                            placeholder={
                              isHidePassword
                                ? "*******"
                                : "Enter your password here..."
                            }
                            defaultValue=""
                            {...register("password")}
                          />
                          {errors?.password?.message && (
                            <span className="text-sm text-red-500">
                              {errors?.password?.message}
                            </span>
                          )}
                          <span
                            className="absolute top-11 right-4"
                            onClick={() => setIsHidePassword(!isHidePassword)}
                          >
                            {isHidePassword && isHidePassword ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="py-2 px-3 text-black bg-white rounded-[5px] font-semibold hover:bg-gray-300 my-4"
                        >
                          Sign Up
                        </button>
                        <span>
                          <p
                            className="hover:underline cursor-pointer"
                            onClick={() => setScreen("Login")}
                          >
                            Already have an account??
                          </p>
                        </span>
                      </form>
                    </div>
                  </>
                )}
              </BackgroundLines>
            </section>
            <section className="hidden lg:flex w-1/2 h-full">
              <Image
                src={BackGroundImage}
                alt="Onboarding image"
                className="object-cover w-full h-full"
              />
            </section>
          </div>
          {registerUserData && (
            <Dialog open={!!registerUserData}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Welcome {registerUserData.username}</DialogTitle>
                  <DialogDescription>
                    Your registration successfully completed!
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <p
                    onClick={handleLoginClick}
                    className="hover:underline cursor-pointer"
                  >
                    Login to continue
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {error && (
            <Dialog open={!!error}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{error}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Link
                    href="/authentication"
                    onClick={() => dispatch(resetError())}
                    className="hover:underline"
                  >
                    Enter right credentials to proceed
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </>
  );
}
