import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Plus, Trash2, Banknote, Building } from 'lucide-react';
import { FileUpload } from '../forms/FileUpload';
import type { MudancaCapitalSocialData, AumentoCapitalItem } from '@/types/alteracao';

interface MudancaCapitalFormProps {
  data: MudancaCapitalSocialData;
  onChange: (data: MudancaCapitalSocialData) => void;
}

const createEmptyAumento = (): AumentoCapitalItem => ({
  id: crypto.randomUUID(),
  tipo: 'dinheiro',
  valor: '',
  anexoRGI: null,
  anexoRGINome: '',
  anexoIPTU: null,
  anexoIPTUNome: '',
  anexoComprovanteResidencia: null,
  anexoComprovanteResidenciaNome: '',
});

export function MudancaCapitalForm({ data, onChange }: MudancaCapitalFormProps) {
  const handleTipoChange = (tipo: 'aumento' | 'diminuicao') => {
    onChange({ ...data, tipo });
  };

  const handleAddAumento = () => {
    onChange({ ...data, aumentos: [...data.aumentos, createEmptyAumento()] });
  };

  const handleRemoveAumento = (id: string) => {
    onChange({ ...data, aumentos: data.aumentos.filter(a => a.id !== id) });
  };

  const handleUpdateAumento = (id: string, field: keyof AumentoCapitalItem, value: any) => {
    onChange({
      ...data,
      aumentos: data.aumentos.map(a => a.id === id ? { ...a, [field]: value } : a),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">Tipo de alteração</Label>
        <Select
          value={data.tipo}
          onValueChange={(value: 'aumento' | 'diminuicao') => handleTipoChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de alteração" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="aumento">Aumento de Capital</SelectItem>
            <SelectItem value="diminuicao">Diminuição de Capital</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.tipo === 'aumento' && (
        <div className="space-y-4">
          {data.aumentos.length === 0 && (
            <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
              <Banknote className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Clique no botão abaixo para adicionar um aumento de capital</p>
            </div>
          )}

          {data.aumentos.map((aumento, index) => (
            <Card key={aumento.id} className={`border-l-4 ${aumento.tipo === 'dinheiro' ? 'border-l-green-500' : 'border-l-blue-500'}`}>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    {aumento.tipo === 'dinheiro' ? (
                      <><Banknote className="h-4 w-4 text-green-600" /> Aumento {index + 1} - Dinheiro</>
                    ) : (
                      <><Building className="h-4 w-4 text-blue-600" /> Aumento {index + 1} - Imóvel</>
                    )}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAumento(aumento.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label className="text-sm">Tipo de aumento</Label>
                  <Select
                    value={aumento.tipo}
                    onValueChange={(value: 'dinheiro' | 'imoveis') => handleUpdateAumento(aumento.id, 'tipo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="imoveis">Imóvel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Valor (R$)</Label>
                  <Input
                    placeholder="Ex: 100.000,00"
                    value={aumento.valor}
                    onChange={(e) => handleUpdateAumento(aumento.id, 'valor', e.target.value)}
                  />
                </div>

                {aumento.tipo === 'imoveis' && (
                  <div className="space-y-4 pt-2 border-t">
                    <FileUpload
                      id={`rgi-${aumento.id}`}
                      label="RGI do Imóvel (Registro Geral de Imóveis)"
                      file={aumento.anexoRGI}
                      fileName={aumento.anexoRGINome}
                      onFileChange={(file, name) => {
                        handleUpdateAumento(aumento.id, 'anexoRGI', file);
                        handleUpdateAumento(aumento.id, 'anexoRGINome', name);
                      }}
                    />

                    <FileUpload
                      id={`iptu-${aumento.id}`}
                      label="IPTU do Imóvel"
                      file={aumento.anexoIPTU}
                      fileName={aumento.anexoIPTUNome}
                      onFileChange={(file, name) => {
                        handleUpdateAumento(aumento.id, 'anexoIPTU', file);
                        handleUpdateAumento(aumento.id, 'anexoIPTUNome', name);
                      }}
                    />

                    <FileUpload
                      id={`comprovante-${aumento.id}`}
                      label="Comprovante de Residência do Imóvel"
                      file={aumento.anexoComprovanteResidencia}
                      fileName={aumento.anexoComprovanteResidenciaNome}
                      onFileChange={(file, name) => {
                        handleUpdateAumento(aumento.id, 'anexoComprovanteResidencia', file);
                        handleUpdateAumento(aumento.id, 'anexoComprovanteResidenciaNome', name);
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddAumento}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Aumento de Capital
          </Button>
        </div>
      )}

      {data.tipo === 'diminuicao' && (
        <>
          <Alert className="border-amber-300 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Atenção:</strong> Para realizar a diminuição deverá ser publicado em Diário Oficial e em jornal de grande circulação (exemplo: O Dia, Extra, O Globo) e aguardar 90 dias após a publicação, somente assim poderemos fazer a alteração.
              <br /><br />
              Mas fique tranquilo, pode fazer a solicitação que nosso time vai entrar em contato para explicar esse procedimento. Continue preenchendo o formulário.
            </AlertDescription>
          </Alert>

          <div>
            <Label className="text-sm">Novo valor do capital social (R$)</Label>
            <Input
              placeholder="Ex: 50.000,00"
              value={data.novoValorCapital}
              onChange={(e) => onChange({ ...data, novoValorCapital: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
