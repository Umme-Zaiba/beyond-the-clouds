import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { sfx } from '../../lib/audio';

type Variant = 'primary' | 'ghost';

interface Common {
  variant?: Variant;
  glyph?: string;
  children: ReactNode;
}

/** The crack that runs through a seal when it is pressed. */
function Crack({ active }: { active: boolean }) {
  return (
    <svg className={`seal__crack${active ? ' is-active' : ''}`} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M52 0 L46 12 L56 18 L44 30 L50 40" pathLength={1} />
    </svg>
  );
}

function useCrack(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  return [
    on,
    () => {
      sfx.seal();
      setOn(false);
      requestAnimationFrame(() => setOn(true));
      window.setTimeout(() => setOn(false), 700);
    },
  ];
}

function Inner({ glyph, children, cracked }: { glyph?: string; children: ReactNode; cracked: boolean }) {
  return (
    <>
      {glyph && (
        <span className="seal__glyph" aria-hidden="true">
          {glyph}
        </span>
      )}
      <span className="seal__label">{children}</span>
      <Crack active={cracked} />
    </>
  );
}

/** Primary call to action, styled as a jade seal that cracks open when pressed. */
export function SealButton({
  variant = 'primary',
  glyph,
  children,
  onClick,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [cracked, crack] = useCrack();
  return (
    <button
      {...rest}
      className={`seal seal--${variant} ${rest.className ?? ''}`}
      onClick={(e) => {
        crack();
        onClick?.(e);
      }}
    >
      <Inner glyph={glyph} cracked={cracked}>
        {children}
      </Inner>
    </button>
  );
}

export function SealLink({ variant = 'primary', glyph, children, onClick, className = '', ...rest }: Common & LinkProps) {
  const [cracked, crack] = useCrack();
  return (
    <Link
      {...rest}
      className={`seal seal--${variant} ${className}`}
      onClick={(e) => {
        crack();
        onClick?.(e);
      }}
    >
      <Inner glyph={glyph} cracked={cracked}>
        {children}
      </Inner>
    </Link>
  );
}
