import { useEffect, useRef } from 'react';
import { createEngine, type Engine, type EngineOptions } from './engine';
import './LiquidEther.css';

export interface LiquidEtherProps {
  colors?: string[];
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  resolution?: number;
  isBounce?: boolean;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  fluidBg?: string;
}

export default function LiquidEther({
  colors = ['#5227FF', '#FF9FFC', '#B19EEF'],
  mouseForce = 20, cursorSize = 100,
  isViscous = false, viscous = 30,
  iterationsViscous = 32, iterationsPoisson = 32,
  resolution = 0.5, isBounce = false,
  autoDemo = true, autoSpeed = 0.5, autoIntensity = 2.2,
  takeoverDuration = 0.25, autoResumeDelay = 0, autoRampDuration = 0.6,
  fluidBg = 'transparent',
}: LiquidEtherProps) {
  const ref = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const opts: EngineOptions = {
      mouseForce, cursorSize, isViscous, viscous,
      iterationsViscous, iterationsPoisson,
      dt: 0.014, BFECC: true, resolution, isBounce,
      autoDemo, autoSpeed, autoIntensity,
      takeoverDuration, autoResumeDelay, autoRampDuration,
    };
    const engine = createEngine(ref.current, opts, colors, fluidBg);
    engineRef.current = engine;
    engine.start();
    return () => { engine.dispose(); engineRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.updateOptions({
      mouseForce, cursorSize, isViscous, viscous,
      iterationsViscous, iterationsPoisson, resolution, isBounce,
      autoDemo, autoSpeed, autoIntensity,
      takeoverDuration, autoResumeDelay, autoRampDuration,
    });
  }, [mouseForce, cursorSize, isViscous, viscous, iterationsViscous, iterationsPoisson,
      resolution, isBounce, autoDemo, autoSpeed, autoIntensity,
      takeoverDuration, autoResumeDelay, autoRampDuration]);

  useEffect(() => {
    engineRef.current?.updateFluidBg(fluidBg);
  }, [fluidBg]);

  useEffect(() => {
    engineRef.current?.updatePalette(colors);
  }, [colors]);

  return <div ref={ref} className="liquid-ether-container" />;
}
