"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import SpeacialButton from "@/components/SpeacialButton";
import Link from "next/link";
import LoadingComp from "@/components/LoadingComp";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if(access_token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setLoading(false);
  }, []);
  if (loading) {
    return <LoadingComp />;
  }
  return (
    <>
      {loggedIn ? (
        <div>Hello world!</div>
      ) : (
        <WavyBackground className="max-w-4xl mx-auto pb-40 min-h-svh flex flex-col justify-center items-center">
          <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
            Explore the new world of chatting
          </p>
          <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
            Share every special message with your closeone
          </p>
          <Link href="/sign-up" className="my-4">
            <SpeacialButton title="Get Started" />
          </Link>
        </WavyBackground>
      )}
    </>
  );
}
