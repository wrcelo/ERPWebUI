import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { CircleSlash, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-components/AuthProvider";

const formSchema = z.object({
	email: z.string().email({
		message: "Digite um email válido",
	}),
	password: z.string().min(8, {
		message: "Senha deve conter no mínimo 8 dígitos",
	}),
});

const Login = () => {
	const [params, setParams] = useSearchParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const toastShownRef = useRef(false);
	const { login } = useAuth();

	useEffect(() => {
		if (params.get("expired") && !toastShownRef.current) {
			toast.error("Seu login expirou!", {
				description: "Você foi redirecionado para a página de login",
				action: <CircleSlash />,
			});
			toastShownRef.current = true;

			// Remover o parâmetro expired da URL
			setParams({}, { replace: true });
		}
	}, [params, setParams]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			// Usar a função login do AuthProvider
			const success = await login(values.email, values.password);

			if (success) {
				// Se login for bem-sucedido, navegue para a página inicial
				navigate("/", { replace: true });
			} else {
				toast("Erro ao realizar login", {
					description: "Usuário e/ou senha inválido",
					action: <CircleSlash />,
				});
			}
		} catch (error) {
			console.error("Erro durante login:", error);
			toast("Erro ao realizar login", {
				description: "Ocorreu um erro inesperado",
				action: <CircleSlash />,
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<div className="h-dvh w-dvw px-4">
				<div className="flex items-center justify-center w-full h-full">
					<div className="w-[350px]">
						<>
							<h1 className="text-2xl font-semibold">Login</h1>
							<p className="text-muted-foreground text-xs">Insira suas credenciais de acesso para entrar.</p>
						</>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="admin@grupogm2.com.br"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Senha</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder=""
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<LoaderCircle className="animate-spin" /> Entrando...
										</>
									) : (
										"Entrar"
									)}
								</Button>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
