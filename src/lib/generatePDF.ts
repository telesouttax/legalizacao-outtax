import type { FormularioAlteracao } from '@/types/alteracao';

export function generatePDFHTML(data: FormularioAlteracao): string {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatEndereco = (end: any) => {
    if (!end) return '';
    return `${end.rua}, ${end.numero}${end.complemento ? ` - ${end.complemento}` : ''}, ${end.bairro}, ${end.cidade}/${end.estado} - CEP: ${end.cep}`;
  };

  const formatCapital = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val || '—';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderQSA = () => {
    if (!data.dadosEmpresa.socios || data.dadosEmpresa.socios.length === 0) return '';
    return data.dadosEmpresa.socios.map(s =>
      `<div class="sub-item"><strong>${s.nome}</strong> — ${s.qualificacao}</div>`
    ).join('');
  };

  const renderNovosSocios = () => {
    if (!data.alteracoesSocietarias.inclusaoSocios || data.alteracoesSocietarias.novosSocios.length === 0) return '';
    return data.alteracoesSocietarias.novosSocios.map(s =>
      `<div class="sub-item"><strong>${s.nomeCompleto}</strong> — CPF: ${s.cpf} — ${s.tipoSocio === 'socio_administrador' ? 'Sócio Administrador' : 'Sócio'} — Capital: ${formatCapital(s.capitalSocial)}</div>`
    ).join('');
  };

  const renderExclusoes = () => {
    if (!data.alteracoesSocietarias.exclusaoSocios || data.alteracoesSocietarias.sociosExclusao.length === 0) return '';
    return data.alteracoesSocietarias.sociosExclusao.map(s =>
      `<div class="sub-item">${s.nomeSocioSaindo} → Quotas para: ${s.sociosRecebem}</div>`
    ).join('');
  };

  const renderQuotas = () => {
    if (!data.alteracoesSocietarias.alteracaoQuotas || data.alteracoesSocietarias.novoQuadroSocietario.length === 0) return '';
    return data.alteracoesSocietarias.novoQuadroSocietario.map(q =>
      `<div class="sub-item">${q.nomeSocio}: ${formatCapital(q.valorCapital)}</div>`
    ).join('');
  };

  const renderCapital = () => {
    const cap = data.alteracoesSocietarias.dadosCapitalSocial;
    if (!data.alteracoesSocietarias.mudancaCapitalSocial || !cap.tipo) return '';
    if (cap.tipo === 'aumento') {
      const aumentos = cap.aumentos.map(a =>
        a.tipo === 'dinheiro' ? `Dinheiro: ${formatCapital(a.valor)}` : `Imóvel: ${formatCapital(a.valor)}`
      ).join(', ');
      return `<p>Aumento: ${aumentos || 'Não especificado'}</p>`;
    }
    return `<p>Diminuição — Novo valor: ${formatCapital(cap.novoValorCapital)}</p>`;
  };

  const renderObjeto = () => {
    const obj = data.alteracoesSocietarias.dadosObjetoSocial;
    if (!data.alteracoesSocietarias.alteracaoObjetoSocial || !obj.tipo) return '';
    let result = '';
    if (obj.tipo === 'adicionar' || obj.tipo === 'adicionar_remover') {
      result += `<p><strong>Adicionar:</strong> ${obj.atividadesAdicionar}</p>`;
    }
    if (obj.tipo === 'remover' || obj.tipo === 'adicionar_remover') {
      result += `<p><strong>Remover CNAEs:</strong> ${obj.cnaesSelecionadosRemover.join(', ')}</p>`;
    }
    return result;
  };

  const renderSede = () => {
    const sede = data.alteracoesEndereco.dadosMudancaSede;
    if (!data.alteracoesEndereco.mudancaSede) return '';
    return `<p>${formatEndereco(sede.endereco)}${sede.numeroIPTU ? ` — IPTU: ${sede.numeroIPTU}` : ''}</p>`;
  };

  const renderFiliais = () => {
    if (!data.alteracoesEndereco.aberturaFiliais || data.alteracoesEndereco.novasFiliais.length === 0) return '';
    return data.alteracoesEndereco.novasFiliais.map(f =>
      `<div class="sub-item">${formatEndereco(f.endereco)}${f.atividades ? ` — ${f.atividades}` : ''}</div>`
    ).join('');
  };

  const renderFechamento = () => {
    const fechadas = data.alteracoesEndereco.filiaisFechamento.filter(f => f.selecionada);
    if (!data.alteracoesEndereco.fechamentoFiliais || fechadas.length === 0) return '';
    return fechadas.map(f => `<div class="sub-item">${f.cnpj} — ${f.nome}</div>`).join('');
  };

  const renderAdmins = () => {
    if (!data.alteracoesGestao.nomeacaoAdministradores || data.alteracoesGestao.novosAdministradores.length === 0) return '';
    return data.alteracoesGestao.novosAdministradores.map(a =>
      a.tipo === 'socio_existente'
        ? `<div class="sub-item">Sócio → Administrador: ${a.nomeSocioExistente}</div>`
        : `<div class="sub-item">Novo Admin: ${a.nomeCompleto} — CPF: ${a.cpf}</div>`
    ).join('');
  };

  const emp = data.dadosEmpresa;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Alteração Contratual — ${emp.razaoSocial}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #152c6b; padding: 40px; }
    .header { background: #152c6b; color: white; padding: 20px 30px; margin: -40px -40px 30px -40px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 16pt; font-weight: 600; }
    .logo { font-size: 18pt; font-weight: 300; letter-spacing: 4px; }
    .company-box { background: #f5f7fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e0e4ed; }
    .company-box h2 { font-size: 13pt; color: #285199; margin-bottom: 12px; border-bottom: 2px solid #285199; padding-bottom: 6px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .info-item { font-size: 10pt; }
    .info-item strong { color: #152c6b; }
    .qsa-box { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #ccc; }
    .qsa-box .qsa-title { font-size: 10pt; font-weight: 600; color: #285199; margin-bottom: 6px; }
    .section { margin-bottom: 16px; }
    .item { padding: 12px 15px; background: #f5f7fa; border-left: 4px solid #FF8E2A; border-radius: 0 8px 8px 0; }
    .item strong { color: #152c6b; display: block; margin-bottom: 5px; }
    .sub-item { font-size: 10pt; padding: 3px 0; border-bottom: 1px dashed #ddd; }
    .sub-item:last-child { border-bottom: none; }
    .details { color: #555; font-size: 10pt; white-space: pre-wrap; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 9pt; color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">O U T T A X</div>
    <h1>Solicitação de Alteração Contratual</h1>
  </div>

  <div class="company-box">
    <h2>Dados da Empresa</h2>
    <div class="info-grid">
      <div class="info-item"><strong>CNPJ:</strong> ${emp.cnpj}</div>
      <div class="info-item"><strong>Razão Social:</strong> ${emp.razaoSocial}</div>
      <div class="info-item"><strong>Nome Fantasia:</strong> ${emp.nomeFantasia || '—'}</div>
      <div class="info-item"><strong>Situação:</strong> ${emp.situacao || '—'}</div>
      <div class="info-item"><strong>Capital Social:</strong> ${formatCapital(emp.capitalSocial)}</div>
      <div class="info-item"><strong>Natureza Jurídica:</strong> ${emp.naturezaJuridica || '—'}</div>
      <div class="info-item"><strong>Abertura:</strong> ${emp.abertura || '—'}</div>
      <div class="info-item"><strong>Endereço:</strong> ${emp.endereco}, ${emp.numero}${emp.complemento ? ` — ${emp.complemento}` : ''}</div>
      <div class="info-item"><strong>Bairro/Cidade:</strong> ${emp.bairro}, ${emp.cidade}/${emp.uf}</div>
      <div class="info-item"><strong>CEP:</strong> ${emp.cep}</div>
      ${emp.telefone ? `<div class="info-item"><strong>Telefone:</strong> ${emp.telefone}</div>` : ''}
      ${emp.email ? `<div class="info-item"><strong>E-mail:</strong> ${emp.email}</div>` : ''}
    </div>
    ${emp.socios && emp.socios.length > 0 ? `
    <div class="qsa-box">
      <div class="qsa-title">👥 Quadro Societário Atual (Receita Federal)</div>
      ${renderQSA()}
    </div>` : ''}
  </div>

  <h2 style="font-size:13pt;color:#285199;margin-bottom:14px;border-bottom:2px solid #FF8E2A;padding-bottom:6px;">Alterações Solicitadas</h2>

  ${data.alteracoesSocietarias.inclusaoSocios ? `<div class="section"><div class="item"><strong>✓ Inclusão de Sócio(s)</strong>${renderNovosSocios()}</div></div>` : ''}
  ${data.alteracoesSocietarias.exclusaoSocios ? `<div class="section"><div class="item"><strong>✓ Exclusão de Sócio(s)</strong>${renderExclusoes()}</div></div>` : ''}
  ${data.alteracoesSocietarias.alteracaoQuotas ? `<div class="section"><div class="item"><strong>✓ Alteração de Quotas — Novo Quadro Societário</strong>${renderQuotas()}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaRazaoSocial ? `<div class="section"><div class="item"><strong>✓ Nova Razão Social:</strong> ${data.alteracoesSocietarias.novaRazaoSocial}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaNomeFantasia ? `<div class="section"><div class="item"><strong>✓ Novo Nome Fantasia:</strong> ${data.alteracoesSocietarias.novoNomeFantasia}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaCapitalSocial ? `<div class="section"><div class="item"><strong>✓ Mudança de Capital Social</strong>${renderCapital()}</div></div>` : ''}
  ${data.alteracoesSocietarias.alteracaoObjetoSocial ? `<div class="section"><div class="item"><strong>✓ Alteração do Objeto Social</strong>${renderObjeto()}</div></div>` : ''}
  ${data.alteracoesEndereco.mudancaSede ? `<div class="section"><div class="item"><strong>✓ Mudança de Sede</strong>${renderSede()}</div></div>` : ''}
  ${data.alteracoesEndereco.aberturaFiliais ? `<div class="section"><div class="item"><strong>✓ Abertura de Filial(is)</strong>${renderFiliais()}</div></div>` : ''}
  ${data.alteracoesEndereco.fechamentoFiliais ? `<div class="section"><div class="item"><strong>✓ Fechamento de Filial(is)</strong>${renderFechamento()}</div></div>` : ''}
  ${data.alteracoesGestao.nomeacaoAdministradores ? `<div class="section"><div class="item"><strong>✓ Nomeação de Administrador(es)</strong>${renderAdmins()}</div></div>` : ''}
  ${data.alteracoesGestao.destituicaoAdministradores ? `<div class="section"><div class="item"><strong>✓ Destituição de Administrador(es):</strong> ${data.alteracoesGestao.nomeDestituidos}</div></div>` : ''}
  ${data.alteracoesGestao.inclusaoClausulas ? `<div class="section"><div class="item"><strong>✓ Inclusão de Cláusulas:</strong><p class="details">${data.alteracoesGestao.descricaoClausulasIncluir}</p></div></div>` : ''}
  ${data.alteracoesGestao.exclusaoClausulas ? `<div class="section"><div class="item"><strong>✓ Exclusão de Cláusulas:</strong><p class="details">${data.alteracoesGestao.descricaoClausulasExcluir}</p></div></div>` : ''}
  ${data.observacoes ? `<div class="section"><div class="item"><strong>📝 Observações:</strong><p class="details">${data.observacoes}</p></div></div>` : ''}

  <div class="footer">
    <p>Documento gerado em ${formatDate(data.dataEnvio)}</p>
    <p>Outtax Contabilidade — Transformando números em resultados</p>
  </div>
</body>
</html>`;
}

export async function generatePDFBase64(data: FormularioAlteracao): Promise<string> {
  const html = generatePDFHTML(data);
  const base64 = btoa(unescape(encodeURIComponent(html)));
  return base64;
}
