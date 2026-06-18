// Google Tasks via service account — executado pelo backend Outtax
// O frontend envia os dados da tarefa junto com o webhook principal
// O backend (n8n/node no outtax.space) usa as credenciais abaixo para criar a tarefa

export interface TaskPayload {
  titulo: string;
  descricao: string;
  dataVencimento?: string; // ISO string
}

export function buildTaskPayload(
  empresa: string,
  cnpj: string,
  alteracoes: string[],
  dataEnvio: string
): TaskPayload {
  const dataBR = new Date(dataEnvio).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Vencimento: 2 dias úteis a partir do envio
  const vencimento = new Date(dataEnvio);
  vencimento.setDate(vencimento.getDate() + 2);

  return {
    titulo: `Legalização — Alteração Contratual — ${empresa} — ${dataBR}`,
    descricao: [
      `Empresa: ${empresa}`,
      `CNPJ: ${cnpj}`,
      `Data da solicitação: ${dataBR}`,
      ``,
      `Alterações solicitadas:`,
      ...alteracoes.map(a => `• ${a}`),
    ].join('\n'),
    dataVencimento: vencimento.toISOString(),
  };
}

// Credenciais da service account (usadas pelo backend)
export const SERVICE_ACCOUNT = {
  client_email: 'outtax-tasks@outtax-alteracao.iam.gserviceaccount.com',
  project_id: 'outtax-alteracao',
};
