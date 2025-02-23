import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CircleSlash, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { login } from "@/api/api";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
	email: z.string().email({
		message: "Digite um email válido",
	}),
	password: z.string().min(8, {
		message: "Senha deve conter no mínimo 8 dígitos",
	}),
});

const Login = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (params.get("expired")) {
			toast({
				title: "Seu login expirou!",
				description: "Você foi redirecionado para a página de login",
				variant: "destructive",
				action: <CircleSlash />,
			});
		}
	}, [params]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		login(values).then((response) => {
			if (response) {
				navigate("/");
				setIsLoading(false);
			} else {
				setIsLoading(false);
				toast({ title: "Erro ao realizar login", description: "Usuário e/ou senha inválido", action: <CircleSlash />, variant: "destructive" });
			}
		});
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
