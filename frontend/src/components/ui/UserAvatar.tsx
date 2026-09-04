'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  size?: UserAvatarSize;
  className?: string;
  alt?: string;
}

const SIZE_MAP: Record<UserAvatarSize, { container: string; text: string; px: number }> = {
  xs: { container: 'w-6 h-6 rounded-lg', text: 'text-[10px]', px: 24 },
  sm: { container: 'w-8 h-8 rounded-xl', text: 'text-xs', px: 32 },
  md: { container: 'w-10 h-10 rounded-xl', text: 'text-sm', px: 40 },
  lg: { container: 'w-14 h-14 rounded-2xl', text: 'text-xl', px: 56 },
  xl: { container: 'w-20 h-20 rounded-2xl', text: 'text-2xl', px: 80 },
  '2xl': { container: 'w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem]', text: 'text-4xl sm:text-5xl', px: 128 },
};

function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const GRADIENT_PALETTES = [
  'from-emerald-600 to-teal-800 text-white',
  'from-blue-600 to-indigo-800 text-white',
  'from-violet-600 to-purple-800 text-white',
  'from-amber-600 to-orange-800 text-white',
  'from-rose-600 to-pink-800 text-white',
  'from-teal-600 to-emerald-800 text-white',
];

function getPalette(name?: string): string {
  if (!name) return GRADIENT_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
}

export function UserAvatar({
  avatarUrl,
  name = 'Người dùng',
  size = 'md',
  className = '',
  alt,
}: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const sizeConfig = SIZE_MAP[size];
  const initials = getInitials(name);
  const palette = getPalette(name);

  const hasError = Boolean(avatarUrl && failedUrl === avatarUrl);
  const isValidUrl = Boolean(avatarUrl && avatarUrl.trim() && !hasError);

  if (isValidUrl && avatarUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden shadow-xs ring-1 ring-black/5 dark:ring-white/10 ${sizeConfig.container} ${className}`}
      >
        <Image
          src={avatarUrl}
          alt={alt || `Ảnh đại diện của ${name}`}
          width={sizeConfig.px}
          height={sizeConfig.px}
          className="w-full h-full object-cover"
          onError={() => setFailedUrl(avatarUrl || null)}
          unoptimized={avatarUrl.endsWith('.svg') || avatarUrl.startsWith('data:')}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center font-bold tracking-tight bg-gradient-to-br shadow-xs ring-1 ring-black/5 dark:ring-white/10 ${palette} ${sizeConfig.container} ${sizeConfig.text} ${className}`}
      aria-label={alt || `Ảnh đại diện viết tắt của ${name}`}
      role="img"
    >
      <span>{initials}</span>
    </div>
  );
}
