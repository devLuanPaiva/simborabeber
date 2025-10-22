"use client";
import { LoaderFive } from "../ui/loader";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthForce({ children }: Readonly<{ children: React.ReactNode }>) {
  const path = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) {
      router.push(`/admin/access?destiny=${path}`);
    } else {
      setCheckingAuth(false);
    }
  }, [path, router]);

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderFive text="Direcionando..." />
      </div>
    );
  }

  return <>{children}</>;
}