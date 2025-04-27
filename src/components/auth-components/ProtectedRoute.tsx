import { PropsWithChildren, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, isLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Redirecionar quando o status de autenticação for determinado
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			navigate("/login?expired=true", { replace: true });
		}
	}, [isLoading, isAuthenticated, navigate]);

	// Mostra um indicador de carregamento enquanto verifica a autenticação
	if (isLoading) {
		return (
			<div className="h-screen w-screen flex items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">Verificando autenticação...</p>
				</div>
			</div>
		);
	}

	// Se não estiver autenticado, não renderiza nada (o useEffect acima irá redirecionar)
	if (!isAuthenticated) {
		return null;
	}

	// Se estiver autenticado, renderiza os filhos
	return <>{children}</>;
}
