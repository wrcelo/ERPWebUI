import axios, { AxiosError } from "axios";

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
	(error: AxiosError) => {
		// Verifica se é um erro de resposta HTTP com status code
		if (error.response) {
			const status = error.response.status;

			// Log para depuração
			console.error(`API Error: ${status}`, error.response.data);

			// Tratamento específico para cada status code
			switch (status) {
				case 401: // Unauthorized
					// Se receber um 401, atualiza o estado de autenticação
					if (authHandler.setAuthenticated) {
						authHandler.setAuthenticated(false);
					}

					// Remove o token
					localStorage.removeItem("authToken");

					// Redireciona para a página de login
					window.location.href = "/login?expired=true";
					break;

				case 403: // Forbidden
					console.error("Acesso proibido. Verifique as permissões do usuário.");
					break;

				case 404: // Not Found
					console.error("Recurso não encontrado:", error.config?.url);
					break;

				case 422: // Unprocessable Entity
					console.error("Dados inválidos:", error.response.data);
					break;

				case 500: // Internal Server Error
					console.error("Erro interno no servidor:", error.response.data);
					break;

				default:
					console.error(`Erro não tratado (${status}):`, error.response.data);
			}

			// Adiciona informações do erro para uso no componente que fez a chamada
			return Promise.reject({
				status,
				data: error.response.data,
				message: error.response.data || error.message,
				originalError: error,
			});
		}

		// Erros de rede sem resposta do servidor
		if (error.request) {
			console.error("Erro de rede. Não foi possível conectar ao servidor.", error.request);
			return Promise.reject({
				status: 0, // Convenção para erros de rede
				message: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
				originalError: error,
			});
		}

		// Outros erros (configuração, etc)
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

		// Atualiza o estado de autenticação se disponível
		if (authHandler.setAuthenticated) {
			authHandler.setAuthenticated(false);
		}

		window.location.href = "/login";
	} catch (error) {
		console.error("Erro ao fazer logout:", error);
	}
};

export default api;
