import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import Root from "./routes/RootLayout";
import Vendas from "./routes/Vendas";
import Clientes from "./routes/Clientes";
import Relatorios from "./routes/Relatorios";
import Produtos from "./routes/Produtos";
import Utilitarios from "./routes/Utilitarios";
import Empresas from "./routes/Empresas";
import { Home } from "./routes/Home";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
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
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toaster />
		<RouterProvider router={router} />
	</StrictMode>
);
