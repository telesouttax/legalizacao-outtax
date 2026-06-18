import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { Header } from '@/components/alteracao/Header';
import { TestBanner } from '@/components/alteracao/TestBanner';
import { DadosEmpresaSection } from '@/components/alteracao/DadosEmpresaSection';
import { AlteracoesSocietariasSection } from '@/components/alteracao/AlteracoesSocietariasSection';
import { AlteracoesEnderecoSection } from '@/components/alteracao/AlteracoesEnderecoSection';
import { AlteracoesGestaoSection } from '@/components/alteracao/AlteracoesGestaoSection';
import { ObservacoesSection } from '@/components/alteracao/ObservacoesSection';
import { useAlteracaoForm } from '@/hooks/useAlteracaoForm';
import { generatePDFBase64 } from '@/lib/generatePDF';
import { validateCNPJ } from '@/lib/cnpj';
import { sendGoogleChatNotification } from '@/lib/googleChat';
import { buildTaskPayload } from '@/lib/googleTasks';
import type { FormularioAlteracao } from '@/types/alteracao';

const WEBHOOK_PROD = 'https://api.outtax.space/webhook/AlteracaoContratual';
const WEBHOOK_TEST = 'https://backend.outtax.space/webhook-test/AlteracaoContratual';

function buildAlteracoesList(formData: FormularioAlteracao): string[] {
  const list: string[] = [];
  const s = formData.alteracoesSocietarias;
  const e = formData.alteracoesEndereco;
  const g = formData.alteracoesGestao;

  if (s.inclusaoSocios) list.push('Inclusão de Sócio(s)');
  if (s.exclusaoSocios) list.push('Exclusão de Sócio(s)');
  if (s.alteracaoQuotas) list.push('Alteração de Quotas');
  if (s.mudancaRazaoSocial) list.push(`Mudança de Razão Social → ${s.novaRazaoSocial}`);
  if (s.mudancaNomeFantasia) list.push(`Mudança de Nome Fantasia → ${s.novoNomeFantasia}`);
  if (s.mudancaCapitalSocial) list.push(`Mudança de Capital Social (${s.dadosCapitalSocial.tipo})`);
  if (s.alteracaoObjetoSocial) list.push('Alteração do Objeto Social');
  if (e.mudancaSede) list.push('Mudança de Sede');
  if (e.aberturaFiliais) list.push('Abertura de Filial(is)');
  if (e.fechamentoFiliais) list.push('Fechamento de Filial(is)');
  if (g.nomeacaoAdministradores) list.push('Nomeação de Administrador(es)');
  if (g.destituicaoAdministradores) list.push('Destituição de Administrador(es)');
  if (g.inclusaoClausulas) list.push('Inclusão de Cláusulas');
  if (g.exclusaoClausulas) list.push('Exclusão de Cláusulas');

  return list;
}

export default function AlteracaoContratual() {
  const location = useLocation();
  const isTestMode = location.pathname === '/test';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    dadosEmpresa,
    alteracoesSocietarias,
    alteracoesEndereco,
    alteracoesGestao,
    observacoes,
    setDadosEmpresa,
    updateDadosEmpresa,
    updateAlteracoesSocietarias,
    updateAlteracoesEndereco,
    updateAlteracoesGestao,
    setObservacoes,
    autoMarkAlteracaoQuotas,
    getFormData,
    hasAnyChange,
    resetForm,
  } = useAlteracaoForm();

  const handleSubmit = async () => {
    if (!dadosEmpresa.cnpj || !validateCNPJ(dadosEmpresa.cnpj)) {
      toast.error('Por favor, insira um CNPJ válido');
      return;
    }

    if (!dadosEmpresa.razaoSocial) {
      toast.error('Por favor, preencha a Razão Social');
      return;
    }

    if (!hasAnyChange()) {
      toast.error('Selecione pelo menos uma alteração');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = getFormData();
      const alteracoes = buildAlteracoesList(formData);
      const pdfBase64 = await generatePDFBase64(formData);
      const taskPayload = buildTaskPayload(
        dadosEmpresa.razaoSocial,
        dadosEmpresa.cnpj,
        alteracoes,
        formData.dataEnvio
      );

      const webhookUrl = isTestMode ? WEBHOOK_TEST : WEBHOOK_PROD;

      // 1. Envia para webhook principal (backend cria tarefa no Google Tasks)
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          pdfBase64,
          taskPayload,
          isTestMode,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar formulário');

      // 2. Notifica Google Chat (direto do frontend, não depende do backend)
      const chatOk = await sendGoogleChatNotification({
        empresa: dadosEmpresa.razaoSocial,
        cnpj: dadosEmpresa.cnpj,
        alteracoes,
        dataEnvio: formData.dataEnvio,
      });

      if (!chatOk) {
        console.warn('Falha ao notificar Google Chat — formulário enviado com sucesso');
      }

      setIsSuccess(true);
      toast.success('Formulário enviado com sucesso!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    resetForm();
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        {isTestMode && <TestBanner />}
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="text-center py-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Solicitação Enviada!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Sua solicitação de alteração contratual foi enviada com sucesso para a Outtax Contabilidade.
                Em breve nossa equipe entrará em contato.
              </p>
              <Button onClick={handleNewRequest} className="mt-4">Nova Solicitação</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isTestMode && <TestBanner />}
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Solicitação de Alteração Contratual</h2>
          <p className="text-muted-foreground">Preencha os dados abaixo para solicitar alterações no contrato social da sua empresa.</p>
        </div>

        <DadosEmpresaSection
          dados={dadosEmpresa}
          onUpdate={updateDadosEmpresa}
          onSetDados={setDadosEmpresa}
        />

        <AlteracoesSocietariasSection
          data={alteracoesSocietarias}
          cnaesEmpresa={dadosEmpresa.cnaes}
          onUpdate={updateAlteracoesSocietarias}
          onAlteracaoQuotasAuto={autoMarkAlteracaoQuotas}
        />

        <AlteracoesEnderecoSection
          data={alteracoesEndereco}
          filiaisEmpresa={dadosEmpresa.filiais}
          onUpdate={updateAlteracoesEndereco}
        />

        <AlteracoesGestaoSection
          data={alteracoesGestao}
          onUpdate={updateAlteracoesGestao}
        />

        <ObservacoesSection
          value={observacoes}
          onChange={setObservacoes}
        />

        <div className="flex justify-center pt-6 pb-12">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[250px] h-12 text-base font-medium"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Enviando...</>
            ) : (
              <><Send className="mr-2 h-5 w-5" />Enviar para Contabilidade</>
            )}
          </Button>
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Outtax Contabilidade. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
