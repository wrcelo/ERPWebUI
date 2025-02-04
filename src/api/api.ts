import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_URL;

const apiIdentityUrl = import.meta.env.VITE_REACT_APP_API_IDENTITY_URL;

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
			window.location.href = "/login?expired=true";
			localStorage.removeItem("authToken");
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
		// const data = await axios.post(apiIdentityUrl + "logout");

		// if (data.status === 200) {
		localStorage.removeItem("authToken");
		window.location.href = "/login";
		// }
	} catch (error) {}
};

export default api;
