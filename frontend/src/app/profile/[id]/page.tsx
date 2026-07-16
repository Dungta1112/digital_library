'use client';
import React, { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { ProfileView } from '@/components/feature/Profile/ProfileView';
import { ProfileService, PublicProfile } from '@/services/profile.service';

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ProfileService.getPublicProfile(id).then((data) => {
      if (!mounted) return;
      if (!data) notFound();
      setProfile(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading || !profile) {
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
    />
  );
}
