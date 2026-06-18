import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, UserCog } from 'lucide-react';
import { EnderecoForm } from '../forms/EnderecoForm';
import { FileUpload } from '../forms/FileUpload';
import type { NovoAdministrador, Endereco } from '@/types/alteracao';

interface NomeacaoAdminFormProps {
  administradores: NovoAdministrador[];
  onChange: (administradores: NovoAdministrador[]) => void;
}

const emptyEndereco: Endereco = {
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

const createEmptyAdmin = (): NovoAdministrador => ({
  id: crypto.randomUUID(),
  tipo: 'socio_existente',
  nomeSocioExistente: '',
  nomeCompleto: '',
  cpf: '',
  rgCnh: '',
  anexoRgCnh: null,
  anexoRgCnhNome: '',
  endereco: { ...emptyEndereco },
  profissao: '',
  limitacoesAdministracao: '',
});

export function NomeacaoAdminForm({ administradores, onChange }: NomeacaoAdminFormProps) {
  const handleAdd = () => {
    onChange([...administradores, createEmptyAdmin()]);
  };

  const handleRemove = (id: string) => {
    onChange(administradores.filter(a => a.id !== id));
  };

  const handleUpdate = (id: string, field: keyof NovoAdministrador, value: any) => {
    onChange(administradores.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleEnderecoChange = (id: string, endereco: Endereco) => {
    onChange(administradores.map(a => a.id === id ? { ...a, endereco } : a));
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
      {administradores.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <UserCog className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Clique no botão abaixo para adicionar um novo administrador</p>
        </div>
      )}

      {administradores.map((admin, index) => (
        <Card key={admin.id} className="border-l-4 border-l-primary">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-primary">Novo Administrador {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(admin.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Label className="text-sm mb-3 block">Tipo de nomeação:</Label>
              <RadioGroup
                value={admin.tipo}
                onValueChange={(value: 'socio_existente' | 'novo_administrador') => 
                  handleUpdate(admin.id, 'tipo', value)
                }
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="socio_existente" id={`tipo-socio-${admin.id}`} />
                  <Label htmlFor={`tipo-socio-${admin.id}`} className="font-normal cursor-pointer">
                    Transformar sócio existente em Sócio Administrador
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="novo_administrador" id={`tipo-novo-${admin.id}`} />
                  <Label htmlFor={`tipo-novo-${admin.id}`} className="font-normal cursor-pointer">
                    Novo administrador (não é sócio)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {admin.tipo === 'socio_existente' && (
              <div>
                <Label className="text-sm">Nome do sócio que vai virar Sócio Administrador</Label>
                <Input
                  placeholder="Nome completo do sócio"
                  value={admin.nomeSocioExistente}
                  onChange={(e) => handleUpdate(admin.id, 'nomeSocioExistente', e.target.value)}
                />
              </div>
            )}

            {admin.tipo === 'novo_administrador' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-sm">Nome Completo</Label>
                    <Input
                      placeholder="Nome completo do administrador"
                      value={admin.nomeCompleto}
                      onChange={(e) => handleUpdate(admin.id, 'nomeCompleto', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">CPF</Label>
                    <Input
                      placeholder="000.000.000-00"
                      value={admin.cpf}
                      onChange={(e) => handleUpdate(admin.id, 'cpf', formatCPF(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">RG/CNH</Label>
                    <Input
                      placeholder="Número do documento"
                      value={admin.rgCnh}
                      onChange={(e) => handleUpdate(admin.id, 'rgCnh', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FileUpload
                      id={`anexo-rg-admin-${admin.id}`}
                      label="Anexo RG/CNH"
                      file={admin.anexoRgCnh}
                      fileName={admin.anexoRgCnhNome}
                      onFileChange={(file, name) => {
                        onChange(administradores.map(a => 
                          a.id === admin.id 
                            ? { ...a, anexoRgCnh: file, anexoRgCnhNome: name } 
                            : a
                        ));
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-sm font-medium mb-2 block">Endereço</Label>
                  <EnderecoForm
                    endereco={admin.endereco}
                    onChange={(endereco) => handleEnderecoChange(admin.id, endereco)}
                    prefix={`admin-${admin.id}`}
                  />
                </div>

                <div>
                  <Label className="text-sm">Profissão</Label>
                  <Input
                    placeholder="Profissão do administrador"
                    value={admin.profissao}
                    onChange={(e) => handleUpdate(admin.id, 'profissao', e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-sm">Limitações da Administração (opcional)</Label>
              <Textarea
                placeholder="Informe se há alguma limitação nos poderes de administração..."
                value={admin.limitacoesAdministracao}
                onChange={(e) => handleUpdate(admin.id, 'limitacoesAdministracao', e.target.value)}
                className="min-h-[80px]"
              />
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
        Adicionar Novo Administrador
      </Button>
    </div>
  );
}
