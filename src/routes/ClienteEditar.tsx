import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ArrowLeft, MapPinIcon, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Schema de endereço reutilizável
const enderecoSchema = z.object({
	logradouro: z.string().min(1, "Logradouro é obrigatório"),
	numero: z.string().min(1, "Número é obrigatório"),
	complemento: z.string().optional(),
	bairro: z.string().optional(),
	cidade: z.string().optional(),
	estado: z.string().optional(),
	cep: z.string().min(8, "CEP inválido").max(10),
});

// Schema cliente jurídico
const clienteJuridicoSchema = z.object({
	cnpj: z.string().min(14, "CNPJ inválido").max(18),
	inscricaoEstadual: z.string().optional(),
	nomeFantasia: z.string().optional(),
	nomeContato: z.string().optional(),
	dataNascimentoContato: z.string().optional(),
	celularContato: z.string().optional(),
});

// Schema completo do cliente
const clienteSchema = z.object({
	nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
	idRamo: z.string().min(1, "Selecione um ramo de atividade"),
	telefone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres"),
	email: z.string().email("Email inválido").or(z.string().length(0)),
	site: z.string().optional(),
	endereco: enderecoSchema,
	mesmoEndereco: z.boolean().default(true),
	enderecoCobranca: enderecoSchema.optional(),
	telefoneCobranca: z.string().optional(),
	mesmoEnderecoEntrega: z.boolean().default(true),
	enderecoEntrega: enderecoSchema.optional(),
	telefoneEntrega: z.string().optional(),
	observacao: z.string().optional(),
	limiteCredito: z.number().optional().nullable(),
	consumidorFinal: z.boolean().default(false),
	idTransportador: z.string().optional(),
	idTransportadorRedespacho: z.string().optional(),
	emailComercial: z.string().email("Email inválido").or(z.string().length(0)),
	emailFiscal: z.string().email("Email inválido").or(z.string().length(0)),
	emailFinanceiro: z.string().email("Email inválido").or(z.string().length(0)),
	isPessoaJuridica: z.boolean().default(false),
	clienteJuridico: clienteJuridicoSchema.optional(),
});

