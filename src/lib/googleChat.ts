const GOOGLE_CHAT_WEBHOOK = 'https://chat.googleapis.com/v1/spaces/AAAAiaUF23E/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=qudXjDz0xCyinwJmRD7flF7mlpOTBpKUbTfH_p-9G_o';

export interface ChatNotificationPayload {
  empresa: string;
  cnpj: string;
  alteracoes: string[];
  dataEnvio: string;
}

function formatDateBR(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function sendGoogleChatNotification(payload: ChatNotificationPayload): Promise<boolean> {
  const { empresa, cnpj, alteracoes, dataEnvio } = payload;

  const listaAlteracoes = alteracoes.map(a => `• ${a}`).join('\n');

  // Formato texto simples — funciona com qualquer webhook do Google Chat
  const text = [
    `🔔 *Nova Solicitação de Alteração Contratual*`,
    ``,
    `*Empresa:* ${empresa}`,
    `*CNPJ:* ${cnpj}`,
    `*Data:* ${formatDateBR(dataEnvio)}`,
    ``,
    `*Alterações solicitadas:*`,
    listaAlteracoes,
    ``,
    `<users/tfvIlyAAAAE> nova solicitação aguardando legalização! 🚀`,
  ].join('\n');

  try {
    const response = await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const erro = await response.text();
      console.error('Google Chat erro:', response.status, erro);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Google Chat exceção:', err);
    return false;
  }
}
