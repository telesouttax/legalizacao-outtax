import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlteracaoItemProps {
  id: string;
  label: string;
  helpText?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  detalhes: string;
  onDetalhesChange: (value: string) => void;
  placeholder?: string;
}

export function AlteracaoItem({
  id,
  label,
  helpText,
  checked,
  onCheckedChange,
  detalhes,
  onDetalhesChange,
  placeholder = 'Descreva os detalhes desta alteração...',
}: AlteracaoItemProps) {
  return (
    <div className="space-y-3 py-3 border-b last:border-b-0">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor={id} 
              className="text-sm font-medium cursor-pointer leading-tight"
            >
              {label}
            </Label>
            {helpText && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{helpText}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      
      {checked && (
        <div className="ml-7">
          <Textarea
            placeholder={placeholder}
            value={detalhes}
            onChange={(e) => onDetalhesChange(e.target.value)}
            className="min-h-[80px] text-sm"
          />
        </div>
      )}
    </div>
  );
}
