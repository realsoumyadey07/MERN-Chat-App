"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BackGroundImage from "../../../../public/images/pexels-olly-3807769.jpg";
import Link from "next/link";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, resetLogoutData } from "@/redux/slices/auth.slice";
import LoadingComp from "@/components/LoadingComp";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { loginUserData, registerUserData, error, isLoading } = useSelector(
    (state) => state.auth
  );
  const [isHidePassword, setIsHidePassword] = useState(false);
  const onSubmit = (data) => {
    dispatch(login(data));
    dispatch(resetLogoutData());
  };
  useEffect(() => {
    if (loginUserData) {
      router.push("/conversations");
    }
  }, [loginUserData, isLoading]);
  return (
    <>
      {isLoading && isLoading ? (
        <LoadingComp />
      ) : (
        <>
          <div className="flex h-screen">
            <section className="w-full lg:w-1/2 flex items-center justify-center px-6">
              <div className="w-full max-w-[496px]">
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
                  onSubmit={handleSubmit(onSubmit)}
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
                    className="py-2 px-3 dark:text-black bg-slate-600 text-white dark:bg-white rounded-[5px] font-semibold hover:bg-slate-800 my-4"
                  >
                    Login
                  </button>
                  <span>
                    <Link href={"/sign-up"} className="hover:underline">
                      Don't have an account??
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
          {error && (
            <Dialog open={!!error}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Error: {error}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Link
                    href="/login"
                    onClick={() => dispatch(resetError())}
                    className="hover:underline"
                  >
                    Login again with right credentials
                  </Link>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {error}
        </>
      )}
    </>
  );
};

export default LoginPage;
