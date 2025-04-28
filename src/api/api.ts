import axios, { AxiosError } from "axios";

const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;
const apiIdentityUrl = import.meta.env.VITE_REACT_APP_API_IDENTITY_URL;

let authHandler: { setAuthenticated?: (value: boolean) => void } = {};

export const setAuthHandler = (handler: { setAuthenticated: (value: boolean) => void }) => {
	authHandler = handler;
};

const api = axios.create({
	baseURL: apiBaseUrl,
});

const handleUnauthorized = () => {
	if (authHandler.setAuthenticated) {
		authHandler.setAuthenticated(false);
	}
	localStorage.removeItem("authToken");
	window.location.href = "/login?expired=true";
};

// Interceptor de request para adicionar o token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Interceptor de response para tratar todos os status
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response) {
			debugger;
			const status = error.response.status;
			console.error(`API Error: ${status}`, error.response.data);

			if (status === 401) {
				handleUnauthorized();
			} else {
				switch (status) {
					case 403:
						console.error("Acesso proibido. Verifique as permissões do usuário.");
						break;
					case 404:
						console.error("Recurso não encontrado:", error.config?.url);
						break;
					case 422:
						console.error("Dados inválidos:", error.response.data);
						break;
					case 500:
						console.error("Erro interno no servidor:", error.response.data);
						break;
					default:
						console.error(`Erro não tratado (${status}):`, error.response.data);
				}
			}

			return Promise.reject({
				status,
				data: error.response.data,
				message: error.response.data || error.message,
				originalError: error,
			});
		}

		if (error.request) {
			console.error("Erro de rede. Não foi possível conectar ao servidor.", error.request);
			return Promise.reject({
				status: 0,
				message: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
				originalError: error,
			});
		}

		console.error("Erro ao configurar requisição:", error.message);
		return Promise.reject({
			message: error.message,
			originalError: error,
		});
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

		if (authHandler.setAuthenticated) {
			authHandler.setAuthenticated(false);
		}

		window.location.href = "/login";
	} catch (error) {
		console.error("Erro ao fazer logout:", error);
	}
};

export default api;
