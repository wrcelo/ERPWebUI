import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/api";
import { Cliente } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Info, MapPin, Package, Phone, User } from "lucide-react";
import { toast } from "sonner";

const ClienteVisualizar = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [cliente, setCliente] = useState<Cliente | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchClienteDetails = async () => {
			try {
				setIsLoading(true);
				const response = await api.get(`/v1/clientes/${id}`);
				setCliente(response.data);
			} catch (error) {
				console.error("Erro ao carregar detalhes do cliente:", error);
				toast("Erro", {
					description: "Não foi possível carregar os detalhes do cliente",
				});
				navigate("/clientes");
			} finally {
				setIsLoading(false);
			}
		};

		fetchClienteDetails();
	}, [id, navigate]);

	// Funções de formatação
	const formatarCEP = (cep: string | null | undefined): string => {
		if (!cep) return "-";

		// Remove caracteres não numéricos
		const numeros = cep.replace(/\D/g, "");

		if (numeros.length === 8) {
			return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
		}

		return cep;
	};

	const formatarData = (dataStr: string): string => {
		if (!dataStr || dataStr === "0001-01-01T00:00:00") return "-";

		const data = new Date(dataStr);
		return data.toLocaleDateString("pt-BR");
	};

	const formatarTelefone = (telefone: string | null | undefined): string => {
		if (!telefone) return "-";

		// Remove caracteres não numéricos
		const numeros = telefone.replace(/\D/g, "");

		// Verifica o tamanho para determinar o formato
		if (numeros.length === 10) {
			// Formato (00) 0000-0000
			return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`;
		} else if (numeros.length === 11) {
			// Formato (00) 00000-0000 (com o nono dígito)
			return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
		} else if (numeros.length === 8) {
			// Formato 0000-0000 (sem DDD)
			return `${numeros.slice(0, 4)}-${numeros.slice(4, 8)}`;
		} else if (numeros.length === 9) {
			// Formato 00000-0000 (sem DDD, com nono dígito)
			return `${numeros.slice(0, 5)}-${numeros.slice(5, 9)}`;
		}

		// Se não se encaixar nos formatos acima, retorna como está
		return telefone;
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
				<p className="mt-4 text-muted-foreground">Carregando dados do cliente...</p>
			</div>
		);
	}

	if (!cliente) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<Info className="h-10 w-10 text-muted-foreground" />
				<p className="mt-4 text-muted-foreground">Cliente não encontrado</p>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => navigate("/clientes")}
				>
					Voltar para lista de clientes
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6">
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate("/clientes")}
						className="mr-2"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
				</div>
				<Button
					onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
					className="gap-2"
				>
					<Edit className="h-4 w-4" />
					Editar Cliente
				</Button>
			</div>

			<div className="bg-card rounded-lg border shadow-sm">
				{/* Cabeçalho com nome do cliente */}
				<div className="p-6 border-b bg-muted/30">
					<div className="flex items-start justify-between">
						<div>
							<h2 className="text-xl font-semibold">{cliente.nome?.toUpperCase() || "SEM NOME"}</h2>
							<p className="text-muted-foreground mt-1">
								ID: {cliente.id || "-"} • Cadastrado em: {formatarData(cliente.dataCadastro)}
							</p>
						</div>
						<div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">{cliente.ramo?.descricao || "Sem ramo definido"}</div>
					</div>
				</div>

				{/* Informações principais */}
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Coluna 1: Informações básicas */}
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<User className="h-5 w-5" />
									Informações de Contato
								</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Telefone:</dt>
										<dd>{formatarTelefone(cliente.telefone)}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Email:</dt>
										<dd>{cliente.email || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Site:</dt>
										<dd>
											{cliente.site ? (
												<a
													href={cliente.site.startsWith("http") ? cliente.site : `https://${cliente.site}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													{cliente.site}
												</a>
											) : (
												"-"
											)}
										</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Consumidor Final:</dt>
										<dd>{cliente.consumidorFinal === "1" ? "Sim" : "Não"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Status:</dt>
										<dd>
											{cliente.bloqueado === "1" ? (
												<span className="text-destructive font-medium">Bloqueado</span>
											) : (
												<span className="text-green-600 font-medium">Ativo</span>
											)}
										</dd>
									</div>
									{cliente.bloqueado === "1" && (
										<>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Motivo Bloqueio:</dt>
												<dd>{cliente.motivoBloqueio || "-"}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Data Bloqueio:</dt>
												<dd>{formatarData(cliente.dataBloqueio) || "-"}</dd>
											</div>
										</>
									)}
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Limite de Crédito:</dt>
										<dd>
											{cliente.limiteCredito ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cliente.limiteCredito) : "-"}
										</dd>
									</div>
								</dl>
							</div>

							<Separator />

							{/* Endereço Principal */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<MapPin className="h-5 w-5" />
									Endereço Principal
								</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Logradouro:</dt>
										<dd>{cliente.endereco?.logradouro || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Número:</dt>
										<dd>{cliente.endereco?.numero || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Complemento:</dt>
										<dd>{cliente.endereco?.complemento || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Bairro:</dt>
										<dd>{cliente.endereco?.bairro || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Cidade:</dt>
										<dd>{cliente.endereco?.cidade || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Estado:</dt>
										<dd>{cliente.endereco?.estado || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">CEP:</dt>
										<dd>{formatarCEP(cliente.endereco?.cep)}</dd>
									</div>
								</dl>
							</div>

							<Separator />

							{/* Contatos Adicionais - Sempre exibir */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<Phone className="h-5 w-5" />
									Contatos Adicionais
								</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Email Comercial:</dt>
										<dd>{cliente.emailComercial || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Email Fiscal:</dt>
										<dd>{cliente.emailFiscal || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Email Financeiro:</dt>
										<dd>{cliente.emailFinanceiro || "-"}</dd>
									</div>
								</dl>
							</div>
						</div>

						{/* Coluna 2: Endereços alternativos e outros dados */}
						<div className="space-y-6">
							{/* Endereço de Cobrança - Sempre exibir */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<Package className="h-5 w-5" />
									Endereço de Cobrança
									{cliente.mesmoEndereco === "1" && <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded">Mesmo que principal</span>}
								</h3>

								{cliente.mesmoEndereco === "1" ? (
									<dl className="space-y-2">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Endereço:</dt>
											<dd>Mesmo que o endereço principal</dd>
										</div>
									</dl>
								) : (
									<dl className="space-y-2">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Logradouro:</dt>
											<dd>{cliente.enderecoCobranca?.logradouro || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Número:</dt>
											<dd>{cliente.enderecoCobranca?.numero || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Complemento:</dt>
											<dd>{cliente.enderecoCobranca?.complemento || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Bairro:</dt>
											<dd>{cliente.enderecoCobranca?.bairro || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Cidade:</dt>
											<dd>{cliente.enderecoCobranca?.cidade || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Estado:</dt>
											<dd>{cliente.enderecoCobranca?.estado || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">CEP:</dt>
											<dd>{formatarCEP(cliente.enderecoCobranca?.cep)}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Telefone:</dt>
											<dd>{formatarTelefone(cliente.telefoneCobranca)}</dd>
										</div>
									</dl>
								)}
							</div>

							<Separator />

							{/* Endereço de Entrega - Sempre exibir */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<Package className="h-5 w-5" />
									Endereço de Entrega
									{cliente.mesmoEnderecoEntrega === "1" && <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded">Mesmo que principal</span>}
								</h3>

								{cliente.mesmoEnderecoEntrega === "1" ? (
									<dl className="space-y-2">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Endereço:</dt>
											<dd>Mesmo que o endereço principal</dd>
										</div>
									</dl>
								) : (
									<dl className="space-y-2">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Logradouro:</dt>
											<dd>{cliente.enderecoEntrega?.logradouro || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Número:</dt>
											<dd>{cliente.enderecoEntrega?.numero || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Complemento:</dt>
											<dd>{cliente.enderecoEntrega?.complemento || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Bairro:</dt>
											<dd>{cliente.enderecoEntrega?.bairro || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Cidade:</dt>
											<dd>{cliente.enderecoEntrega?.cidade || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Estado:</dt>
											<dd>{cliente.enderecoEntrega?.estado || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">CEP:</dt>
											<dd>{formatarCEP(cliente.enderecoEntrega?.cep)}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Telefone:</dt>
											<dd>{formatarTelefone(cliente.telefoneEntrega)}</dd>
										</div>
									</dl>
								)}
							</div>

							<Separator />

							{/* Transportadoras */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<Package className="h-5 w-5" />
									Transportadoras
								</h3>
								<dl className="space-y-2">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Transportadora Principal:</dt>
										<dd>{cliente.transportador || "-"}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Transportadora Redespacho:</dt>
										<dd>{cliente.transportadorRedespacho || "-"}</dd>
									</div>
								</dl>
							</div>

							<Separator />

							{/* Observações - Sempre exibir */}
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<Info className="h-5 w-5" />
									Observações
								</h3>
								{cliente.observacao ? (
									<div className="p-3 bg-muted/50 rounded-md">
										<p className="text-sm whitespace-pre-wrap">{cliente.observacao}</p>
									</div>
								) : (
									<div className="p-3 bg-muted/50 rounded-md text-muted-foreground">
										<p className="text-sm">Nenhuma observação registrada</p>
									</div>
								)}
							</div>

							{/* Cliente Jurídico - Sempre exibir */}
							<Separator />
							<div>
								<h3 className="text-lg font-medium flex items-center gap-2 mb-4">
									<User className="h-5 w-5" />
									Dados Jurídicos
								</h3>
								{cliente.clienteJuridico ? (
									<dl className="space-y-2">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">CNPJ:</dt>
											<dd>{cliente.clienteJuridico.cnpj || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Inscrição Estadual:</dt>
											<dd>{cliente.clienteJuridico.inscricaoEstadual || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Inscrição Municipal:</dt>
											<dd>{cliente.clienteJuridico.inscricaoMunicipal || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Nome Fantasia:</dt>
											<dd>{cliente.clienteJuridico.nomeFantasia || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Nome Contato:</dt>
											<dd>{cliente.clienteJuridico.nomeContato || "-"}</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Celular Contato:</dt>
											<dd>{formatarTelefone(cliente.clienteJuridico.celularContato) || "-"}</dd>
										</div>
									</dl>
								) : (
									<div className="p-3 bg-muted/50 rounded-md text-muted-foreground">
										<p className="text-sm">Cliente não possui dados jurídicos</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ClienteVisualizar;
