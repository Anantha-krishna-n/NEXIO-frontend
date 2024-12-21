"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";


const withAdminAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

    useEffect(() => {
      const adminToken = localStorage.getItem("adminToken");
      
      if (!adminToken || !isAuthenticated) {
        router.push("/admin-login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAdminAuth;
