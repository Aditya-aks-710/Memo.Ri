import { Button } from "../components/button";
import * as Icon from '../icons';
import { InputBox } from "../components/input";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import axios, { isAxiosError } from 'axios';
import React, { useState } from "react";


interface SigninResponse {
    token: string;
}

interface StateProps {
    settoken: React.Dispatch<React.SetStateAction<string | null>>;
}

export function SigninBox({ settoken }: StateProps){
    const Navigate = useNavigate();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setloading] = useState(false);
    const [errormsg, seterrormsg] = useState("");

    const handleSignin = async() => {
        try{
            setloading(true);
            const res = await axios.post<SigninResponse>("http://localhost:3000/api/v1/signin", {
                email,
                password
            });
            const token = res.data.token;
            if(token){
                localStorage.setItem("token", token);
                settoken(token);
                Navigate("/");
            } else{
                return;
            }
        }
        catch (error: any) {
            if(isAxiosError(error)){
                const msg = error.response?.data?.message || error.message || "Something went Wrong";
                seterrormsg(msg);
            } else {
                seterrormsg("Unexpected error Occured");
            }
        }
        finally{
            setloading(false);
        }
    }

    return (
        <>
            <div className="w-screen h-screen fixed top-0 left-0 bg-gray-400 opacity-55">
            </div>
            <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center">
                <div className="min-w-80  h-fit bg-[#daedeb] rounded-md border border-gray-300 drop-shadow-2xl space-y-4">
                    <div className="flex justify-end items-center px-6 pt-4">
                        <Icon.CloseIcon className="w-5 fill-[#438989]"/>
                    </div>
                    <InputBox 
                        name="email"
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />
                    <InputBox 
                        name="password"
                        type="password" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    {errormsg && <div className="flex justify-end pr-6"><p className="text-xs text-red-500">{errormsg}</p></div>}
                    <div className="flex flex-col justify-center items-center">
                        <Button title={loading ? "Signing In..." : "SignIn"} onClick={handleSignin}/>
                        <span className="text-gray-600 text-sm mt-1 mb-3">New user? Click <span className="cursor-pointer text-gray- underline" onClick={() =>{Navigate("/api/v1/signup")}}>Here</span> to SignUp</span>
                    </div>
                </div>
            </div>
        </>
    )
}