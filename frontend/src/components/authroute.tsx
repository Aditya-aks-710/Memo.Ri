import { Navigate } from "react-router-dom";
import type { AuthRouteProps } from "../types/props";


export function AuthRoute ({ children } : AuthRouteProps) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to='/api/v1/signin'/>
}