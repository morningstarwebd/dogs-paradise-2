'use client';

export default function FloatingBackground() {
  const elements = Array.from({ length: 12 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {elements.map((_, i) => {
        // Deterministic pseudo-random values based on index to prevent SSR hydration errors
        const size = ((i * 17) % 80) + 40;
        const left = (i * 23) % 100;
        const delay = (i * 7) % 10;
        const duration = ((i * 13) % 15) + 18;

        return (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-${size}px`,
              opacity: 0.35,
              background: `radial-gradient(circle at 30% 30%, ${
                ['rgba(217,119,6,0.18)', 'rgba(225,29,72,0.12)', 'rgba(15,118,110,0.12)'][i % 3]
              }, transparent)`,
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(-110vh) scale(1.3) rotate(360deg);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
