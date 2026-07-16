'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileView } from '@/components/feature/Profile/ProfileView';
import { useAuth } from '@/hooks/useAuth';
import {
  ProfileService,
  PublicProfile,
  UpdateProfileInput,
} from '@/services/profile.service';

export default function ProfilePage() {
  const { user, isLoading, token, login } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (!user) return;

    let mounted = true;
    ProfileService.getMyProfile().then((data) => {
      if (!mounted) return;
      setProfile(
        data || {
          user,
          documents: [],
          forumPosts: [],
        }
      );
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [user, isLoading, router]);

  const handleSave = async (input: UpdateProfileInput) => {
    const updatedUser = await ProfileService.updateMe(input);
    setProfile((current) =>
      current
        ? {
            ...current,
            user: updatedUser,
          }
        : current
    );
    if (token) {
      login(updatedUser, token, localStorage.getItem('refresh_token') || undefined);
    }
  };

  if (isLoading || loading || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <ProfileView
      user={profile.user}
      documents={profile.documents}
      forumPosts={profile.forumPosts}
      isOwner
      onSave={handleSave}
    />
  );
}
