import { AlertTriangle } from 'lucide-react';

export function TestBanner() {
  return (
    <div className="bg-accent text-accent-foreground py-3 px-4 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-md">
      <AlertTriangle className="h-4 w-4" />
      <span>AMBIENTE DE TESTE - Os dados enviados não serão processados</span>
      <AlertTriangle className="h-4 w-4" />
    </div>
  );
}
