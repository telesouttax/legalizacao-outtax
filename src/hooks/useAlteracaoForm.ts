import { useState, useCallback } from 'react';
import type { 
  FormularioAlteracao, 
  DadosEmpresa, 
  AlteracoesSocietarias, 
  AlteracoesEndereco, 
  AlteracoesGestao,
  MudancaCapitalSocialData,
  AlteracaoObjetoSocialData,
  MudancaSedeData,
  Endereco,
} from '@/types/alteracao';

const emptyEndereco: Endereco = {
  rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '',
};

const emptyMudancaCapitalSocial: MudancaCapitalSocialData = {
  tipo: '', aumentos: [], novoValorCapital: '',
};

const emptyAlteracaoObjetoSocial: AlteracaoObjetoSocialData = {
  tipo: '', atividadesAdicionar: '', cnaesSelecionadosRemover: [],
};

const emptyMudancaSede: MudancaSedeData = {
  endereco: { ...emptyEndereco }, numeroIPTU: '', anexoIPTU: null, anexoIPTUNome: '',
};

const initialDadosEmpresa: DadosEmpresa = {
  cnpj: '', razaoSocial: '', nomeFantasia: '',
  endereco: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '', cep: '',
  telefone: '', email: '',
  cnaes: [], filiais: [], socios: [],
  capitalSocial: '', naturezaJuridica: '', abertura: '', situacao: '',
};

const initialAlteracoesSocietarias: AlteracoesSocietarias = {
  inclusaoSocios: false, novosSocios: [],
  exclusaoSocios: false, sociosExclusao: [],
  alteracaoQuotas: false, novoQuadroSocietario: [],
  mudancaRazaoSocial: false, novaRazaoSocial: '',
  mudancaNomeFantasia: false, novoNomeFantasia: '',
  mudancaCapitalSocial: false, dadosCapitalSocial: { ...emptyMudancaCapitalSocial },
  alteracaoObjetoSocial: false, dadosObjetoSocial: { ...emptyAlteracaoObjetoSocial },
};

const initialAlteracoesEndereco: AlteracoesEndereco = {
  mudancaSede: false, dadosMudancaSede: { ...emptyMudancaSede },
  aberturaFiliais: false, novasFiliais: [],
  fechamentoFiliais: false, filiaisFechamento: [],
};

const initialAlteracoesGestao: AlteracoesGestao = {
  nomeacaoAdministradores: false, novosAdministradores: [],
  destituicaoAdministradores: false, nomeDestituidos: '',
  inclusaoClausulas: false, descricaoClausulasIncluir: '',
  exclusaoClausulas: false, descricaoClausulasExcluir: '',
};

export function useAlteracaoForm() {
  const [dadosEmpresa, setDadosEmpresa] = useState<DadosEmpresa>(initialDadosEmpresa);
  const [alteracoesSocietarias, setAlteracoesSocietarias] = useState<AlteracoesSocietarias>(initialAlteracoesSocietarias);
  const [alteracoesEndereco, setAlteracoesEndereco] = useState<AlteracoesEndereco>(initialAlteracoesEndereco);
  const [alteracoesGestao, setAlteracoesGestao] = useState<AlteracoesGestao>(initialAlteracoesGestao);
  const [observacoes, setObservacoes] = useState('');

  const updateDadosEmpresa = useCallback((field: keyof DadosEmpresa, value: any) => {
    setDadosEmpresa(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAlteracoesSocietarias = useCallback(<K extends keyof AlteracoesSocietarias>(
    field: K, value: AlteracoesSocietarias[K]
  ) => {
    setAlteracoesSocietarias(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAlteracoesEndereco = useCallback(<K extends keyof AlteracoesEndereco>(
    field: K, value: AlteracoesEndereco[K]
  ) => {
    setAlteracoesEndereco(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAlteracoesGestao = useCallback(<K extends keyof AlteracoesGestao>(
    field: K, value: AlteracoesGestao[K]
  ) => {
    setAlteracoesGestao(prev => ({ ...prev, [field]: value }));
  }, []);

  const autoMarkAlteracaoQuotas = useCallback(() => {
    setAlteracoesSocietarias(prev => ({ ...prev, alteracaoQuotas: true }));
  }, []);

  const getFormData = useCallback((): FormularioAlteracao => ({
    dadosEmpresa,
    alteracoesSocietarias,
    alteracoesEndereco,
    alteracoesGestao,
    observacoes,
    dataEnvio: new Date().toISOString(),
  }), [dadosEmpresa, alteracoesSocietarias, alteracoesEndereco, alteracoesGestao, observacoes]);

  const resetForm = useCallback(() => {
    setDadosEmpresa(initialDadosEmpresa);
    setAlteracoesSocietarias(initialAlteracoesSocietarias);
    setAlteracoesEndereco(initialAlteracoesEndereco);
    setAlteracoesGestao(initialAlteracoesGestao);
    setObservacoes('');
  }, []);

  const hasAnyChange = useCallback(() => {
    const { inclusaoSocios, exclusaoSocios, alteracaoQuotas, mudancaRazaoSocial, 
            mudancaNomeFantasia, mudancaCapitalSocial, alteracaoObjetoSocial } = alteracoesSocietarias;
    const { mudancaSede, aberturaFiliais, fechamentoFiliais } = alteracoesEndereco;
    const { nomeacaoAdministradores, destituicaoAdministradores, 
            inclusaoClausulas, exclusaoClausulas } = alteracoesGestao;
    
    return inclusaoSocios || exclusaoSocios || alteracaoQuotas || mudancaRazaoSocial ||
           mudancaNomeFantasia || mudancaCapitalSocial || alteracaoObjetoSocial ||
           mudancaSede || aberturaFiliais || fechamentoFiliais ||
           nomeacaoAdministradores || destituicaoAdministradores || 
           inclusaoClausulas || exclusaoClausulas;
  }, [alteracoesSocietarias, alteracoesEndereco, alteracoesGestao]);

  return {
    dadosEmpresa, alteracoesSocietarias, alteracoesEndereco, alteracoesGestao, observacoes,
    setDadosEmpresa, updateDadosEmpresa, updateAlteracoesSocietarias,
    updateAlteracoesEndereco, updateAlteracoesGestao, setObservacoes,
    autoMarkAlteracaoQuotas, getFormData, resetForm, hasAnyChange,
  };
}
