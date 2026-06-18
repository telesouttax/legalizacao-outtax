import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Endereco } from '@/types/alteracao';

interface EnderecoFormProps {
  endereco: Endereco;
  onChange: (endereco: Endereco) => void;
  prefix?: string;
}

export function EnderecoForm({ endereco, onChange, prefix = '' }: EnderecoFormProps) {
  const handleChange = (field: keyof Endereco, value: string) => {
    onChange({ ...endereco, [field]: value });
  };

  const id = (field: string) => prefix ? `${prefix}-${field}` : field;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <Label htmlFor={id('rua')} className="text-sm">Rua/Logradouro</Label>
        <Input
          id={id('rua')}
          placeholder="Nome da rua"
          value={endereco.rua}
          onChange={(e) => handleChange('rua', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={id('numero')} className="text-sm">Número</Label>
        <Input
          id={id('numero')}
          placeholder="Nº"
          value={endereco.numero}
          onChange={(e) => handleChange('numero', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={id('complemento')} className="text-sm">Complemento</Label>
        <Input
          id={id('complemento')}
          placeholder="Apto, Sala, etc."
          value={endereco.complemento}
          onChange={(e) => handleChange('complemento', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={id('bairro')} className="text-sm">Bairro</Label>
        <Input
          id={id('bairro')}
          placeholder="Bairro"
          value={endereco.bairro}
          onChange={(e) => handleChange('bairro', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={id('cidade')} className="text-sm">Cidade</Label>
        <Input
          id={id('cidade')}
          placeholder="Cidade"
          value={endereco.cidade}
          onChange={(e) => handleChange('cidade', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor={id('estado')} className="text-sm">Estado</Label>
        <Input
          id={id('estado')}
          placeholder="UF"
          maxLength={2}
          value={endereco.estado}
          onChange={(e) => handleChange('estado', e.target.value.toUpperCase())}
        />
      </div>
      
      <div>
        <Label htmlFor={id('cep')} className="text-sm">CEP</Label>
        <Input
          id={id('cep')}
          placeholder="00000-000"
          value={endereco.cep}
          onChange={(e) => handleChange('cep', e.target.value)}
        />
      </div>
    </div>
  );
}
