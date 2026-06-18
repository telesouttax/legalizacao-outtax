import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, Plus, Trash2, Building2 } from 'lucide-react';
import { EnderecoForm } from '../forms/EnderecoForm';
import { FileUpload } from '../forms/FileUpload';
import type { FilialAbertura, Endereco } from '@/types/alteracao';

interface AberturaFilialFormProps {
  filiais: FilialAbertura[];
  onChange: (filiais: FilialAbertura[]) => void;
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

const createEmptyFilial = (): FilialAbertura => ({
  id: crypto.randomUUID(),
  endereco: { ...emptyEndereco },
  numeroIPTU: '',
  anexoIPTU: null,
  anexoIPTUNome: '',
  atividades: '',
  email: '',
  telefone: '',
});

export function AberturaFilialForm({ filiais, onChange }: AberturaFilialFormProps) {
  const handleAdd = () => {
    onChange([...filiais, createEmptyFilial()]);
  };

  const handleRemove = (id: string) => {
    onChange(filiais.filter(f => f.id !== id));
  };

  const handleUpdate = (id: string, field: keyof FilialAbertura, value: any) => {
    onChange(filiais.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleEnderecoChange = (id: string, endereco: Endereco) => {
    onChange(filiais.map(f => f.id === id ? { ...f, endereco } : f));
  };

  return (
    <div className="space-y-4">
      {filiais.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Clique no botão abaixo para adicionar uma nova filial</p>
        </div>
      )}

      {filiais.map((filial, index) => (
        <Card key={filial.id} className="border-l-4 border-l-primary">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-primary">Nova Filial {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(filial.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <EnderecoForm
              endereco={filial.endereco}
              onChange={(endereco) => handleEnderecoChange(filial.id, endereco)}
              prefix={`filial-${filial.id}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Número do IPTU</Label>
                <Input
                  placeholder="Número de inscrição do IPTU"
                  value={filial.numeroIPTU}
                  onChange={(e) => handleUpdate(filial.id, 'numeroIPTU', e.target.value)}
                />
              </div>

              <FileUpload
                id={`anexo-iptu-filial-${filial.id}`}
                label="Anexo IPTU"
                file={filial.anexoIPTU}
                fileName={filial.anexoIPTUNome}
                onFileChange={(file, name) => {
                  onChange(filiais.map(f => 
                    f.id === filial.id 
                      ? { ...f, anexoIPTU: file, anexoIPTUNome: name } 
                      : f
                  ));
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-sm">Atividades da Filial</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p className="text-sm">
                      Preencha apenas as atividades que deseja, sem precisar informar o CNAE que nós da Outtax iremos buscar para você. Agora, caso já saiba o código CNAE, só preencher que nos ajuda também!
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                placeholder="Descreva as atividades que serão exercidas nesta filial..."
                value={filial.atividades}
                onChange={(e) => handleUpdate(filial.id, 'atividades', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">E-mail de contato</Label>
                <Input
                  type="email"
                  placeholder="email@empresa.com"
                  value={filial.email}
                  onChange={(e) => handleUpdate(filial.id, 'email', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Telefone de contato</Label>
                <Input
                  placeholder="(00) 00000-0000"
                  value={filial.telefone}
                  onChange={(e) => handleUpdate(filial.id, 'telefone', e.target.value)}
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
        Adicionar Nova Filial
      </Button>
    </div>
  );
}
