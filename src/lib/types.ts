export type Empresa = {
	id: string;
	imgUrl: string;
	nome?: string;
	cnpj?: string;
	inscricaoEstadual?: string;
	telefone?: string;
	fax?: string;
	email?: string;
	site?: string;
	instagram?: string;
	observacao?: string;
	nomeImagemFilial?: string;
	endereco?: {
		estado?: string;
		cidade?: string;
		bairro?: string;
		logradouro?: string;
		numero?: string;
		complemento?: string;
		cep?: string;
		uf?: string;
	};
};

export type Cores = {
	descricaoCor: string;
	hexadecimalCor: string;
};

export type Produto = {
	id: string;
	nome?: string;
	imgUrl?: string;
	descricao?: string;
	cores?: Cores[];
	estoqueEmMetros: number;
};

export type User = {
	email: string;
};

export type Fornecedor = {
	id: number;
	tipo: string; // "J" para jurídica ou "F" para física
	nome: string;
	cpF_CNPJ: string; // Nota: o nome da propriedade vem com esta capitalização da API
	inscricaoEstadual: string;
	nomeContato: string;
	idEndereco: number;
	endereco?: {
		estado: string | null;
		cidade: string | null;
		bairro: string | null;
		logradouro: string;
		numero: string;
		complemento: string;
		cep: string;
	};
	telefone: string;
	email: string;
	site: string;
	idRamo: number;
	ramo?: {
		id: number;
		descricao: string;
	};
	nomeRepresentante: string;
	idEnderecoRepresentante: number;
	enderecoRepresentante?: {
		estado: string | null;
		cidade: string | null;
		bairro: string | null;
		logradouro: string;
		numero: string;
		complemento: string;
		cep: string;
	};
	telefoneRepresentante: string;
	celularRepresentante: string;
	emailRepresentante: string;
	redeSocial: string | null;
	contas?: ContaFornecedor[];
};

export type ContaFornecedor = {
	id: number;
	idFornecedor: number;
	fornecedor: null;
	idBanco: number;
	banco?: {
		id: number;
		nomeBanco: string;
		codigoBanco: string;
		siteBanco: string;
	};
	agencia: string;
	agenciaDigito: string;
	conta: string;
	contaDigito: string;
	principalConta: string; // "0" ou "1"
	pix: string | null;
};

export type Cor = {
	idCor: string;
	nomeCor: string;
	descricaoCor: string;
	codigoCor: string;
};

export type Banco = {
	idBanco: string;
	nomeBanco: string;
	codigoBanco: string;
	siteBanco: string;
};

export type Departamento = {
	idDepartamento: string;
	nomeDepartamento: string;
};

export type Endereco = {
	estado: string | null;
	cidade: string | null;
	bairro: string | null;
	logradouro: string;
	numero: string;
	complemento: string;
	cep: string;
};

export type Ramo = {
	id: number;
	descricao: string;
};

export type ClienteJuridico = {
	id: number;
	cnpj: string;
	inscricaoEstadual: string;
	inscricaoMunicipal?: string;
	nomeFantasia: string;
	nomeContato: string;
	dataNascimentoContato: string;
	celularContato: string;
};

export type Cliente = {
	id: number;
	nome: string;
	idRamo: number;
	ramo: Ramo;
	telefone: string;
	email: string;
	site: string;
	bloqueado: string;
	idMotivoBloqueio: number | null;
	motivoBloqueio: string | null;
	dataBloqueio: string;
	idEndereco: number;
	endereco: Endereco;
	mesmoEndereco: string;
	idEnderecoCobranca: number;
	enderecoCobranca: Endereco;
	telefoneCobranca: string;
	observacao: string;
	limiteCredito: number | null;
	dataCadastro: string;
	consumidorFinal: string;
	idTransportador: number | null;
	transportador: any | null;
	idEnderecoEntrega: number;
	enderecoEntrega: Endereco;
	telefoneEntrega: string;
	mesmoEnderecoEntrega: string;
	emailComercial: string | null;
	emailFiscal: string | null;
	emailFinanceiro: string | null;
	idTransportadorRedespacho: number | null;
	transportadorRedespacho: any | null;
	clienteJuridico: ClienteJuridico | null;
};
