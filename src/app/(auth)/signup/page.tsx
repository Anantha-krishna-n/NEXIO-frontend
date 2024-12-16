"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";

const getPasswordStrength = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  let strength = 0;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  if (isLongEnough) strength++;

  return {
    strength,
    message: 
      strength <= 2 ? "Weak" : 
      strength <= 4 ? "Medium" : 
      "Strong"
  };
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string) => {
  const nameRegex = /^[A-Z][a-zA-Z]*$/;
  return nameRegex.test(name);
};

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for validations
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ 
    strength: 0, 
    message: "" 
  });
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Validate name on change
  useEffect(() => {
    if (firstName) {
      if (!validateName(firstName)) {
        setNameError("Name must start with an uppercase letter and contain only letters");
      } else {
        setNameError("");
      }
    }
  }, [firstName]);

  useEffect(() => {
    if (email) {
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      const strengthResult = getPasswordStrength(password);
      setPasswordStrength(strengthResult);

      // Additional password validation
      if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else {
        setPasswordError("");
      }
    }
  }, [password]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    let isValid = true;

    if (!firstName.trim()) {
      setNameError("First name is required");
      isValid = false;
    } else if (!validateName(firstName)) {
      setNameError("Name must start with an uppercase letter and contain only letters");
      isValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    }

    // Confirm password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      isValid = false;
    }

    // Stop if validation fails
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/signup`,
        {
          name: firstName,
          email,
          password,
          confirmPassword: confirmPassword,
        }
      );
      localStorage.setItem("registeredEmail", email);
      if (response.status === 201) {
        toast.success("Signup successful! Redirecting to verifyOttp...");
        setTimeout(() => {
          router.push("/verify-otp");
        }, 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center">
      {/* Left side - Image */}
      <div className="w-2/5 h-[80vh] flex justify-center items-center ml-12">
        <Image
          src="/assets/signup.png"
          alt="Signup Illustration"
          width={600}
          height={600}
          className="rounded-lg"
        />
      </div>
      <Toaster position="top-right"/>

      {/* Right side - Form container */}
      <div className="bg-grey-200 p-10 w-full max-w-md rounded-lg ml-auto relative">
        <h2
          className="text-2xl font-bold inter mb-6 absolute left-4 -top-0"
          style={{ fontWeight: 300 }}
        >
          Signup
        </h2>
        <p className="text-gray-700 mb-4">
          Let's get you all set up so you can access your personal account.
        </p>

        {/* Error or success message */}
        {errorMessage && (
          <div className="text-red-500 mb-4 text-center">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mb-4 text-center">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className={`border p-2 w-full rounded ${
                nameError ? 'border-red-500' : 'border-gray-300'
              }`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1">{nameError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`border p-2 w-full rounded ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`border p-2 w-full rounded ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Password Strength Indicator */}
            <div className="mt-1 flex items-center">
              <div 
                className={`h-2 w-1/3 mr-1 rounded ${
                  passwordStrength.strength <= 2 ? 'bg-red-500' : 
                  passwordStrength.strength <= 4 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
              ></div>
              <div 
                className={`h-2 w-1/3 mr-1 rounded ${
                  passwordStrength.strength <= 2 ? 'bg-gray-300' : 
                  passwordStrength.strength <= 4 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
              ></div>
              <div 
                className={`h-2 w-1/3 rounded ${
                  passwordStrength.strength <= 4 ? 'bg-gray-300' : 
                  'bg-green-500'
                }`}
              ></div>
              <span className="ml-2 text-xs">
                {passwordStrength.message}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="border border-gray-300 p-2 w-full rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Signup"}
          </button>

          <div className="mt-4 text-center">
            <button 
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded w-full"
            >
              Signup with Google
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already Registered? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}