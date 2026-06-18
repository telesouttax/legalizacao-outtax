import type { FormularioAlteracao } from '@/types/alteracao';

// Converte File para base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Verifica se o arquivo é imagem
function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

// Gera HTML para um anexo (imagem embutida ou link de download)
async function renderAnexo(
  file: File | null | undefined,
  fileName: string | undefined,
  label: string
): Promise<string> {
  if (!file || !fileName) return '';

  try {
    const base64 = await fileToBase64(file);

    if (isImage(file)) {
      return `
        <div class="anexo-block">
          <div class="anexo-label">📎 ${label}: ${fileName}</div>
          <img src="${base64}" class="anexo-img" alt="${label}" />
        </div>`;
    } else {
      // PDF — link de download embutido em base64
      return `
        <div class="anexo-block">
          <div class="anexo-label">📎 ${label}</div>
          <a href="${base64}" download="${fileName}" class="anexo-link">
            ⬇️ Baixar ${fileName}
          </a>
        </div>`;
    }
  } catch {
    return `<div class="anexo-block"><div class="anexo-label">📎 ${label}: ${fileName} (erro ao carregar)</div></div>`;
  }
}

export async function generatePDFHTML(data: FormularioAlteracao): Promise<string> {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatEndereco = (end: any) => {
    if (!end) return '';
    return `${end.rua}, ${end.numero}${end.complemento ? ` — ${end.complemento}` : ''}, ${end.bairro}, ${end.cidade}/${end.estado} — CEP: ${end.cep}`;
  };

  const formatCapital = (val: string) => {
    const num = parseFloat(val?.replace(/\./g, '').replace(',', '.'));
    if (isNaN(num)) return val || '—';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // === Renderiza QSA ===
  const renderQSA = () => {
    if (!data.dadosEmpresa.socios?.length) return '';
    return data.dadosEmpresa.socios.map(s =>
      `<div class="sub-item"><strong>${s.nome}</strong> — ${s.qualificacao}</div>`
    ).join('');
  };

  // === Novos Sócios com anexos ===
  const renderNovosSocios = async () => {
    if (!data.alteracoesSocietarias.inclusaoSocios || !data.alteracoesSocietarias.novosSocios.length) return '';
    const items = await Promise.all(data.alteracoesSocietarias.novosSocios.map(async (s) => {
      const anexo = await renderAnexo(s.anexoRgCnh, s.anexoRgCnhNome, `RG/CNH — ${s.nomeCompleto}`);
      return `
        <div class="sub-item">
          <strong>${s.nomeCompleto}</strong> — CPF: ${s.cpf} — ${s.tipoSocio === 'socio_administrador' ? 'Sócio Administrador' : 'Sócio'}
          ${s.nacionalidade ? ` — ${s.nacionalidade}` : ''}
          ${s.estadoCivil ? ` — ${s.estadoCivil}` : ''}
          ${s.profissao ? ` — ${s.profissao}` : ''}
          — Capital: ${formatCapital(s.capitalSocial)}
          ${anexo}
        </div>`;
    }));
    return items.join('');
  };

  const renderExclusoes = () => {
    if (!data.alteracoesSocietarias.exclusaoSocios || !data.alteracoesSocietarias.sociosExclusao.length) return '';
    return data.alteracoesSocietarias.sociosExclusao.map(s =>
      `<div class="sub-item">${s.nomeSocioSaindo} → Quotas para: ${s.sociosRecebem}</div>`
    ).join('');
  };

  const renderQuotas = () => {
    if (!data.alteracoesSocietarias.alteracaoQuotas || !data.alteracoesSocietarias.novoQuadroSocietario.length) return '';
    return data.alteracoesSocietarias.novoQuadroSocietario.map(q =>
      `<div class="sub-item">${q.nomeSocio}: ${formatCapital(q.valorCapital)}</div>`
    ).join('');
  };

  // === Capital Social com anexos ===
  const renderCapital = async () => {
    const cap = data.alteracoesSocietarias.dadosCapitalSocial;
    if (!data.alteracoesSocietarias.mudancaCapitalSocial || !cap.tipo) return '';
    if (cap.tipo === 'aumento') {
      const aumentos = await Promise.all(cap.aumentos.map(async (a) => {
        const anexoRGI = await renderAnexo(a.anexoRGI, a.anexoRGINome, 'RGI do Imóvel');
        const anexoIPTU = await renderAnexo(a.anexoIPTU, a.anexoIPTUNome, 'IPTU');
        const anexoComp = await renderAnexo(a.anexoComprovanteResidencia, a.anexoComprovanteResidenciaNome, 'Comprovante de Residência');
        return `<div class="sub-item">${a.tipo === 'dinheiro' ? 'Dinheiro' : 'Imóvel'}: ${formatCapital(a.valor)}${anexoRGI}${anexoIPTU}${anexoComp}</div>`;
      }));
      return aumentos.join('');
    }
    return `<div class="sub-item">Diminuição — Novo valor: ${formatCapital(cap.novoValorCapital)}</div>`;
  };

  const renderObjeto = () => {
    const obj = data.alteracoesSocietarias.dadosObjetoSocial;
    if (!data.alteracoesSocietarias.alteracaoObjetoSocial || !obj.tipo) return '';
    let result = '';
    if (obj.tipo === 'adicionar' || obj.tipo === 'adicionar_remover')
      result += `<div class="sub-item"><strong>Adicionar:</strong> ${obj.atividadesAdicionar}</div>`;
    if (obj.tipo === 'remover' || obj.tipo === 'adicionar_remover')
      result += `<div class="sub-item"><strong>Remover CNAEs:</strong> ${obj.cnaesSelecionadosRemover.join(', ')}</div>`;
    return result;
  };

  // === Mudança de Sede com IPTU ===
  const renderSede = async () => {
    if (!data.alteracoesEndereco.mudancaSede) return '';
    const sede = data.alteracoesEndereco.dadosMudancaSede;
    const anexoIPTU = await renderAnexo(sede.anexoIPTU, sede.anexoIPTUNome, 'IPTU da Nova Sede');
    return `<div class="sub-item">${formatEndereco(sede.endereco)}${sede.numeroIPTU ? ` — IPTU: ${sede.numeroIPTU}` : ''}${anexoIPTU}</div>`;
  };

  // === Abertura de Filiais com IPTU ===
  const renderFiliais = async () => {
    if (!data.alteracoesEndereco.aberturaFiliais || !data.alteracoesEndereco.novasFiliais.length) return '';
    const items = await Promise.all(data.alteracoesEndereco.novasFiliais.map(async (f) => {
      const anexoIPTU = await renderAnexo(f.anexoIPTU, f.anexoIPTUNome, 'IPTU da Filial');
      return `<div class="sub-item">${formatEndereco(f.endereco)}${f.atividades ? ` — ${f.atividades}` : ''}${anexoIPTU}</div>`;
    }));
    return items.join('');
  };

  const renderFechamento = () => {
    const fechadas = data.alteracoesEndereco.filiaisFechamento.filter(f => f.selecionada);
    if (!data.alteracoesEndereco.fechamentoFiliais || !fechadas.length) return '';
    return fechadas.map(f => `<div class="sub-item">${f.cnpj} — ${f.nome}</div>`).join('');
  };

  // === Administradores com anexos ===
  const renderAdmins = async () => {
    if (!data.alteracoesGestao.nomeacaoAdministradores || !data.alteracoesGestao.novosAdministradores.length) return '';
    const items = await Promise.all(data.alteracoesGestao.novosAdministradores.map(async (a) => {
      if (a.tipo === 'socio_existente') {
        return `<div class="sub-item">Sócio → Administrador: ${a.nomeSocioExistente}</div>`;
      }
      const anexo = await renderAnexo(a.anexoRgCnh, a.anexoRgCnhNome, `RG/CNH — ${a.nomeCompleto}`);
      return `<div class="sub-item"><strong>${a.nomeCompleto}</strong> — CPF: ${a.cpf}${anexo}</div>`;
    }));
    return items.join('');
  };

  const emp = data.dadosEmpresa;

  // Resolve todos os async em paralelo
  const [
    novosSociosHtml,
    capitalHtml,
    sedeHtml,
    filiaisHtml,
    adminsHtml,
  ] = await Promise.all([
    renderNovosSocios(),
    renderCapital(),
    renderSede(),
    renderFiliais(),
    renderAdmins(),
  ]);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Alteração Contratual — ${emp.razaoSocial}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #152c6b; padding: 40px; }
    .header { background: #152c6b; color: white; padding: 20px 30px; margin: -40px -40px 30px -40px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 15pt; font-weight: 600; }
    .logo { font-size: 18pt; font-weight: 300; letter-spacing: 4px; }
    .company-box { background: #f5f7fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e0e4ed; }
    .company-box h2, .section-title { font-size: 12pt; color: #285199; margin-bottom: 12px; border-bottom: 2px solid #285199; padding-bottom: 6px; }
    .section-title { margin-bottom: 16px; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .info-item { font-size: 10pt; }
    .info-item strong { color: #152c6b; }
    .qsa-box { margin-top: 12px; padding-top: 10px; border-top: 1px dashed #ccc; }
    .qsa-title { font-size: 10pt; font-weight: 600; color: #285199; margin-bottom: 6px; }
    .section { margin-bottom: 14px; }
    .item { padding: 12px 15px; background: #f5f7fa; border-left: 4px solid #FF8E2A; border-radius: 0 8px 8px 0; }
    .item strong { color: #152c6b; display: block; margin-bottom: 6px; }
    .sub-item { font-size: 10pt; padding: 6px 0; border-bottom: 1px dashed #ddd; }
    .sub-item:last-child { border-bottom: none; }
    .details { color: #555; font-size: 10pt; white-space: pre-wrap; }
    /* Anexos */
    .anexo-block { margin-top: 8px; padding: 8px; background: #fff; border: 1px solid #e0e4ed; border-radius: 6px; }
    .anexo-label { font-size: 9pt; font-weight: 600; color: #285199; margin-bottom: 6px; }
    .anexo-img { max-width: 100%; max-height: 400px; border-radius: 4px; border: 1px solid #ddd; display: block; }
    .anexo-link { display: inline-block; margin-top: 4px; padding: 6px 14px; background: #285199; color: white; border-radius: 4px; text-decoration: none; font-size: 10pt; }
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
    ${emp.socios?.length ? `
    <div class="qsa-box">
      <div class="qsa-title">👥 Quadro Societário Atual (Receita Federal)</div>
      ${renderQSA()}
    </div>` : ''}
  </div>

  <div class="section-title" style="font-size:12pt;color:#285199;border-bottom:2px solid #FF8E2A;padding-bottom:6px;margin-bottom:16px;">
    Alterações Solicitadas
  </div>

  ${data.alteracoesSocietarias.inclusaoSocios ? `<div class="section"><div class="item"><strong>✓ Inclusão de Sócio(s)</strong>${novosSociosHtml}</div></div>` : ''}
  ${data.alteracoesSocietarias.exclusaoSocios ? `<div class="section"><div class="item"><strong>✓ Exclusão de Sócio(s)</strong>${renderExclusoes()}</div></div>` : ''}
  ${data.alteracoesSocietarias.alteracaoQuotas ? `<div class="section"><div class="item"><strong>✓ Alteração de Quotas</strong>${renderQuotas()}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaRazaoSocial ? `<div class="section"><div class="item"><strong>✓ Nova Razão Social:</strong> ${data.alteracoesSocietarias.novaRazaoSocial}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaNomeFantasia ? `<div class="section"><div class="item"><strong>✓ Novo Nome Fantasia:</strong> ${data.alteracoesSocietarias.novoNomeFantasia}</div></div>` : ''}
  ${data.alteracoesSocietarias.mudancaCapitalSocial ? `<div class="section"><div class="item"><strong>✓ Mudança de Capital Social</strong>${capitalHtml}</div></div>` : ''}
  ${data.alteracoesSocietarias.alteracaoObjetoSocial ? `<div class="section"><div class="item"><strong>✓ Alteração do Objeto Social</strong>${renderObjeto()}</div></div>` : ''}
  ${data.alteracoesEndereco.mudancaSede ? `<div class="section"><div class="item"><strong>✓ Mudança de Sede</strong>${sedeHtml}</div></div>` : ''}
  ${data.alteracoesEndereco.aberturaFiliais ? `<div class="section"><div class="item"><strong>✓ Abertura de Filial(is)</strong>${filiaisHtml}</div></div>` : ''}
  ${data.alteracoesEndereco.fechamentoFiliais ? `<div class="section"><div class="item"><strong>✓ Fechamento de Filial(is)</strong>${renderFechamento()}</div></div>` : ''}
  ${data.alteracoesGestao.nomeacaoAdministradores ? `<div class="section"><div class="item"><strong>✓ Nomeação de Administrador(es)</strong>${adminsHtml}</div></div>` : ''}
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
  const html = await generatePDFHTML(data);
  const base64 = btoa(unescape(encodeURIComponent(html)));
  return base64;
}
