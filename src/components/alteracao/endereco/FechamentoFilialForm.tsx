import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Building } from 'lucide-react';
import type { FilialEmpresa } from '@/types/alteracao';

interface FechamentoFilialFormProps {
  filiais: FilialEmpresa[];
  onChange: (filiais: FilialEmpresa[]) => void;
}

export function FechamentoFilialForm({ filiais, onChange }: FechamentoFilialFormProps) {
  const handleToggle = (cnpj: string, checked: boolean) => {
    onChange(filiais.map(f => f.cnpj === cnpj ? { ...f, selecionada: checked } : f));
  };

  if (filiais.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma filial encontrada.</p>
        <p className="text-xs mt-1">As filiais serão carregadas automaticamente após consultar o CNPJ da matriz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground mb-4">
        Selecione as filiais que deseja fechar:
      </p>
      
      {filiais.map((filial) => (
        <Card 
          key={filial.cnpj} 
          className={`border-l-4 transition-colors ${
            filial.selecionada ? 'border-l-destructive bg-destructive/5' : 'border-l-muted'
          }`}
        >
          <CardContent className="py-3 px-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id={`filial-${filial.cnpj}`}
                checked={filial.selecionada}
                onCheckedChange={(checked) => handleToggle(filial.cnpj, checked as boolean)}
                className="mt-1"
              />
              <label 
                htmlFor={`filial-${filial.cnpj}`}
                className="flex-1 cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-medium">{filial.cnpj}</span>
                  <span className="text-muted-foreground">{filial.nome}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {filial.nomeFantasia && <span>{filial.nomeFantasia} • </span>}
                  <span>{filial.cidade}/{filial.estado}</span>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
