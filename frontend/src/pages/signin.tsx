import React, { useState, type FormEvent } from "react";
import { Button } from "../components/button";
import * as Icon from "../icons";
import { InputBox } from "../components/input";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import axios, { isAxiosError } from "axios";

interface SigninResponse {
  token: string;
}

interface SigninBoxProps {
  setToken: (token: string | null) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;      // close signin modal
  setSignupOpen: React.Dispatch<React.SetStateAction<boolean>>; // open signup modal
}

export function SigninBox({ setToken, setOpen, setSignupOpen }: SigninBoxProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post<SigninResponse>("http://localhost:3000/api/v1/signin", {
        email: formData.email,
        password: formData.password,
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
        setOpen(false);          // close signin modal
        navigate("/dashboard");  // go to dashboard
      }
    } catch (error: any) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Invalid credentials.";
        setErrorMsg(msg);
      } else {
        setErrorMsg("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-screen h-screen fixed top-0 left-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
        <form
          onSubmit={handleSignin}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm h-fit bg-[#daedeb] rounded-lg border border-gray-300 shadow-2xl space-y-4 p-4"
        >
          <div className="flex justify-end items-center">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close modal">
              <Icon.CloseIcon className="w-5 fill-[#438989] cursor-pointer" />
            </button>
          </div>

          <InputBox name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
          <InputBox name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />

          {errorMsg && <div className="text-xs text-center text-red-500">{errorMsg}</div>}

          <div className="flex flex-col justify-center items-center pt-2">
            <Button title={loading ? "Signing In..." : "Sign In"} type="submit" disabled={loading} />
            <p className="text-gray-600 text-sm mt-2 mb-1">
              New user?{" "}
              <span
                className="cursor-pointer text-gray-800 underline"
                onClick={() => {
                  setOpen(false);       // close signin
                  setSignupOpen(true);  // open signup
                }}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
