
export function LogoAnimation() {
  const logoText = 'Tauros';

  return (
    <div className="flex items-center">
      <h1 className="text-xl font-bold">
        <span className="text-primary">
          {logoText}
          <span className="sr-only">Tauros</span>
        </span>
      </h1>
    </div>
  );
}
