"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/authStore";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Content from "@/components/Content";
import axiosInstance from "../utils/axiosInstance";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setAccessToken } = useUserStore();

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      const accessToken = searchParams.get("accessToken");
       console.log(accessToken,"accesssToken")
      if (!accessToken) {
        return;
      }

      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_URL}/auth/users/me`;
        console.log(apiUrl,"data")
        const { data: user } = await axiosInstance.get(apiUrl, {            
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(user,"User")
        setAccessToken(accessToken);
        setUser(user);
        router.replace("/");
      } catch {
        setAccessToken(null);
        setUser(null);
      }
    };

    fetchAndStoreUser();
  }, [searchParams, setUser, setAccessToken, router]);

  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <Content />
    </main>
  );
}