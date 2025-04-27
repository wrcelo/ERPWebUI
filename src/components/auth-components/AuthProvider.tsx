import { createContext, PropsWithChildren, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@/lib/types";
import api, { login as apiLogin } from "@/api/api";

// Interface para o contexto de autenticação
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	checkAuth: () => Promise<boolean>;
}

// Valor padrão
const defaultAuthContext: AuthContextType = {
	user: null,
	isLoading: true,
	isAuthenticated: false,
	login: async () => false,
	checkAuth: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// Verificar autenticação (extraído para um método reutilizável)
	const checkAuth = useCallback(async (): Promise<boolean> => {
		setIsLoading(true);

		try {
			const token = localStorage.getItem("authToken");

			if (!token) {
				setUser(null);
				setIsAuthenticated(false);
				setIsLoading(false);
				return false;
			}

			// Tenta fazer uma requisição para validar o token
			const response = await api.get("/v1/clientes");

			if (response.status === 200) {
				// Usuário autenticado
				setUser({
					id: response.data.id,
					// Outros dados do usuário conforme necessário
				});
				setIsAuthenticated(true);
				setIsLoading(false);
				return true;
			} else {
				// Token inválido
				localStorage.removeItem("authToken");
				setUser(null);
				setIsAuthenticated(false);
				setIsLoading(false);
				return false;
			}
		} catch (error) {
			// Erro na requisição (token inválido ou expirado)
			console.error("Erro ao validar autenticação:", error);
			localStorage.removeItem("authToken");
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
			return false;
		}
	}, []);

	// Função de login que garante a atualização do estado
	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const result = await apiLogin({ email, password });

			if (result) {
				// Login bem-sucedido, atualize o estado imediatamente
				const authSuccess = await checkAuth();
				return authSuccess;
			}

			return false;
		} catch (error) {
			console.error("Erro durante login:", error);
			return false;
		}
	};

	// Verificar autenticação ao inicializar
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Valor a ser fornecido pelo contexto
	const contextValue: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		checkAuth,
	};

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
