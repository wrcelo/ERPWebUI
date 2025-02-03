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

export type Cliente = {
	id: string;
	nome?: string;
	imgUrl?: string;
	descricao?: string;
	cidade?: string;
};

export type User = {
	id: number;
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
