import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Ramo } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/api/api";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const clienteSchema = z.object({
	nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	idRamo: z.string().min(1, "Selecione um ramo de atividade"),
	telefone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres"),
	email: z.string().email("Email inválido").or(z.string().length(0)),
	site: z.string().optional(),
	endereco: z.object({
		logradouro: z.string().min(1, "Logradouro é obrigatório"),
		numero: z.string().min(1, "Número é obrigatório"),
		complemento: z.string().optional(),
		bairro: z.string().optional(),
		cidade: z.string().optional(),
		estado: z.string().optional(),
		cep: z.string().min(8, "CEP inválido"),
	}),
	observacao: z.string().optional(),
});

export default function ClienteEditar() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [ramos, setRamos] = useState<Ramo[]>([]);

	const form = useForm<z.infer<typeof clienteSchema>>({
		resolver: zodResolver(clienteSchema),
		defaultValues: {
			nome: "",
			idRamo: "",
			telefone: "",
			email: "",
			site: "",
			endereco: {
				logradouro: "",
				numero: "",
				complemento: "",
				bairro: "",
				cidade: "",
				estado: "",
				cep: "",
			},
			observacao: "",
		},
	});

	useEffect(() => {
		// Carregar dados do cliente e ramos
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Carregar ramos
				const ramosResponse = await api.get("/v1/ramos");
				setRamos(ramosResponse.data);

				// Carregar cliente
				const clienteResponse = await api.get(`/v1/clientes/${id}`);
				const cliente = clienteResponse.data;

				// Preencher o formulário com os dados do cliente
				form.reset({
					nome: cliente.nome,
					idRamo: cliente.idRamo.toString(),
					telefone: cliente.telefone || "",
					email: cliente.email || "",
					site: cliente.site || "",
					endereco: {
						logradouro: cliente.endereco?.logradouro || "",
						numero: cliente.endereco?.numero || "",
						complemento: cliente.endereco?.complemento || "",
						bairro: cliente.endereco?.bairro || "",
						cidade: cliente.endereco?.cidade || "",
						estado: cliente.endereco?.estado || "",
						cep: cliente.endereco?.cep || "",
					},
					observacao: cliente.observacao || "",
				});
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast("Erro", {
					description: "Não foi possível carregar os dados do cliente",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, form]);

	const onSubmit = async (data: z.infer<typeof clienteSchema>) => {
		try {
			setIsSubmitting(true);

			// Formatar os dados para a API
			const clienteData = {
				nome: data.nome,
				idRamo: parseInt(data.idRamo),
				telefone: data.telefone,
				email: data.email || "",
				site: data.site || "",
				bloqueado: "0",
				idMotivoBloqueio: null,
				dataBloqueio: "0001-01-01T00:00:00.000Z",
				idEndereco: 0,
				endereco: {
					estado: data.endereco.estado || "",
					cidade: data.endereco.cidade || "",
					bairro: data.endereco.bairro || "",
					logradouro: data.endereco.logradouro,
					numero: data.endereco.numero,
					complemento: data.endereco.complemento || "",
					cep: data.endereco.cep,
				},
				mesmoEndereco: "1",
				idEnderecoCobranca: 0,
				enderecoCobranca: {
					estado: "",
					cidade: "",
					bairro: "",
					logradouro: "",
					numero: "",
					complemento: "",
					cep: "",
				},
				telefoneCobranca: "",
				observacao: data.observacao || "",
				limiteCredito: null,
				dataCadastro: new Date().toISOString(),
				consumidorFinal: "0",
				idTransportador: null,
				idEnderecoEntrega: 0,
				enderecoEntrega: {
					estado: "",
					cidade: "",
					bairro: "",
					logradouro: "",
					numero: "",
					complemento: "",
					cep: "",
				},
				telefoneEntrega: "",
				emailComercial: "",
				emailFiscal: "",
				emailFinanceiro: "",
				idTransportadorRedespacho: null,
				mesmoEnderecoEntrega: "1",
				clienteJuridico: null,
			};

			// Atualizar o cliente
			await api.put(`/v1/clientes/${id}`, clienteData);

			navigate("/clientes", {
				state: {
					success: true,
					message: "Cliente atualizado com sucesso!",
				},
			});
		} catch (error) {
			console.error("Erro ao atualizar cliente:", error);
			toast("Erro", {
				description: "Não foi possível atualizar o cliente",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 flex justify-center items-center h-[50vh]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
					<p className="mt-4 text-muted-foreground">Carregando dados do cliente...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex items-center mb-6">
				<Button
					variant="ghost"
					className="mr-4 p-0 h-8 w-8"
					onClick={() => navigate("/clientes")}
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold">Editar Cliente</h1>
			</div>

			<div className="bg-card p-6 rounded-md shadow-sm">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="nome"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome *</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="idRamo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ramo de Atividade *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecione..." />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{ramos.map((ramo) => (
													<SelectItem
														key={ramo.id}
														value={ramo.id.toString()}
													>
														{ramo.descricao}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="telefone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Telefone *</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="site"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Site</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-medium border-b pb-2">Endereço</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="endereco.logradouro"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Logradouro *</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.numero"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Número *</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.complemento"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Complemento</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.cep"
									render={({ field }) => (
										<FormItem>
											<FormLabel>CEP *</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.bairro"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Bairro</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.cidade"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Cidade</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endereco.estado"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Estado</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<FormField
							control={form.control}
							name="observacao"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Observações</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={3}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate("/clientes")}
							>
								Cancelar
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Salvando..." : "Salvar Alterações"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
