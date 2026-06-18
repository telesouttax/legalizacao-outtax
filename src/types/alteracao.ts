export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface NovoSocio {
  id: string;
  nomeCompleto: string;
  cpf: string;
  rgCnh: string;
  anexoRgCnh?: File | null;
  anexoRgCnhNome?: string;
  endereco: Endereco;
  profissao: string;
  estadoCivil: string;
  nacionalidade: string;
  tipoSocio: 'socio' | 'socio_administrador';
  capitalSocial: string;
  observacaoCessao: string;
}

export interface SocioExclusao {
  id: string;
  nomeSocioSaindo: string;
  sociosRecebem: string;
}

export interface QuotaSocio {
  id: string;
  nomeSocio: string;
  valorCapital: string;
}

export interface AumentoCapitalItem {
  id: string;
  tipo: 'dinheiro' | 'imoveis';
  valor: string;
  anexoRGI?: File | null;
  anexoRGINome?: string;
  anexoIPTU?: File | null;
  anexoIPTUNome?: string;
  anexoComprovanteResidencia?: File | null;
  anexoComprovanteResidenciaNome?: string;
}

export interface MudancaCapitalSocialData {
  tipo: 'aumento' | 'diminuicao' | '';
  aumentos: AumentoCapitalItem[];
  novoValorCapital: string;
}

export interface AlteracaoObjetoSocialData {
  tipo: 'adicionar' | 'remover' | 'adicionar_remover' | '';
  atividadesAdicionar: string;
  cnaesSelecionadosRemover: string[];
}

export interface CNAEEmpresa {
  codigo: string;
  descricao: string;
}

export interface SocioEmpresa {
  nome: string;
  qualificacao: string;
}

export interface MudancaSedeData {
  endereco: Endereco;
  numeroIPTU: string;
  anexoIPTU?: File | null;
  anexoIPTUNome?: string;
}

export interface FilialAbertura {
  id: string;
  endereco: Endereco;
  numeroIPTU: string;
  anexoIPTU?: File | null;
  anexoIPTUNome?: string;
  atividades: string;
  email: string;
  telefone: string;
}

export interface FilialEmpresa {
  cnpj: string;
  nome: string;
  nomeFantasia: string;
  cidade: string;
  estado: string;
  selecionada: boolean;
}

export interface NovoAdministrador {
  id: string;
  tipo: 'socio_existente' | 'novo_administrador';
  nomeSocioExistente: string;
  nomeCompleto: string;
  cpf: string;
  rgCnh: string;
  anexoRgCnh?: File | null;
  anexoRgCnhNome?: string;
  endereco: Endereco;
  profissao: string;
  limitacoesAdministracao: string;
}

export interface DadosEmpresa {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  cnaes: CNAEEmpresa[];
  filiais: FilialEmpresa[];
  // Novos campos ReceitaWS
  socios: SocioEmpresa[];
  capitalSocial: string;
  naturezaJuridica: string;
  abertura: string;
  situacao: string;
}

export interface AlteracoesSocietarias {
  inclusaoSocios: boolean;
  novosSocios: NovoSocio[];
  exclusaoSocios: boolean;
  sociosExclusao: SocioExclusao[];
  alteracaoQuotas: boolean;
  novoQuadroSocietario: QuotaSocio[];
  mudancaRazaoSocial: boolean;
  novaRazaoSocial: string;
  mudancaNomeFantasia: boolean;
  novoNomeFantasia: string;
  mudancaCapitalSocial: boolean;
  dadosCapitalSocial: MudancaCapitalSocialData;
  alteracaoObjetoSocial: boolean;
  dadosObjetoSocial: AlteracaoObjetoSocialData;
}

export interface AlteracoesEndereco {
  mudancaSede: boolean;
  dadosMudancaSede: MudancaSedeData;
  aberturaFiliais: boolean;
  novasFiliais: FilialAbertura[];
  fechamentoFiliais: boolean;
  filiaisFechamento: FilialEmpresa[];
}

export interface AlteracoesGestao {
  nomeacaoAdministradores: boolean;
  novosAdministradores: NovoAdministrador[];
  destituicaoAdministradores: boolean;
  nomeDestituidos: string;
  inclusaoClausulas: boolean;
  descricaoClausulasIncluir: string;
  exclusaoClausulas: boolean;
  descricaoClausulasExcluir: string;
}

export interface FormularioAlteracao {
  dadosEmpresa: DadosEmpresa;
  alteracoesSocietarias: AlteracoesSocietarias;
  alteracoesEndereco: AlteracoesEndereco;
  alteracoesGestao: AlteracoesGestao;
  observacoes: string;
  dataEnvio: string;
}
