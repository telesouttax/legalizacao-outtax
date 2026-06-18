import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search, Users, Building2 } from 'lucide-react';
import { formatCNPJ, validateCNPJ, fetchCNPJData } from '@/lib/cnpj';
import type { DadosEmpresa, CNAEEmpresa, FilialEmpresa, SocioEmpresa } from '@/types/alteracao';

interface CNPJInputProps {
  value: string;
  onChange: (value: string) => void;
  onDataFetched: (data: Partial<DadosEmpresa>) => void;
}

export function CNPJInput({ value, onChange, onDataFetched }: CNPJInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [empresaInfo, setEmpresaInfo] = useState<{
    nome: string;
    socios: SocioEmpresa[];
    capital: string;
    situacao: string;
  } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    onChange(formatted);
    setStatus('idle');
    setErrorMessage('');
    setEmpresaInfo(null);
  }, [onChange]);

  const handleSearch = useCallback(async () => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length !== 14) {
      setStatus('invalid');
      setErrorMessage('CNPJ deve ter 14 dígitos');
      return;
    }

    if (!validateCNPJ(digits)) {
      setStatus('invalid');
      setErrorMessage('CNPJ inválido');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await fetchCNPJData(digits);
      
      if (data) {
        setStatus('valid');

        const cnaes: CNAEEmpresa[] = data.cnaes.map(c => ({
          codigo: c.codigo,
          descricao: c.descricao,
        }));

        const filiais: FilialEmpresa[] = data.filiais.map(f => ({
          cnpj: f.cnpj,
          nome: f.nome,
          nomeFantasia: f.nomeFantasia,
          cidade: f.cidade,
          estado: f.estado,
          selecionada: false,
        }));

        const socios: SocioEmpresa[] = data.qsa.map(s => ({
          nome: s.nome,
          qualificacao: s.qual,
        }));

        onDataFetched({
          cnpj: data.cnpj,
          razaoSocial: data.razao_social,
          nomeFantasia: data.nome_fantasia,
          endereco: data.logradouro,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.municipio,
          uf: data.uf,
          cep: data.cep,
          telefone: data.telefone,
          email: data.email,
          cnaes,
          filiais,
          socios,
          capitalSocial: data.capitalSocial,
          naturezaJuridica: data.naturezaJuridica,
          abertura: data.abertura,
          situacao: data.situacao,
        });

        setEmpresaInfo({
          nome: data.razao_social,
          socios,
          capital: data.capitalSocial,
          situacao: data.situacao,
        });
      } else {
        setStatus('invalid');
        setErrorMessage('CNPJ não encontrado na Receita Federal');
      }
    } catch {
      setStatus('invalid');
      setErrorMessage('Erro ao consultar CNPJ. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [value, onDataFetched]);

  const formatCapital = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="cnpj" className="text-sm font-medium">
        CNPJ da Empresa <span className="text-destructive">*</span>
      </Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="cnpj"
            placeholder="00.000.000/0000-00"
            value={value}
            onChange={handleChange}
            className={`pr-10 ${
              status === 'valid' ? 'border-green-500 focus-visible:ring-green-500' : 
              status === 'invalid' ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
          />
          {status === 'valid' && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {status === 'invalid' && (
            <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
        </div>
        <Button 
          type="button"
          onClick={handleSearch}
          disabled={isLoading || value.replace(/\D/g, '').length !== 14}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Consultar
            </>
          )}
        </Button>
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      {/* Card de resumo após consulta */}
      {empresaInfo && status === 'valid' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-green-700" />
            <span className="text-sm font-semibold text-green-800">{empresaInfo.nome}</span>
            <Badge variant="outline" className="text-xs border-green-400 text-green-700">
              {empresaInfo.situacao}
            </Badge>
          </div>

          <div className="text-xs text-green-700">
            <span className="font-medium">Capital Social:</span> {formatCapital(empresaInfo.capital)}
          </div>

          {empresaInfo.socios.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-medium text-green-700">
                <Users className="h-3 w-3" />
                Quadro Societário Atual:
              </div>
              {empresaInfo.socios.map((s, i) => (
                <div key={i} className="text-xs text-green-600 pl-4">
                  • {s.nome} — <span className="italic">{s.qualificacao}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
