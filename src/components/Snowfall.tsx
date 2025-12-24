import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      size: 4 + Math.random() * 8,
      opacity: 0.4 + Math.random() * 0.6,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snowfall">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-snow"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear ${flake.animationDelay}s infinite`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
