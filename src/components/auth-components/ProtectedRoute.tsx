import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { setAuthHandler } from "@/api/api";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, setAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Registra o manipulador para o interceptor da API
	useEffect(() => {
		setAuthHandler({ setAuthenticated });
	}, [setAuthenticated]);

	// Redireciona para login se não estiver autenticado
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	// Se estiver autenticado, renderiza os filhos
	return isAuthenticated ? <>{children}</> : null;
}
