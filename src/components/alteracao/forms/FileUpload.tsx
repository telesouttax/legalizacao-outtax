import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';

interface FileUploadProps {
  id: string;
  label: string;
  file: File | null | undefined;
  fileName: string | undefined;
  onFileChange: (file: File | null, fileName: string) => void;
  accept?: string;
}

export function FileUpload({ 
  id, 
  label, 
  file, 
  fileName, 
  onFileChange,
  accept = ".pdf,.jpg,.jpeg,.png"
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile, selectedFile.name);
    }
  };

  const handleRemove = () => {
    onFileChange(null, '');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {fileName ? (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm flex-1 truncate">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="w-full justify-start text-muted-foreground"
        >
          <Upload className="h-4 w-4 mr-2" />
          Selecionar arquivo
        </Button>
      )}
    </div>
  );
}
