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

  const mensagem = {
    cards: [
      {
        header: {
          title: '🔔 Nova Solicitação de Alteração Contratual',
          subtitle: formatDateBR(dataEnvio),
          imageUrl: 'https://www.gstatic.com/images/icons/material/system/2x/description_black_48dp.png',
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: 'Empresa',
                  content: empresa,
                  icon: 'BUILDING_STORE',
                },
              },
              {
                keyValue: {
                  topLabel: 'CNPJ',
                  content: cnpj,
                  icon: 'DESCRIPTION',
                },
              },
              {
                textParagraph: {
                  text: `<b>Alterações solicitadas:</b>\n${listaAlteracoes}`,
                },
              },
            ],
          },
          {
            widgets: [
              {
                textParagraph: {
                  text: `<users/tfvIlyAAAAE> nova solicitação aguardando legalização! 🚀`,
                },
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(GOOGLE_CHAT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mensagem),
    });
    return response.ok;
  } catch {
    return false;
  }
}
