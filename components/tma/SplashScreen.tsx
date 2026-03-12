'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const PHOTOS = [
  { src: '/splash/splash-1.png', animation: 'kenBurns1' }, // ночная
  { src: '/splash/splash-2.png', animation: 'kenBurns2' }, // аэросъёмка
  { src: '/splash/splash-3.png', animation: 'kenBurns3' }, // дневная с газоном
];

const SLIDE_DURATION = 1100;
const TOTAL_DURATION = 3000;
const FADE_OUT_DURATION = 600;

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  // Используем ref чтобы смена onComplete не перезапускала таймеры
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PHOTOS.length);
    }, SLIDE_DURATION);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, TOTAL_DURATION);

    const doneTimer = setTimeout(() => {
      onCompleteRef.current();
    }, TOTAL_DURATION + FADE_OUT_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []); // без зависимостей — таймеры стартуют один раз

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        overflow: 'hidden',
        opacity: fadeOut ? 0 : 1,
        transition: `opacity ${FADE_OUT_DURATION}ms ease-in-out`,
      }}
    >
      {/* Слои фотографий */}
      {PHOTOS.map(({ src, animation }, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: activeIndex === i ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-10%',
              // Анимация стартует с начала только когда фото становится активным
              animation: `${animation} ${TOTAL_DURATION}ms ease-out forwards`,
              animationPlayState: activeIndex === i ? 'running' : 'paused',
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        </div>
      ))}

      {/* Тёмный градиент поверх фото */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Логотип по центру */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'logoAppear 0.8s ease-out 0.3s both',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo-dg.svg`}
          alt="Domgazobeton"
          style={{
            width: 160,
            filter: 'brightness(0) invert(1) drop-shadow(0 2px 20px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Индикаторы (точки) */}
      <div
        style={{
          position: 'absolute',
          bottom: 48,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          animation: 'logoAppear 0.6s ease-out 0.5s both',
        }}
      >
        {PHOTOS.map((_, i) => (
          <div
            key={i}
            style={{
              width: activeIndex === i ? 24 : 6,
              height: 6,
              borderRadius: 3,
              background: activeIndex === i ? '#ffffff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
