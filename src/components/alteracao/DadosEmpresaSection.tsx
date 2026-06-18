import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import { CNPJInput } from './CNPJInput';
import type { DadosEmpresa } from '@/types/alteracao';

interface DadosEmpresaSectionProps {
  dados: DadosEmpresa;
  onUpdate: (field: keyof DadosEmpresa, value: string) => void;
  onSetDados: (dados: DadosEmpresa) => void;
}

export function DadosEmpresaSection({ dados, onUpdate, onSetDados }: DadosEmpresaSectionProps) {
  const handleCNPJData = (data: Partial<DadosEmpresa>) => {
    onSetDados({ ...dados, ...data });
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Dados da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <CNPJInput
          value={dados.cnpj}
          onChange={(value) => onUpdate('cnpj', value)}
          onDataFetched={handleCNPJData}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="razaoSocial">Razão Social</Label>
            <Input
              id="razaoSocial"
              value={dados.razaoSocial}
              onChange={(e) => onUpdate('razaoSocial', e.target.value)}
              placeholder="Razão Social da Empresa"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
            <Input
              id="nomeFantasia"
              value={dados.nomeFantasia}
              onChange={(e) => onUpdate('nomeFantasia', e.target.value)}
              placeholder="Nome Fantasia"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={dados.endereco}
              onChange={(e) => onUpdate('endereco', e.target.value)}
              placeholder="Rua, Avenida..."
            />
          </div>

          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={dados.numero}
              onChange={(e) => onUpdate('numero', e.target.value)}
              placeholder="Nº"
            />
          </div>

          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={dados.complemento}
              onChange={(e) => onUpdate('complemento', e.target.value)}
              placeholder="Sala, Andar..."
            />
          </div>

          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              value={dados.bairro}
              onChange={(e) => onUpdate('bairro', e.target.value)}
              placeholder="Bairro"
            />
          </div>

          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={dados.cidade}
              onChange={(e) => onUpdate('cidade', e.target.value)}
              placeholder="Cidade"
            />
          </div>

          <div>
            <Label htmlFor="uf">UF</Label>
            <Input
              id="uf"
              value={dados.uf}
              onChange={(e) => onUpdate('uf', e.target.value.toUpperCase())}
              placeholder="UF"
              maxLength={2}
            />
          </div>

          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={dados.cep}
              onChange={(e) => onUpdate('cep', e.target.value)}
              placeholder="00000-000"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={dados.telefone}
              onChange={(e) => onUpdate('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={dados.email}
              onChange={(e) => onUpdate('email', e.target.value)}
              placeholder="email@empresa.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
