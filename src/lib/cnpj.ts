export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  let sum = 0;
  let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) sum += parseInt(digits[i]) * weight[i];
  let remainder = sum % 11;
  if (parseInt(digits[12]) !== (remainder < 2 ? 0 : 11 - remainder)) return false;

  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) sum += parseInt(digits[i]) * weight[i];
  remainder = sum % 11;
  return parseInt(digits[13]) === (remainder < 2 ? 0 : 11 - remainder);
}

export interface CNAEData { codigo: string; descricao: string; }
export interface FilialData { cnpj: string; nome: string; nomeFantasia: string; cidade: string; estado: string; }

export interface CNPJData {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  situacao: string;
  cnaes: CNAEData[];
  filiais: FilialData[];
  isMatriz: boolean;
  qsa: Array<{ nome: string; qual: string }>;
  capitalSocial: string;
  naturezaJuridica: string;
  abertura: string;
}

export async function fetchCNPJData(cnpj: string): Promise<CNPJData | null> {
  const digits = cnpj.replace(/\D/g, '');
  if (!validateCNPJ(digits)) return null;

  try {
    // BrasilAPI — funciona direto do browser (sem CORS)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
    if (!response.ok) return null;

    const data = await response.json();

    const cnaes: CNAEData[] = [];
    if (data.cnae_fiscal && data.cnae_fiscal_descricao) {
      cnaes.push({ codigo: String(data.cnae_fiscal), descricao: data.cnae_fiscal_descricao });
    }
    if (data.cnaes_secundarios?.length) {
      data.cnaes_secundarios.forEach((c: { codigo: number; descricao: string }) => {
        cnaes.push({ codigo: String(c.codigo), descricao: c.descricao });
      });
    }

    const qsa = (data.qsa || []).map((s: { nome_socio: string; qualificacao_socio: string }) => ({
      nome: s.nome_socio || '',
      qual: s.qualificacao_socio || '',
    }));

    // Formata capital social
    const capitalRaw = data.capital_social ?? 0;
    const capitalFormatado = Number(capitalRaw).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      razao_social: data.razao_social || '',
      nome_fantasia: data.nome_fantasia || '',
      cnpj: formatCNPJ(digits),
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      municipio: data.municipio || '',
      uf: data.uf || '',
      cep: data.cep || '',
      telefone: data.ddd_telefone_1 || '',
      email: data.email || '',
      situacao: data.descricao_situacao_cadastral || '',
      cnaes,
      filiais: [],
      isMatriz: data.identificador_matriz_filial === 1,
      qsa,
      capitalSocial: capitalFormatado,
      naturezaJuridica: data.natureza_juridica?.descricao || data.natureza_juridica || '',
      abertura: data.data_inicio_atividade || '',
    };
  } catch {
    return null;
  }
}
