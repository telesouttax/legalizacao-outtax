import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, HelpCircle } from 'lucide-react';
import { MudancaSedeForm } from './endereco/MudancaSedeForm';
import { AberturaFilialForm } from './endereco/AberturaFilialForm';
import { FechamentoFilialForm } from './endereco/FechamentoFilialForm';
import type { AlteracoesEndereco, FilialEmpresa } from '@/types/alteracao';

interface AlteracoesEnderecoSectionProps {
  data: AlteracoesEndereco;
  filiaisEmpresa: FilialEmpresa[];
  onUpdate: <K extends keyof AlteracoesEndereco>(field: K, value: AlteracoesEndereco[K]) => void;
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

export function AlteracoesEnderecoSection({ data, filiaisEmpresa, onUpdate }: AlteracoesEnderecoSectionProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Alterações de Endereço/Estrutura
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <CheckItem
          id="mudancaSede"
          label="Mudança de Sede"
          helpText="Transferir o endereço principal da empresa para outro local"
          checked={data.mudancaSede}
          onCheckedChange={(checked) => onUpdate('mudancaSede', checked)}
        >
          <MudancaSedeForm
            data={data.dadosMudancaSede}
            onChange={(dados) => onUpdate('dadosMudancaSede', dados)}
          />
        </CheckItem>

        <CheckItem
          id="aberturaFiliais"
          label="Abertura de Filiais"
          helpText="Criar novas unidades/filiais da empresa"
          checked={data.aberturaFiliais}
          onCheckedChange={(checked) => onUpdate('aberturaFiliais', checked)}
        >
          <AberturaFilialForm
            filiais={data.novasFiliais}
            onChange={(filiais) => onUpdate('novasFiliais', filiais)}
          />
        </CheckItem>

        <CheckItem
          id="fechamentoFiliais"
          label="Fechamento de Filiais"
          helpText="Encerrar atividades de filiais existentes"
          checked={data.fechamentoFiliais}
          onCheckedChange={(checked) => {
            onUpdate('fechamentoFiliais', checked);
            if (checked && data.filiaisFechamento.length === 0 && filiaisEmpresa.length > 0) {
              onUpdate('filiaisFechamento', filiaisEmpresa);
            }
          }}
        >
          <FechamentoFilialForm
            filiais={data.filiaisFechamento.length > 0 ? data.filiaisFechamento : filiaisEmpresa}
            onChange={(filiais) => onUpdate('filiaisFechamento', filiais)}
          />
        </CheckItem>
      </CardContent>
    </Card>
  );
}