export default function ClienteEditar() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [ramos, setRamos] = useState<Ramo[]>([]);
	const [transportadores, setTransportadores] = useState<any[]>([]);

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
			mesmoEndereco: true,
			enderecoCobranca: {
				logradouro: "",
				numero: "",
				complemento: "",
				bairro: "",
				cidade: "",
				estado: "",
				cep: "",
			},
			telefoneCobranca: "",
			mesmoEnderecoEntrega: true,
			enderecoEntrega: {
				logradouro: "",
				numero: "",
				complemento: "",
				bairro: "",
				cidade: "",
				estado: "",
				cep: "",
			},
			telefoneEntrega: "",
			observacao: "",
			limiteCredito: null,
			consumidorFinal: false,
			idTransportador: "",
			idTransportadorRedespacho: "",
			emailComercial: "",
			emailFiscal: "",
			emailFinanceiro: "",
			isPessoaJuridica: false,
			clienteJuridico: {
				cnpj: "",
				inscricaoEstadual: "",
				nomeFantasia: "",
				nomeContato: "",
				dataNascimentoContato: "",
				celularContato: "",
			},
		},
	});

	const isPessoaJuridica = form.watch("isPessoaJuridica");
	const mesmoEndereco = form.watch("mesmoEndereco");
	const mesmoEnderecoEntrega = form.watch("mesmoEnderecoEntrega");

	useEffect(() => {
		// Carregar dados do cliente e dados auxiliares
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Carregar dados auxiliares em paralelo
				const [ramosResponse, transportadoresResponse, clienteResponse] = await Promise.all([
					api.get("/v1/ramos"),
					api.get("/v1/transportadores/select"),
					api.get(`/v1/clientes/${id}`),
				]);

				setRamos(ramosResponse.data);
				setTransportadores(transportadoresResponse.data || []);

				const cliente = clienteResponse.data;

				// Determinar se é pessoa jurídica
				const isPessoaJuridica = cliente.clienteJuridico !== null;

				// Preencher o formulário com os dados do cliente
				form.reset({
					nome: cliente.nome || "",
					idRamo: cliente.idRamo.toString() || "",
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
					mesmoEndereco: cliente.mesmoEndereco === "1",
					enderecoCobranca: {
						logradouro: cliente.enderecoCobranca?.logradouro || "",
						numero: cliente.enderecoCobranca?.numero || "",
						complemento: cliente.enderecoCobranca?.complemento || "",
						bairro: cliente.enderecoCobranca?.bairro || "",
						cidade: cliente.enderecoCobranca?.cidade || "",
						estado: cliente.enderecoCobranca?.estado || "",
						cep: cliente.enderecoCobranca?.cep || "",
					},
					telefoneCobranca: cliente.telefoneCobranca || "",
					mesmoEnderecoEntrega: cliente.mesmoEnderecoEntrega === "1",
					enderecoEntrega: {
						logradouro: cliente.enderecoEntrega?.logradouro || "",
						numero: cliente.enderecoEntrega?.numero || "",
						complemento: cliente.enderecoEntrega?.complemento || "",
						bairro: cliente.enderecoEntrega?.bairro || "",
						cidade: cliente.enderecoEntrega?.cidade || "",
						estado: cliente.enderecoEntrega?.estado || "",
						cep: cliente.enderecoEntrega?.cep || "",
					},
					telefoneEntrega: cliente.telefoneEntrega || "",
					observacao: cliente.observacao || "",
					limiteCredito: cliente.limiteCredito,
					consumidorFinal: cliente.consumidorFinal === "1",
					idTransportador: cliente.idTransportador ? cliente.idTransportador.toString() : "0",
					idTransportadorRedespacho: cliente.idTransportadorRedespacho ? cliente.idTransportadorRedespacho.toString() : "0",
					emailComercial: cliente.emailComercial || "",
					emailFiscal: cliente.emailFiscal || "",
					emailFinanceiro: cliente.emailFinanceiro || "",
					isPessoaJuridica: isPessoaJuridica,
					clienteJuridico: isPessoaJuridica
						? {
								cnpj: cliente.clienteJuridico?.cnpj || "",
								inscricaoEstadual: cliente.clienteJuridico?.inscricaoEstadual || "",
								nomeFantasia: cliente.clienteJuridico?.nomeFantasia || "",
								nomeContato: cliente.clienteJuridico?.nomeContato || "",
								dataNascimentoContato: cliente.clienteJuridico?.dataNascimentoContato
									? new Date(cliente.clienteJuridico.dataNascimentoContato).toISOString().split("T")[0]
									: "",
								celularContato: cliente.clienteJuridico?.celularContato || "",
						  }
						: {
								cnpj: "",
								inscricaoEstadual: "",
								nomeFantasia: "",
								nomeContato: "",
								dataNascimentoContato: "",
								celularContato: "",
						  },
				});
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
				toast.error("Erro ao carregar dados", {
					description: "Não foi possível carregar os dados do cliente",
				});
				navigate("/clientes");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, form, navigate]);

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
				bloqueado: "0", // Mantém o cliente como ativo
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
				mesmoEndereco: data.mesmoEndereco ? "1" : "0",
				idEnderecoCobranca: 0,
				enderecoCobranca: data.mesmoEndereco
					? {
							estado: data.endereco.estado || "",
							cidade: data.endereco.cidade || "",
							bairro: data.endereco.bairro || "",
							logradouro: data.endereco.logradouro,
							numero: data.endereco.numero,
							complemento: data.endereco.complemento || "",
							cep: data.endereco.cep,
					  }
					: {
							estado: data.enderecoCobranca?.estado || "",
							cidade: data.enderecoCobranca?.cidade || "",
							bairro: data.enderecoCobranca?.bairro || "",
							logradouro: data.enderecoCobranca?.logradouro || "",
							numero: data.enderecoCobranca?.numero || "",
							complemento: data.enderecoCobranca?.complemento || "",
							cep: data.enderecoCobranca?.cep || "",
					  },
				telefoneCobranca: data.telefoneCobranca || "",
				observacao: data.observacao || "",
				limiteCredito: data.limiteCredito,
				dataCadastro: null, // Manter a data de cadastro original
				consumidorFinal: data.consumidorFinal ? "1" : "0",
				idTransportador: data.idTransportador && data.idTransportador !== "0" ? parseInt(data.idTransportador) : null,
				idEnderecoEntrega: 0,
				enderecoEntrega: data.mesmoEnderecoEntrega
					? {
							estado: data.endereco.estado || "",
							cidade: data.endereco.cidade || "",
							bairro: data.endereco.bairro || "",
							logradouro: data.endereco.logradouro,
							numero: data.endereco.numero,
							complemento: data.endereco.complemento || "",
							cep: data.endereco.cep,
					  }
					: {
							estado: data.enderecoEntrega?.estado || "",
							cidade: data.enderecoEntrega?.cidade || "",
							bairro: data.enderecoEntrega?.bairro || "",
							logradouro: data.enderecoEntrega?.logradouro || "",
							numero: data.enderecoEntrega?.numero || "",
							complemento: data.enderecoEntrega?.complemento || "",
							cep: data.enderecoEntrega?.cep || "",
					  },
				telefoneEntrega: data.telefoneEntrega || "",
				emailComercial: data.emailComercial || "",
				emailFiscal: data.emailFiscal || "",
				emailFinanceiro: data.emailFinanceiro || "",
				idTransportadorRedespacho: data.idTransportadorRedespacho && data.idTransportadorRedespacho !== "0" ? parseInt(data.idTransportadorRedespacho) : null,
				mesmoEnderecoEntrega: data.mesmoEnderecoEntrega ? "1" : "0",
				clienteJuridico: data.isPessoaJuridica
					? {
							cnpj: data.clienteJuridico?.cnpj || "",
							inscricaoEstadual: data.clienteJuridico?.inscricaoEstadual || "",
							nomeFantasia: data.clienteJuridico?.nomeFantasia || "",
							nomeContato: data.clienteJuridico?.nomeContato || "",
							dataNascimentoContato: data.clienteJuridico?.dataNascimentoContato || "0001-01-01T00:00:00.000Z",
							celularContato: data.clienteJuridico?.celularContato || "",
					  }
					: null,
			};

			// Atualizar o cliente
			await api.put(`/v1/clientes/${id}`, clienteData);

			toast.success("Cliente atualizado com sucesso!");
			navigate("/clientes");
		} catch (error: any) {
			console.error("Erro ao atualizar cliente:", error);
			toast.error("Erro ao atualizar cliente", {
				description: error.response?.data?.message || "Ocorreu um erro ao tentar atualizar o cliente.",
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
		<div className="container mx-auto py-6 max-w-[720px] ">
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
						<Tabs
							defaultValue="dados-gerais"
							className="w-full"
						>
							<TabsList className="mb-4">
								<TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
								<TabsTrigger value="endereco">Endereços</TabsTrigger>
								<TabsTrigger value="contatos">Contatos</TabsTrigger>
								<TabsTrigger value="financeiro">Financeiro/Transporte</TabsTrigger>
								{isPessoaJuridica && <TabsTrigger value="juridico">Dados Jurídicos</TabsTrigger>}
							</TabsList>

							{/* TAB: DADOS GERAIS */}
							<TabsContent
								value="dados-gerais"
								className="space-y-6"
							>
								<div className="flex items-center space-x-2 mb-4">
									<FormField
										control={form.control}
										name="isPessoaJuridica"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center space-x-3 space-y-0">
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="font-medium">Pessoa Jurídica</FormLabel>
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="nome"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nome/Razão Social *</FormLabel>
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
																{ramo.descricao.toUpperCase()}
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

									<FormField
										control={form.control}
										name="consumidorFinal"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="font-normal">Consumidor Final</FormLabel>
											</FormItem>
										)}
									/>
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
							</TabsContent>

							{/* TAB: ENDEREÇOS */}
							<TabsContent
								value="endereco"
								className="space-y-6"
							>
								<div>
									<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
										<MapPinIcon className="h-5 w-5" />
										Endereço Principal
									</h3>
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

								<Separator />

								{/* Endereço de Cobrança */}
								<div>
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-medium flex items-center gap-2">
											<Package className="h-5 w-5" />
											Endereço de Cobrança
										</h3>
										<FormField
											control={form.control}
											name="mesmoEndereco"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="font-normal">Mesmo que o endereço principal</FormLabel>
												</FormItem>
											)}
										/>
									</div>

									{!mesmoEndereco && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<FormField
												control={form.control}
												name="enderecoCobranca.logradouro"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Logradouro</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoCobranca.numero"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Número</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoCobranca.complemento"
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
												name="enderecoCobranca.cep"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CEP</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoCobranca.bairro"
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
												name="enderecoCobranca.cidade"
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
												name="enderecoCobranca.estado"
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

											<FormField
												control={form.control}
												name="telefoneCobranca"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Telefone de Cobrança</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}
								</div>

								<Separator />

								{/* Endereço de Entrega */}
								<div>
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-lg font-medium flex items-center gap-2">
											<Package className="h-5 w-5" />
											Endereço de Entrega
										</h3>
										<FormField
											control={form.control}
											name="mesmoEnderecoEntrega"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="font-normal">Mesmo que o endereço principal</FormLabel>
												</FormItem>
											)}
										/>
									</div>

									{!mesmoEnderecoEntrega && (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<FormField
												control={form.control}
												name="enderecoEntrega.logradouro"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Logradouro</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoEntrega.numero"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Número</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoEntrega.complemento"
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
												name="enderecoEntrega.cep"
												render={({ field }) => (
													<FormItem>
														<FormLabel>CEP</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="enderecoEntrega.bairro"
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
												name="enderecoEntrega.cidade"
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
												name="enderecoEntrega.estado"
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

											<FormField
												control={form.control}
												name="telefoneEntrega"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Telefone de Entrega</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)}
								</div>
							</TabsContent>

							{/* TAB: CONTATOS ADICIONAIS */}
							<TabsContent
								value="contatos"
								className="space-y-6"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="emailComercial"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Comercial</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="emailFiscal"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Fiscal</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="emailFinanceiro"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email Financeiro</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</TabsContent>

							{/* TAB: FINANCEIRO E TRANSPORTE */}
							<TabsContent
								value="financeiro"
								className="space-y-6"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="limiteCredito"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Limite de Crédito</FormLabel>
												<FormControl>
													<Input
														type="number"
														step="0.01"
														onChange={(e) => {
															const value = e.target.value === "" ? null : parseFloat(e.target.value);
															field.onChange(value);
														}}
														value={field.value === null ? "" : field.value}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="col-span-1"></div>

									<FormField
										control={form.control}
										name="idTransportador"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Transportadora</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecione uma transportadora" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="0">Nenhuma</SelectItem>
														{transportadores.map((t) => (
															<SelectItem
																key={`transp-${t.id}`}
																value={t.id.toString()}
															>
																{t.nome}
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
										name="idTransportadorRedespacho"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Transportadora de Redespacho</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Selecione uma transportadora" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="0">Nenhuma</SelectItem>
														{transportadores.map((t) => (
															<SelectItem
																key={`redesp-${t.id}`}
																value={t.id.toString()}
															>
																{t.nome}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</TabsContent>

							{/* TAB: DADOS JURÍDICOS */}
							{isPessoaJuridica && (
								<TabsContent
									value="juridico"
									className="space-y-6"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="clienteJuridico.cnpj"
											render={({ field }) => (
												<FormItem>
													<FormLabel>CNPJ *</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="clienteJuridico.inscricaoEstadual"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Inscrição Estadual</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="clienteJuridico.nomeFantasia"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nome Fantasia</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="clienteJuridico.nomeContato"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nome do Contato</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="clienteJuridico.celularContato"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Celular do Contato</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="clienteJuridico.dataNascimentoContato"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Data de Nascimento do Contato</FormLabel>
													<FormControl>
														<Input
															type="date"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</TabsContent>
							)}
						</Tabs>

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
