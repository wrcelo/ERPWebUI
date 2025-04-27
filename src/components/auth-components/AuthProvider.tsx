import { createContext, PropsWithChildren, useContext, useState, useCallback } from "react";
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
	}, []);

	// Função de login simplificada
	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);

		try {
			const result = await apiLogin({ email, password });

			if (result) {
				// Login bem-sucedido
				setIsAuthenticated(true);
				setUser({ id: 1 }); // Podemos definir um usuário padrão aqui
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

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
