'use client';

export default function FloatingBackground() {
  const elements = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#fdfaf5]">
      {elements.map((_, i) => {
        // Deterministic pseudo-random values based on index to prevent SSR hydration errors
        const size = ((i * 17) % 80) + 40; // 40px to 120px
        const left = (i * 23) % 100; // 0% to 100% width
        const delay = (i * 7) % 10; // 0s to 10s delay
        const duration = ((i * 13) % 15) + 15; // 15s to 30s float time
        
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-60 mix-blend-multiply"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-${size}px`,
              background: `radial-gradient(circle at 30% 30%, ${
                ['rgba(217,119,6,0.15)', 'rgba(225,29,72,0.1)', 'rgba(15,118,110,0.1)'][i % 3]
              }, transparent)`,
              boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.02), inset 5px 5px 15px rgba(255,255,255,0.5)', // 3D bevel effect
              animation: `floatUp ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* Global CSS for the animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) scale(1.5) rotate(360deg);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
