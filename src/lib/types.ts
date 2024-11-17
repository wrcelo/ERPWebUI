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
	endereco?: {
		estado?: string;
		cidade?: string;
		bairro?: string;
		logradouro?: string;
		numero?: string;
		complemento?: string;
		cep?: string;
	};
};

export type Produto = {
	id: string;
	nome?: string;
	imgUrl?: string;
	descricao?: string;
};
