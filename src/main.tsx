import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Root from "./routes/Root";
import Vendas from "./routes/Vendas";
import Clientes from "./routes/Clientes";
import Relatorios from "./routes/Relatorios";
import Produtos from "./routes/Produtos";
import Utilitarios from "./routes/Utilitarios";
import Empresas from "./routes/Empresas";
import { Home } from "./routes/Home";
import { Toaster } from "./components/ui/toaster";
import Ajustes from "./routes/Configuracoes";
import Fornecedores from "./routes/Fornecedores";
import Representantes from "./routes/Representantes";
import AuthProvider from "./components/auth-components/AuthProvider";
import ProtectedRoute from "./components/auth-components/ProtectedRoute";
import Login from "./routes/Login";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<Root />
			</ProtectedRoute>
		),
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/home",
				element: <Home />,
			},
			{
				path: "/vendas",
				element: <Vendas />,
			},
			{
				path: "/clientes",
				element: <Clientes />,
			},
			{
				path: "/relatorios",
				element: <Relatorios />,
			},
			{
				path: "/produtos",
				element: <Produtos />,
			},
			{
				path: "/utilitarios",
				element: <Utilitarios />,
			},
			{
				path: "/empresas",
				element: <Empresas />,
			},
			{
				path: "/ajustes",
				element: <Ajustes />,
			},
			{
				path: "/fornecedores",
				element: <Fornecedores />,
			},
			{
				path: "/representantes",
				element: <Representantes />,
			},
		],
	},
	{ path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toaster />
		<AuthProvider isSignedIn={true}>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
