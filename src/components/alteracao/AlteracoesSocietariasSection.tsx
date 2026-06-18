import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Users, HelpCircle } from 'lucide-react';
import { InclusaoSocioForm } from './societarias/InclusaoSocioForm';
import { ExclusaoSocioForm } from './societarias/ExclusaoSocioForm';
import { AlteracaoQuotasForm } from './societarias/AlteracaoQuotasForm';
import { MudancaCapitalForm } from './societarias/MudancaCapitalForm';
import { AlteracaoObjetoSocialForm } from './societarias/AlteracaoObjetoSocialForm';
import type { AlteracoesSocietarias, CNAEEmpresa } from '@/types/alteracao';

interface AlteracoesSocietariasSectionProps {
  data: AlteracoesSocietarias;
  cnaesEmpresa: CNAEEmpresa[];
  onUpdate: <K extends keyof AlteracoesSocietarias>(field: K, value: AlteracoesSocietarias[K]) => void;
  onAlteracaoQuotasAuto: () => void;
}

interface CheckItemProps {
  id: string;
  label: string;
  helpText?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

function CheckItem({ id, label, helpText, checked, onCheckedChange, children, disabled }: CheckItemProps) {
  return (
    <div className="space-y-3 py-4 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          className="mt-0.5"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor={id} 
              className="text-sm font-medium cursor-pointer leading-tight"
            >
              {label}
            </Label>
            {helpText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      
      {checked && children && (
        <div className="ml-7 mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function AlteracoesSocietariasSection({ 
  data, 
  cnaesEmpresa,
  onUpdate, 
  onAlteracaoQuotasAuto 
}: AlteracoesSocietariasSectionProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Alterações Societárias
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CheckItem
          id="inclusaoSocios"
          label="Inclusão de Sócios"
          helpText="Adicionar novos sócios ao quadro societário da empresa"
          checked={data.inclusaoSocios}
          onCheckedChange={(checked) => {
            onUpdate('inclusaoSocios', checked);
            if (checked) onAlteracaoQuotasAuto();
          }}
        >
          <InclusaoSocioForm
            socios={data.novosSocios}
            onChange={(socios) => onUpdate('novosSocios', socios)}
            onAlteracaoQuotasAuto={onAlteracaoQuotasAuto}
          />
        </CheckItem>

        <CheckItem
          id="exclusaoSocios"
          label="Exclusão de Sócios"
          helpText="Remover sócios do quadro societário da empresa"
          checked={data.exclusaoSocios}
          onCheckedChange={(checked) => {
            onUpdate('exclusaoSocios', checked);
            if (checked) onAlteracaoQuotasAuto();
          }}
        >
          <ExclusaoSocioForm
            socios={data.sociosExclusao}
            onChange={(socios) => onUpdate('sociosExclusao', socios)}
            onAlteracaoQuotasAuto={onAlteracaoQuotasAuto}
          />
        </CheckItem>

        <CheckItem
          id="alteracaoQuotas"
          label="Alteração de Quotas"
          helpText="Modificar a distribuição do capital entre os sócios"
          checked={data.alteracaoQuotas}
          onCheckedChange={(checked) => {
            // Só permite desmarcar se não tiver inclusão ou exclusão de sócios
            if (!checked && (data.inclusaoSocios || data.exclusaoSocios)) {
              return; // Bloqueia desmarcação
            }
            onUpdate('alteracaoQuotas', checked);
          }}
          disabled={data.inclusaoSocios || data.exclusaoSocios}
        >
          <AlteracaoQuotasForm
            quotas={data.novoQuadroSocietario}
            onChange={(quotas) => onUpdate('novoQuadroSocietario', quotas)}
          />
        </CheckItem>

        <CheckItem
          id="mudancaRazaoSocial"
          label="Mudança de Razão Social"
          helpText="Alterar o nome jurídico oficial da empresa"
          checked={data.mudancaRazaoSocial}
          onCheckedChange={(checked) => onUpdate('mudancaRazaoSocial', checked)}
        >
          <div>
            <Label className="text-sm">Nova Razão Social</Label>
            <Input
              placeholder="Informe a nova razão social desejada..."
              value={data.novaRazaoSocial}
              onChange={(e) => onUpdate('novaRazaoSocial', e.target.value)}
            />
          </div>
        </CheckItem>

        <CheckItem
          id="mudancaNomeFantasia"
          label="Mudança de Nome Fantasia"
          helpText="Alterar o nome comercial/marca da empresa"
          checked={data.mudancaNomeFantasia}
          onCheckedChange={(checked) => onUpdate('mudancaNomeFantasia', checked)}
        >
          <div>
            <Label className="text-sm">Novo Nome Fantasia</Label>
            <Input
              placeholder="Informe o novo nome fantasia desejado..."
              value={data.novoNomeFantasia}
              onChange={(e) => onUpdate('novoNomeFantasia', e.target.value)}
            />
          </div>
        </CheckItem>

        <CheckItem
          id="mudancaCapitalSocial"
          label="Mudança de Capital Social"
          helpText="Aumentar ou reduzir o capital social da empresa"
          checked={data.mudancaCapitalSocial}
          onCheckedChange={(checked) => onUpdate('mudancaCapitalSocial', checked)}
        >
          <MudancaCapitalForm
            data={data.dadosCapitalSocial}
            onChange={(dados) => onUpdate('dadosCapitalSocial', dados)}
          />
        </CheckItem>

        <CheckItem
          id="alteracaoObjetoSocial"
          label="Alteração do Objeto Social (CNAEs)"
          helpText="Modificar as atividades econômicas da empresa"
          checked={data.alteracaoObjetoSocial}
          onCheckedChange={(checked) => onUpdate('alteracaoObjetoSocial', checked)}
        >
          <AlteracaoObjetoSocialForm
            data={data.dadosObjetoSocial}
            cnaesEmpresa={cnaesEmpresa}
            onChange={(dados) => onUpdate('dadosObjetoSocial', dados)}
          />
        </CheckItem>
      </CardContent>
    </Card>
  );
}
