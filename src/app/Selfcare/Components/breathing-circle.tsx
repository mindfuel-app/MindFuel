import React from 'react';

interface BreathingCircleProps {
  size: number;
  strokeWidth: number;
  radius: number;
  circumference: number;
  strokeDashoffset: number;
  backgroundColor: string;
  className?: string;
  timeLeft: number;
  phase: 'Inhala' | 'Mantene' | 'Exhala' | 'Pausa';
  theme?: 'teal' | 'orange-red';
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({
  size,
  strokeWidth,
  radius,
  circumference,
  strokeDashoffset,
  backgroundColor,
  className = '',
  timeLeft,
  phase,
  theme = 'teal',
}) => {
  return (
    <div className={`inline-block relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={`gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {theme === 'teal' ? (
              <>
                <stop offset="0%" stopColor="#a5dbc0ff" />
                <stop offset="99%" stopColor="#008080" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#ffccb5ff" />
                <stop offset="99%" stopColor="#ff4500" />
              </>
            )}
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${size})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: phase === 'Mantene' || phase === 'Pausa' ? 'none' : 'stroke-dashoffset 50ms linear'
          }}
        />
      </svg>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ fontSize: size * 0.08 }}
      >
        <div className="font-bold text-slate-700" style={{ fontSize: size * 0.12 }}>
          {timeLeft}
        </div>
        <div className="text-slate-500 font-medium" style={{ fontSize: size * 0.06 }}>
          {phase === 'Pausa' ? 'Pausa' : phase}
        </div>
      </div>
    </div>
  );
};

export default BreathingCircle;
