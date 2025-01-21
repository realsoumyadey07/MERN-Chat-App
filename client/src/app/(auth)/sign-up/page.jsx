"use client";
import Image from "next/image";
import React, { useState } from "react";
import BackGroundImage from "../../../../public/images/sign-up.jpg";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { registration, resetError } from "@/redux/slices/auth.slice";
import LoadingComp from "@/components/LoadingComp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = yup
  .object({
    username: yup.string().required("Username is required!"),
    email: yup.string().email("Invalid email").required("Email is required"),
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

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isHidePassword, setIsHidePassword] = useState(false);
  const dispatch = useDispatch();
  const { registerUserData, error, isLoading } = useSelector(
    (state) => state.auth
  );
  const onSubmit = (data) => {
    dispatch(registration(data));
    console.log(data);
  };
  return (
    <>
      {isLoading && isLoading ? (
        <LoadingComp />
      ) : (
        <>
          <div className="flex h-screen">
            <section className="w-full lg:w-1/2 flex items-center justify-center px-6">
            <div className="w-full max-w-[496px]">
              <Link href={"/"} className="font-semibold text-gray-300 text-2xl">
                MERN Chat App
              </Link>
              <div className="my-4">
                <h4 className="text-4xl font-semibold">Sign Up 👋</h4>
                <p className="text-gray-500 mt-3">
                  A chat app where you can have unlimited chats...
                </p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
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
                      isHidePassword ? "*******" : "Enter your password here..."
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
                  <Link href={"/login"} className="hover:underline">
                    Already have an account??
                  </Link>
                </span>
              </form>
              </div>
            </section>
            <section className="hidden lg:flex w-1/2 h-full">
              <Image
                src={BackGroundImage}
                alt="background"
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
                  <Link href="/login" className="hover:underline">
                    Login to continue
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {error && (
            <Dialog open={!!error}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Error: {error}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Link
                    href="/sign-up"
                    onClick={() => dispatch(resetError())}
                    className="hover:underline"
                  >
                    Register again with right credentials
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </>
  );
};

export default SignupPage;
