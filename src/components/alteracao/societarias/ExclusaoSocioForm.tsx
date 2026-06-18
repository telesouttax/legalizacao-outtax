import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, UserMinus } from 'lucide-react';
import type { SocioExclusao } from '@/types/alteracao';

interface ExclusaoSocioFormProps {
  socios: SocioExclusao[];
  onChange: (socios: SocioExclusao[]) => void;
  onAlteracaoQuotasAuto: () => void;
}

const createEmptySocio = (): SocioExclusao => ({
  id: crypto.randomUUID(),
  nomeSocioSaindo: '',
  sociosRecebem: '',
});

export function ExclusaoSocioForm({ socios, onChange, onAlteracaoQuotasAuto }: ExclusaoSocioFormProps) {
  const handleAdd = () => {
    onChange([...socios, createEmptySocio()]);
    onAlteracaoQuotasAuto();
  };

  const handleRemove = (id: string) => {
    onChange(socios.filter(s => s.id !== id));
  };

  const handleUpdate = (id: string, field: keyof SocioExclusao, value: string) => {
    onChange(socios.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="space-y-4">
      {socios.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <UserMinus className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Clique no botão abaixo para informar um sócio que está saindo</p>
        </div>
      )}

      {socios.map((socio, index) => (
        <Card key={socio.id} className="border-l-4 border-l-destructive">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-destructive">Exclusão {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(socio.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Nome do Sócio que está saindo</Label>
                <Input
                  placeholder="Nome completo do sócio"
                  value={socio.nomeSocioSaindo}
                  onChange={(e) => handleUpdate(socio.id, 'nomeSocioSaindo', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Sócio(s) que receberão as quotas</Label>
                <Input
                  placeholder="Nome(s) dos sócios que recebem (separados por vírgula se mais de um)"
                  value={socio.sociosRecebem}
                  onChange={(e) => handleUpdate(socio.id, 'sociosRecebem', e.target.value)}
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
        Adicionar Sócio para Exclusão
      </Button>
    </div>
  );
}
