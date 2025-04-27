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
import { useNavigate } from "react-router-dom";
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

export default function ClienteNovo() {
	const [ramos, setRamos] = useState<Ramo[]>([]);
	const [transportadores, setTransportadores] = useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

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

	// Carregar dados auxiliares quando o componente inicializar
	useEffect(() => {
		Promise.all([
			api.get("/v1/ramos").then((res) => setRamos(res.data)),
			api.get("/v1/transportadores/select").then((res) => {
				console.log(res.data);
				setTransportadores(res.data || []);
			}),
		]).catch((error) => {
			console.error("Erro ao carregar dados:", error);
			toast.error("Erro ao carregar dados", {
				description: "Não foi possível carregar todos os dados necessários.",
			});
		});
	}, []);

	const onSubmit = async (data: z.infer<typeof clienteSchema>) => {
		try {
			setIsSubmitting(true);

			// Formatar os dados de acordo com o modelo esperado pela API
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
				dataCadastro: new Date().toISOString(),
				consumidorFinal: data.consumidorFinal ? "1" : "0",
				idTransportador: data.idTransportador ? parseInt(data.idTransportador) : null,
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
				idTransportadorRedespacho: data.idTransportadorRedespacho ? parseInt(data.idTransportadorRedespacho) : null,
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

			await api.post("/v1/clientes", clienteData);
			toast.success("Cliente cadastrado com sucesso!");
			navigate("/clientes");
		} catch (error: any) {
			console.error("Erro ao cadastrar cliente:", error);
			toast.error("Erro ao cadastrar cliente", {
				description: error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar o cliente.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

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
				<h1 className="text-2xl font-bold">Cadastrar Novo Cliente</h1>
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
													defaultValue={field.value}
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
														{transportadores.map((t, index) => (
															<SelectItem
																key={index + "-transportadora"}
																value={t.id}
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
														{transportadores.map((t, index) => {
															// console.log(index + transportadores.length);
															return (
																<SelectItem
																	key={index + "-transportadora_redespacho"}
																	value={t.id}
																>
																	{t.nome}
																</SelectItem>
															);
														})}
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
								{isSubmitting ? "Cadastrando..." : "Cadastrar Cliente"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
