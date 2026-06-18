import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import type { AlteracaoObjetoSocialData, CNAEEmpresa } from '@/types/alteracao';

interface AlteracaoObjetoSocialFormProps {
  data: AlteracaoObjetoSocialData;
  cnaesEmpresa: CNAEEmpresa[];
  onChange: (data: AlteracaoObjetoSocialData) => void;
}

export function AlteracaoObjetoSocialForm({ data, cnaesEmpresa, onChange }: AlteracaoObjetoSocialFormProps) {
  const handleChange = <K extends keyof AlteracaoObjetoSocialData>(
    field: K, 
    value: AlteracaoObjetoSocialData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const handleCnaeToggle = (codigo: string, checked: boolean) => {
    const current = data.cnaesSelecionadosRemover || [];
    if (checked) {
      handleChange('cnaesSelecionadosRemover', [...current, codigo]);
    } else {
      handleChange('cnaesSelecionadosRemover', current.filter(c => c !== codigo));
    }
  };

  const showAdicionar = data.tipo === 'adicionar' || data.tipo === 'adicionar_remover';
  const showRemover = data.tipo === 'remover' || data.tipo === 'adicionar_remover';

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm">O que deseja fazer?</Label>
        <Select
          value={data.tipo}
          onValueChange={(value: 'adicionar' | 'remover' | 'adicionar_remover') => handleChange('tipo', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="adicionar">Adicionar atividades</SelectItem>
            <SelectItem value="remover">Remover atividades</SelectItem>
            <SelectItem value="adicionar_remover">Adicionar e Remover atividades</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showAdicionar && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Atividades a Adicionar</Label>
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
              placeholder="Descreva as novas atividades que deseja adicionar..."
              value={data.atividadesAdicionar}
              onChange={(e) => handleChange('atividadesAdicionar', e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      )}

      {showRemover && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-4 space-y-2">
            <Label className="text-sm font-medium">Atividades a Remover</Label>
            
            {cnaesEmpresa.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Selecione as atividades que deseja remover:
                </p>
                {cnaesEmpresa.map((cnae) => (
                  <div key={cnae.codigo} className="flex items-start gap-2 p-2 bg-white rounded border">
                    <Checkbox
                      id={`cnae-${cnae.codigo}`}
                      checked={data.cnaesSelecionadosRemover?.includes(cnae.codigo)}
                      onCheckedChange={(checked) => handleCnaeToggle(cnae.codigo, checked as boolean)}
                    />
                    <label 
                      htmlFor={`cnae-${cnae.codigo}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <span className="font-medium">{cnae.codigo}</span> - {cnae.descricao}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhum CNAE encontrado. Os CNAEs serão carregados após consultar o CNPJ da empresa.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
