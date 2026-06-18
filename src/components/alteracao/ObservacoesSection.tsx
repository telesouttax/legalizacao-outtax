import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface ObservacoesSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObservacoesSection({ value, onChange }: ObservacoesSectionProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Observações Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea
          placeholder="Adicione aqui qualquer informação adicional relevante para a alteração contratual..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px]"
        />
      </CardContent>
    </Card>
  );
}
