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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PHOTOS.length);
    }, SLIDE_DURATION);

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_DURATION);
    const doneTimer = setTimeout(() => onCompleteRef.current(), TOTAL_DURATION + FADE_OUT_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

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
      {/* Фотографии */}
      {PHOTOS.map(({ src, animation }, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: activeIndex === i ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-10%',
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

      {/* Градиент сверху */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 35%)',
        }}
      />

      {/* Градиент снизу */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
        }}
      />

      {/* Логотип — верх по центру */}
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          animation: 'logoAppear 0.9s ease-out 0.2s both',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.95)',
            textTransform: 'uppercase',
          }}
        >
          DOMGAZOBETON
        </span>
      </div>

      {/* Текст снизу */}
      <div
        style={{
          position: 'absolute',
          bottom: 72,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          animation: 'logoAppear 0.9s ease-out 0.5s both',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
            fontSize: 22,
            fontWeight: 600,
            color: '#ffffff',
            letterSpacing: '0.01em',
          }}
        >
          Строим ваш дом
        </span>
        <span
          style={{
            fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
            fontSize: 13,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.03em',
          }}
        >
          Личный кабинет клиента
        </span>
      </div>

      {/* Индикаторы */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          animation: 'logoAppear 0.6s ease-out 0.6s both',
        }}
      >
        {PHOTOS.map((_, i) => (
          <div
            key={i}
            style={{
              width: activeIndex === i ? 20 : 5,
              height: 2,
              borderRadius: 1,
              background: activeIndex === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
