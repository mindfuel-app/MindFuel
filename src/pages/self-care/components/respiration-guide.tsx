import React, { useState, useEffect } from 'react';
import BreathingControls from './breathing-controls';
import BreathingGuide from './breathing-circle';

interface RespirationGuideProps {
  size?: number;
  strokeWidth?: number;
  theme?: 'teal' | 'orange-red';
  backgroundColor?: string;
  className?: string;
  InhaleDuration?: number;
  holdDuration?: number;
  ExhaleDuration?: number;
  enableVibration?: boolean;
}

const RespirationGuide: React.FC<RespirationGuideProps> = ({
  size = 200,
  strokeWidth = 15,
  theme = 'teal',
  backgroundColor = '#E5E7EB',
  className = '',
  InhaleDuration: initialInhale = 5,
  holdDuration: initialHold = 2,
  ExhaleDuration: initialExhale = 5,
}) => {
  const [InhaleDuration, setInhaleDuration] = useState(initialInhale);
  const [holdDuration, setHoldDuration] = useState(initialHold);
  const [ExhaleDuration, setExhaleDuration] = useState(initialExhale);
  const [enableVibration, setEnableVibration] = useState(true);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const [timeLeft, setTimeLeft] = useState(InhaleDuration);
  const [phase, setPhase] = useState<'Inhala' | 'Mantene' | 'Exhala'>('Inhala');
  const [progress, setProgress] = useState(0);

  const totalDuration = InhaleDuration + holdDuration + ExhaleDuration;

  // Vibration patterns for different phases
  const vibrationPatterns = {
    Inhala: [100, 50, 100], // Short pulses during inhale
    Mantene: [200], // Single longer pulse for hold
    Exhala: [150, 100, 150] // Medium pulses during exhale
  };

  // Function to trigger vibration
  const triggerVibration = (pattern: number[]) => {
    if (enableVibration && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };
  useEffect(() => {
    setTimeLeft(InhaleDuration);
    setPhase('Inhala');
    setProgress(0);

    const startTime = Date.now();
    let currentPhase: 'Inhala' | 'Mantene' | 'Exhala' = 'Inhala';

    // Initial vibration for starting phase
    triggerVibration(vibrationPatterns['Inhala']);

    const interval = setInterval(() => {
      const now = Date.now();
      const totalElapsed = (now - startTime) / 1000;
      const cycleTime = totalElapsed % totalDuration;

      let newPhase: 'Inhala' | 'Mantene' | 'Exhala';
      let phaseProgress: number;
      let timeRemaining: number;

      if (cycleTime < InhaleDuration) {
        newPhase = 'Inhala';
        phaseProgress = cycleTime / InhaleDuration;
        timeRemaining = Math.ceil(InhaleDuration - cycleTime);
      } else if (cycleTime < InhaleDuration + holdDuration) {
        newPhase = 'Mantene';
        phaseProgress = 1;
        timeRemaining = Math.ceil(InhaleDuration + holdDuration - cycleTime);
      } else {
        newPhase = 'Exhala';
        const ExhaleProgress = (cycleTime - InhaleDuration - holdDuration) / ExhaleDuration;
        phaseProgress = 1 - ExhaleProgress;
        timeRemaining = Math.ceil(totalDuration - cycleTime);
      }

      if (newPhase !== currentPhase) {
        currentPhase = newPhase;
        // Trigger vibration when phase changes
        triggerVibration(vibrationPatterns[newPhase]);
      }

      setPhase(newPhase);
      setProgress(phaseProgress);
      setTimeLeft(timeRemaining);
    }, 50); // Update more frequently for smoother animation

    return () => clearInterval(interval);
  }, [InhaleDuration, holdDuration, ExhaleDuration, totalDuration]);

  // Calculate stroke-dashoffset based on progress
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className='flex flex-col items-center gap-4 mb-6'>

      <BreathingGuide
        size={size}
        strokeWidth={strokeWidth}
        radius={radius}
        circumference={circumference}
        strokeDashoffset={strokeDashoffset}
        backgroundColor={backgroundColor}
        timeLeft={timeLeft}
        phase={phase}
        className={className}
        theme={theme}
      />
      <BreathingControls
        inhale={InhaleDuration}
        hold={holdDuration}
        exhale={ExhaleDuration}
        setInhale={setInhaleDuration}
        setHold={setHoldDuration}
        setExhale={setExhaleDuration}
        enableVibration={enableVibration}
        setEnableVibration={setEnableVibration}
      />
      </div>
      <div>
        <p className='text-xl font-semibold'>
          Segui el ritmo del circulo
        </p>
        {enableVibration && (
          <p className='text-sm'>
            Podes cerrar los ojos y dejar que la vibracion te guie
          </p>
        )}
        <p className='text-sm mt-4 text-gray-600 w-6/7 text-justify justify-center mx-auto '>
          Inhalá lentamente mientras el círculo se llena,
          mantené el aire cuando se detiene y exhalá despacio
          mientras se vacía. Repetí este ciclo varias veces para
          relajar tu mente y tu cuerpo.
        </p>
      </div>

    </div>
  );
};

export default RespirationGuide;