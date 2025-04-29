import { createContext, PropsWithChildren, useContext, useState, useCallback, useEffect } from "react";
import { User } from "@/lib/types";
import { login as apiLogin } from "@/api/api";

// Interface para o contexto de autenticação
interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	setAuthenticated: (value: boolean) => void;
}

// Valor padrão
const defaultAuthContext: AuthContextType = {
	user: null,
	isLoading: false,
	isAuthenticated: false,
	login: async () => false,
	setAuthenticated: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Função para decodificar o JWT e extrair informações
function decodeJWT(token: string): any {
	try {
		// JWT é dividido em três partes: header.payload.signature
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);

		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error("Erro ao decodificar JWT:", error);
		return {};
	}
}

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
	// Verificar se já existe um token no localStorage
	const hasToken = localStorage.getItem("authToken") !== null;

	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// Inicialmente, consideramos autenticado se houver um token
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasToken);

	// Função para definir o estado de autenticação
	const setAuthenticated = useCallback((value: boolean) => {
		setIsAuthenticated(value);

		// Se desautenticado, limpar o usuário
		if (!value) {
			setUser(null);
			console.log("Usuário deslogado");
		}
	}, []);

	// Função de login simplificada
	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);

		try {
			const result = await apiLogin({ email, password });

			if (result) {
				// Login bem-sucedido
				const token = localStorage.getItem("authToken");

				if (token) {
					const decodedToken = decodeJWT(token);
					const userEmail = decodedToken.email || email;
					setUser({ email: userEmail });
					console.log("Usuário logado:", { email: userEmail });
				} else {
					setUser({ email });
					console.log("Usuário logado (sem token decodificado):", { email });
				}

				setIsAuthenticated(true);
				setIsLoading(false);
				return true;
			}

			setIsLoading(false);
			return false;
		} catch (error) {
			console.error("Erro durante login:", error);
			setIsLoading(false);
			return false;
		}
	};

	// Valor a ser fornecido pelo contexto
	const contextValue: AuthContextType = {
		user,
		isLoading,
		isAuthenticated,
		login,
		setAuthenticated,
	};

	// Efeito para verificar e possivelmente carregar os dados do usuário quando a aplicação inicia
	useEffect(() => {
		if (isAuthenticated && !user) {
			// Se está autenticado mas não temos dados do usuário, extraímos do token
			const token = localStorage.getItem("authToken");

			if (token) {
				const decodedToken = decodeJWT(token);
				const userEmail = decodedToken.email || "usuário desconhecido";
				const userInfo = { email: userEmail };
				setUser(userInfo);
				console.log("Usuário atual (do token):", userInfo);
			} else {
				// Fallback se não conseguir extrair do token
				setUser({ email: "usuário desconhecido" });
			}
		}
	}, [isAuthenticated, user]);

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
