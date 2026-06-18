import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Users } from 'lucide-react';
import type { QuotaSocio } from '@/types/alteracao';

interface AlteracaoQuotasFormProps {
  quotas: QuotaSocio[];
  onChange: (quotas: QuotaSocio[]) => void;
}

const createEmptyQuota = (): QuotaSocio => ({
  id: crypto.randomUUID(),
  nomeSocio: '',
  valorCapital: '',
});

export function AlteracaoQuotasForm({ quotas, onChange }: AlteracaoQuotasFormProps) {
  const handleAdd = () => {
    onChange([...quotas, createEmptyQuota()]);
  };

  const handleRemove = (id: string) => {
    onChange(quotas.filter(q => q.id !== id));
  };

  const handleUpdate = (id: string, field: keyof QuotaSocio, value: string) => {
    onChange(quotas.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Informe o novo quadro societário com o nome de cada sócio e o valor do capital.
      </div>

      {quotas.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Clique em "Incluir" para adicionar os sócios ao novo quadro societário</p>
        </div>
      )}

      {quotas.map((quota, index) => (
        <Card key={quota.id} className="border-l-4 border-l-accent">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-accent-foreground">Sócio {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(quota.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Nome do Sócio</Label>
                <Input
                  placeholder="Nome completo do sócio"
                  value={quota.nomeSocio}
                  onChange={(e) => handleUpdate(quota.id, 'nomeSocio', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Valor do Capital (R$)</Label>
                <Input
                  placeholder="Ex: 50.000,00"
                  value={quota.valorCapital}
                  onChange={(e) => handleUpdate(quota.id, 'valorCapital', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Incluir
      </Button>
    </div>
  );
}
