import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserCog, HelpCircle } from 'lucide-react';
import { NomeacaoAdminForm } from './gestao/NomeacaoAdminForm';
import type { AlteracoesGestao } from '@/types/alteracao';

interface AlteracoesGestaoSectionProps {
  data: AlteracoesGestao;
  onUpdate: <K extends keyof AlteracoesGestao>(field: K, value: AlteracoesGestao[K]) => void;
}

interface CheckItemProps {
  id: string;
  label: string;
  helpText?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: React.ReactNode;
}

function CheckItem({ id, label, helpText, checked, onCheckedChange, children }: CheckItemProps) {
  return (
    <div className="space-y-3 py-4 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
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

export function AlteracoesGestaoSection({ data, onUpdate }: AlteracoesGestaoSectionProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserCog className="h-5 w-5 text-primary" />
          Alterações de Gestão
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CheckItem
          id="nomeacaoAdministradores"
          label="Nomeação de Administradores"
          helpText="Designar novos administradores para a empresa. Pode ser um sócio existente ou pessoa externa."
          checked={data.nomeacaoAdministradores}
          onCheckedChange={(checked) => onUpdate('nomeacaoAdministradores', checked)}
        >
          <NomeacaoAdminForm
            administradores={data.novosAdministradores}
            onChange={(admins) => onUpdate('novosAdministradores', admins)}
          />
        </CheckItem>

        <CheckItem
          id="destituicaoAdministradores"
          label="Destituição de Administradores"
          helpText="Remover administradores da empresa"
          checked={data.destituicaoAdministradores}
          onCheckedChange={(checked) => onUpdate('destituicaoAdministradores', checked)}
        >
          <div>
            <Label className="text-sm">Nome(s) do(s) administrador(es) a ser(em) destituído(s)</Label>
            <Textarea
              placeholder="Informe o nome completo de quem será destituído..."
              value={data.nomeDestituidos}
              onChange={(e) => onUpdate('nomeDestituidos', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CheckItem>

        <CheckItem
          id="inclusaoClausulas"
          label="Inclusão de Cláusulas"
          helpText="Adicionar novas cláusulas ao contrato social"
          checked={data.inclusaoClausulas}
          onCheckedChange={(checked) => onUpdate('inclusaoClausulas', checked)}
        >
          <div>
            <Label className="text-sm mb-1 block">Descreva a cláusula que deseja incluir</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Informe com as suas palavras a cláusula que quer colocar. Exemplo: "Quero colocar uma cláusula de herança que fique apenas para a minha esposa." Nós da Outtax vamos entender (por isso precisa ser explícito) e vamos formatar na linguagem societária.
            </p>
            <Textarea
              placeholder="Descreva a cláusula que deseja incluir..."
              value={data.descricaoClausulasIncluir}
              onChange={(e) => onUpdate('descricaoClausulasIncluir', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CheckItem>

        <CheckItem
          id="exclusaoClausulas"
          label="Exclusão de Cláusulas"
          helpText="Remover cláusulas existentes do contrato social"
          checked={data.exclusaoClausulas}
          onCheckedChange={(checked) => onUpdate('exclusaoClausulas', checked)}
        >
          <div>
            <Label className="text-sm">Qual cláusula deseja excluir?</Label>
            <Textarea
              placeholder="Informe qual a cláusula a ser excluída..."
              value={data.descricaoClausulasExcluir}
              onChange={(e) => onUpdate('descricaoClausulasExcluir', e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CheckItem>
      </CardContent>
    </Card>
  );
}
