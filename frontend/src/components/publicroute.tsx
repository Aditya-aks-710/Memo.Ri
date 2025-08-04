import { Navigate } from "react-router-dom";
import type { AuthRouteProps } from "../types/props";

export function PublicRoute({children} : AuthRouteProps) {
    const token = localStorage.getItem("token");
    return token ? <Navigate to='/'/> : children;
}