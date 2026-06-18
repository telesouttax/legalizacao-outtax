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
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weight[i];
  }
  let remainder = sum % 11;
  let checkDigit1 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(digits[12]) !== checkDigit1) return false;
  
  sum = 0;
  weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weight[i];
  }
  remainder = sum % 11;
  let checkDigit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(digits[13]) === checkDigit2;
}

export interface CNAEData {
  codigo: string;
  descricao: string;
}

export interface FilialData {
  cnpj: string;
  nome: string;
  nomeFantasia: string;
  cidade: string;
  estado: string;
}

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

const RECEITAWS_TOKEN = '1594a34daaff3277d4d71e26cdf3c9d6db0c6a87dacde9fc73009c8044e048d4';

export async function fetchCNPJData(cnpj: string): Promise<CNPJData | null> {
  const digits = cnpj.replace(/\D/g, '');
  
  if (!validateCNPJ(digits)) return null;
  
  try {
    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${digits}`,
      {
        headers: {
          'Authorization': `Bearer ${RECEITAWS_TOKEN}`,
        },
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.status === 'ERROR') return null;

    // CNAEs
    const cnaes: CNAEData[] = [];
    if (data.atividade_principal?.length) {
      data.atividade_principal.forEach((a: { code: string; text: string }) => {
        cnaes.push({ codigo: a.code, descricao: a.text });
      });
    }
    if (data.atividades_secundarias?.length) {
      data.atividades_secundarias.forEach((a: { code: string; text: string }) => {
        cnaes.push({ codigo: a.code, descricao: a.text });
      });
    }

    // QSA
    const qsa = (data.qsa || []).map((s: { nome: string; qual: string }) => ({
      nome: s.nome,
      qual: s.qual,
    }));

    return {
      razao_social: data.nome || '',
      nome_fantasia: data.fantasia || '',
      cnpj: formatCNPJ(digits),
      logradouro: data.logradouro || '',
      numero: data.numero || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      municipio: data.municipio || '',
      uf: data.uf || '',
      cep: data.cep || '',
      telefone: data.telefone || '',
      email: data.email || '',
      situacao: data.situacao || '',
      cnaes,
      filiais: [], // ReceitaWS não retorna filiais
      isMatriz: data.tipo === 'MATRIZ',
      qsa,
      capitalSocial: data.capital_social || '',
      naturezaJuridica: data.natureza_juridica || '',
      abertura: data.abertura || '',
    };
  } catch {
    return null;
  }
}
