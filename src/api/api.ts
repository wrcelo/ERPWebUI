import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
const apiIdentityUrl = import.meta.env.VITE_REACT_APP_API_IDENTITY_URL;

// Criar uma instância utilizável globalmente para o manipulador de autenticação
let authHandler: { setAuthenticated?: (value: boolean) => void } = {};

// Função para definir o manipulador
export const setAuthHandler = (handler: { setAuthenticated: (value: boolean) => void }) => {
	authHandler = handler;
};

const api = axios.create({
	baseURL: apiBaseUrl,
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			// Se receber um 401, atualiza o estado de autenticação
			if (authHandler.setAuthenticated) {
				authHandler.setAuthenticated(false);
			}

			// Remove o token
			localStorage.removeItem("authToken");

			// Redireciona para a página de login
			window.location.href = "/login?expired=true";
		}
		return Promise.reject(error);
	}
);

export const login = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
	try {
		const data = await axios.post(apiIdentityUrl + "login", { email, senha: password });

		if (data.status === 200 && data.data.accessToken != null) {
			localStorage.setItem("authToken", data.data.accessToken);
			return true;
		}
		return false;
	} catch (error) {
		console.error("Erro no login:", error);
		return false;
	}
};

export const logout = async () => {
	try {
		localStorage.removeItem("authToken");

		// Atualiza o estado de autenticação se disponível
		if (authHandler.setAuthenticated) {
			authHandler.setAuthenticated(false);
		}

		window.location.href = "/login";
	} catch (error) {}
};

export default api;
