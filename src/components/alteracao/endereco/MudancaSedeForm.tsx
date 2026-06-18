import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnderecoForm } from '../forms/EnderecoForm';
import { FileUpload } from '../forms/FileUpload';
import type { MudancaSedeData, Endereco } from '@/types/alteracao';

interface MudancaSedeFormProps {
  data: MudancaSedeData;
  onChange: (data: MudancaSedeData) => void;
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

export function MudancaSedeForm({ data, onChange }: MudancaSedeFormProps) {
  const handleEnderecoChange = (endereco: Endereco) => {
    onChange({ ...data, endereco });
  };

  return (
    <div className="space-y-4">
      <EnderecoForm
        endereco={data.endereco || emptyEndereco}
        onChange={handleEnderecoChange}
        prefix="sede"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Número do IPTU</Label>
          <Input
            placeholder="Número de inscrição do IPTU"
            value={data.numeroIPTU}
            onChange={(e) => onChange({ ...data, numeroIPTU: e.target.value })}
          />
        </div>
        
        <FileUpload
          id="anexo-iptu-sede"
          label="Anexo IPTU"
          file={data.anexoIPTU}
          fileName={data.anexoIPTUNome}
          onFileChange={(file, name) => onChange({ ...data, anexoIPTU: file, anexoIPTUNome: name })}
        />
      </div>
    </div>
  );
}
