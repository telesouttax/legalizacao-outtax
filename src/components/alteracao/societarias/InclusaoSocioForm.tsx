import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Plus, Trash2, UserPlus } from 'lucide-react';
import { EnderecoForm } from '../forms/EnderecoForm';
import { FileUpload } from '../forms/FileUpload';
import type { NovoSocio, Endereco } from '@/types/alteracao';

interface InclusaoSocioFormProps {
  socios: NovoSocio[];
  onChange: (socios: NovoSocio[]) => void;
  onAlteracaoQuotasAuto: () => void;
}

const emptyEndereco: Endereco = {
  rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '',
};

const createEmptySocio = (): NovoSocio => ({
  id: crypto.randomUUID(),
  nomeCompleto: '',
  cpf: '',
  rgCnh: '',
  anexoRgCnh: null,
  anexoRgCnhNome: '',
  endereco: { ...emptyEndereco },
  profissao: '',
  estadoCivil: '',
  nacionalidade: 'brasileiro(a)',
  tipoSocio: 'socio',
  capitalSocial: '',
  observacaoCessao: '',
});

export function InclusaoSocioForm({ socios, onChange, onAlteracaoQuotasAuto }: InclusaoSocioFormProps) {
  const handleAddSocio = () => {
    onChange([...socios, createEmptySocio()]);
    onAlteracaoQuotasAuto();
  };

  const handleRemoveSocio = (id: string) => {
    onChange(socios.filter(s => s.id !== id));
  };

  const handleUpdateSocio = (id: string, field: keyof NovoSocio, value: any) => {
    onChange(socios.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleUpdateEndereco = (id: string, endereco: Endereco) => {
    onChange(socios.map(s => s.id === id ? { ...s, endereco } : s));
  };

  const handleFileChange = (id: string, file: File | null, fileName: string) => {
    onChange(socios.map(s => s.id === id ? { ...s, anexoRgCnh: file, anexoRgCnhNome: fileName } : s));
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  return (
    <div className="space-y-4">
      {socios.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Clique no botão abaixo para adicionar um novo sócio</p>
        </div>
      )}

      {socios.map((socio, index) => (
        <Card key={socio.id} className="border-l-4 border-l-primary">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-primary">Novo Sócio {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSocio(socio.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="text-sm">Nome Completo</Label>
                <Input
                  placeholder="Nome completo do sócio"
                  value={socio.nomeCompleto}
                  onChange={(e) => handleUpdateSocio(socio.id, 'nomeCompleto', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Nacionalidade</Label>
                <Input
                  placeholder="Ex: brasileiro(a)"
                  value={socio.nacionalidade}
                  onChange={(e) => handleUpdateSocio(socio.id, 'nacionalidade', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Estado Civil</Label>
                <Select
                  value={socio.estadoCivil}
                  onValueChange={(value) => handleUpdateSocio(socio.id, 'estadoCivil', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="solteiro(a)">Solteiro(a)</SelectItem>
                    <SelectItem value="casado(a)">Casado(a)</SelectItem>
                    <SelectItem value="divorciado(a)">Divorciado(a)</SelectItem>
                    <SelectItem value="viúvo(a)">Viúvo(a)</SelectItem>
                    <SelectItem value="união estável">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">CPF</Label>
                <Input
                  placeholder="000.000.000-00"
                  value={socio.cpf}
                  onChange={(e) => handleUpdateSocio(socio.id, 'cpf', formatCPF(e.target.value))}
                />
              </div>

              <div>
                <Label className="text-sm">RG/CNH</Label>
                <Input
                  placeholder="Número do documento"
                  value={socio.rgCnh}
                  onChange={(e) => handleUpdateSocio(socio.id, 'rgCnh', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <FileUpload
                  id={`anexo-rg-${socio.id}`}
                  label="Anexo RG/CNH"
                  file={socio.anexoRgCnh}
                  fileName={socio.anexoRgCnhNome}
                  onFileChange={(file, name) => handleFileChange(socio.id, file, name)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-sm font-medium mb-2 block">Endereço</Label>
              <EnderecoForm
                endereco={socio.endereco}
                onChange={(endereco) => handleUpdateEndereco(socio.id, endereco)}
                prefix={`socio-${socio.id}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <Label className="text-sm">Profissão</Label>
                <Input
                  placeholder="Profissão do sócio"
                  value={socio.profissao}
                  onChange={(e) => handleUpdateSocio(socio.id, 'profissao', e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label className="text-sm">Tipo de Sócio</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p className="text-sm">
                        <strong>Sócio Administrador:</strong> Tem poderes de administração e gestão da empresa.
                        <br /><br />
                        <strong>Sócio (sem administração):</strong> É como um sócio investidor: usufrui dos lucros da empresa, mas não tem poderes de gestão e nem trabalha operacionalmente na empresa.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={socio.tipoSocio}
                  onValueChange={(value: 'socio' | 'socio_administrador') => handleUpdateSocio(socio.id, 'tipoSocio', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="socio">Sócio</SelectItem>
                    <SelectItem value="socio_administrador">Sócio Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">Capital Social (R$)</Label>
                <Input
                  placeholder="Valor do capital social"
                  value={socio.capitalSocial}
                  onChange={(e) => handleUpdateSocio(socio.id, 'capitalSocial', e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm">Observações sobre cessão de quotas</Label>
                <Textarea
                  placeholder="Informe quais sócios atuais vão ceder as quotas para este novo sócio..."
                  value={socio.observacaoCessao}
                  onChange={(e) => handleUpdateSocio(socio.id, 'observacaoCessao', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={handleAddSocio}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Novo Sócio
      </Button>
    </div>
  );
}
