import logoOuttax from '@/assets/logo-outtax.png';

export function Header() {
  return (
    <header className="bg-primary py-6 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <img 
          src={logoOuttax} 
          alt="Outtax Contabilidade" 
          className="h-8 md:h-10"
        />
        <h1 className="text-primary-foreground text-lg md:text-xl font-medium">
          Alteração Contratual
        </h1>
      </div>
    </header>
  );
}
