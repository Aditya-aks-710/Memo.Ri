import { Button } from "../components/button";
import * as Icon from '../icons';
import { InputBox } from "../components/input";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import axios, { isAxiosError } from 'axios'; // Make sure axios is updated: npm install axios@latest
import React, { useState, type FormEvent } from "react";

// --- Type Definitions ---
interface SigninResponse {
    token: string;
}

interface SigninBoxProps {
    setToken: (token: string | null) => void;
    onClose: () => void; // Function to close the modal
}

// --- Main SigninBox Component ---
export function SigninBox({ setToken, onClose }: SigninBoxProps) {
    const navigate = useNavigate();

    // Use a single state object for form data for cleaner management
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignin = async (e: FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        if (!formData.email || !formData.password) {
            setErrorMsg("Email and password are required.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            const res = await axios.post<SigninResponse>("http://localhost:3000/api/v1/signin", {
                email: formData.email,
                password: formData.password
            });
            console.log(res);
            const token = res.data.token;
            if (token) {
                localStorage.setItem("token", token); // Use a consistent key
                setToken(token);
                navigate("/"); // Navigate to a protected route like a dashboard
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
            <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-20 z-40" onClick={onClose}></div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50">
                <form 
                    onSubmit={handleSignin}
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside the form from closing the modal
                    className="w-full max-w-sm h-fit bg-[#daedeb] rounded-lg border border-gray-300 shadow-2xl space-y-4 p-4"
                >
                    <div className="flex justify-end items-center">
                        <button type="button" onClick={onClose} aria-label="Close modal">
                            <Icon.CloseIcon className="w-5 fill-[#438989] cursor-pointer" />
                        </button>
                    </div>
                    
                    <InputBox 
                        name="email"
                        type="email" 
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <InputBox 
                        name="password"
                        type="password" 
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    
                    {errorMsg && <div className="text-xs text-center text-red-500">{errorMsg}</div>}
                    
                    <div className="flex flex-col justify-center items-center pt-2">
                        <Button title={loading ? "Signing In..." : "Sign In"} type="submit" disabled={loading} />
                        <p className="text-gray-600 text-sm mt-2 mb-1">
                            New user? <span className="cursor-pointer text-gray-800 underline" onClick={() => navigate("/signup")}>Sign Up</span>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}