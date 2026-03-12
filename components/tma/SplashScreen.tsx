'use client';

import { useEffect, useRef, useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const PHOTOS = [
  { src: `${BASE}/splash/splash-1.jpg`, animation: 'kenBurns1', position: 'center 50%' },
  { src: `${BASE}/splash/splash-2.jpg`, animation: 'kenBurns2', position: 'center 40%' },
  { src: `${BASE}/splash/splash-3.jpg`, animation: 'kenBurns3', position: 'center 30%' },
  { src: `${BASE}/splash/splash-4.jpg`, animation: 'kenBurns4', position: 'center 40%' },
];

const SLIDE_DURATION = 2500;
const TOTAL_DURATION = 11000;
const FADE_OUT_DURATION = 600;

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [ready, setReady] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Preload first image, then preload rest
    const first = new window.Image();
    first.onload = () => setReady(true);
    first.onerror = () => setReady(true); // show anyway on error
    first.src = PHOTOS[0].src;

    PHOTOS.slice(1).forEach(({ src }) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;

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
  }, [ready]);

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
      {PHOTOS.map(({ src, animation, position }, i) => (
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
              width: '120%',
              height: '120%',
              animation: `${animation} ${TOTAL_DURATION}ms ease-out forwards`,
              animationPlayState: activeIndex === i ? 'running' : 'paused',
            }}
          >
            <img
              src={src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: position,
                display: 'block',
              }}
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
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(20,20,20,0.92)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
              fontSize: 7,
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#ffffff',
              textTransform: 'uppercase',
              textAlign: 'center',
              padding: '0 8px',
            }}
          >
            DOMGAZOBETON
          </span>
        </div>
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
          Наблюдай путь от мечты к дому
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
