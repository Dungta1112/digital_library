'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProfileService } from '@/services/profile.service';
import type { ProfileTabKey, ReadingHistoryItem, LecturerDocumentItem } from '@/types/profile';

import { ProfileHero } from '@/components/feature/Profile/ProfileHero';
import { ProfileTabs } from '@/components/feature/Profile/ProfileTabs';
import { ProfileOverview } from '@/components/feature/Profile/ProfileOverview';
import { ReadingHistory } from '@/components/feature/Profile/ReadingHistory';
import { MyContributions } from '@/components/feature/Profile/MyContributions';
import { AvatarPickerDialog } from '@/components/feature/Profile/AvatarPickerDialog';
import { CreateForumPostDialog } from '@/components/feature/Forum/CreateForumPostDialog';
import { UploadDocumentDialog } from '@/components/feature/Document/UploadDocumentDialog';

function ProfileContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab State & URL Sync
  const rawTab = searchParams.get('tab') as ProfileTabKey | null;
  const canUpload = user?.role === 'LECTURER' || user?.role === 'ADMIN';

  const validTabs: ProfileTabKey[] = canUpload
    ? ['overview', 'history', 'contributions']
    : ['overview', 'history'];

  const activeTab: ProfileTabKey = rawTab && validTabs.includes(rawTab)
    ? rawTab
    : 'overview';

  const handleTabChange = (tab: ProfileTabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'overview') {
      params.delete('tab');
    } else {
      params.set('tab', tab);
    }
    const query = params.toString();
    router.replace(`/profile${query ? `?${query}` : ''}`, { scroll: false });
  };

  // Dialog State
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isForumComposerOpen, setIsForumComposerOpen] = useState(false);
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false);

  // Data States
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [contributions, setContributions] = useState<LecturerDocumentItem[]>([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [contributionsError, setContributionsError] = useState<string | null>(null);

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Manual refetch handlers
  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const data = await ProfileService.getReadingHistory();
      setHistory(data);
    } catch (err: unknown) {
      setHistoryError(
        err instanceof Error ? err.message : 'Không thể tải lịch sử đọc sách.'
      );
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  const fetchContributions = useCallback(async () => {
    if (!user || !canUpload) return;
    setContributionsLoading(true);
    setContributionsError(null);
    try {
      const data = await ProfileService.getLecturerDocuments();
      setContributions(data);
    } catch (err: unknown) {
      setContributionsError(
        err instanceof Error ? err.message : 'Không thể tải danh sách tài liệu đóng góp.'
      );
    } finally {
      setContributionsLoading(false);
    }
  }, [user, canUpload]);

  // Initial load effect
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    if (user) {
      ProfileService.getReadingHistory(controller.signal)
        .then((data) => {
          if (isMounted) {
            setHistory(data);
            setHistoryLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted && err.name !== 'AbortError') {
            setHistoryError(err.message || 'Không thể tải lịch sử đọc sách.');
            setHistoryLoading(false);
          }
        });

      if (canUpload) {
        ProfileService.getLecturerDocuments(controller.signal)
          .then((data) => {
            if (isMounted) {
              setContributions(data);
              setContributionsLoading(false);
            }
          })
          .catch((err) => {
            if (isMounted && err.name !== 'AbortError') {
              setContributionsError(err.message || 'Không thể tải danh sách tài liệu đóng góp.');
              setContributionsLoading(false);
            }
          });
      }
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [user, canUpload]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pt-6 pb-16 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* 1. Hero Identity & Action Card */}
        <ProfileHero
          user={user}
          onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          onOpenForumComposer={() => setIsForumComposerOpen(true)}
          onOpenDocumentUpload={() => setIsDocumentUploadOpen(true)}
        />

        {/* 2. Profile Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          user={user}
          historyCount={history.length}
          contributionCount={contributions.length}
        />

        {/* 3. Tab Contents */}
        <div>
          {activeTab === 'overview' && (
            <ProfileOverview
              user={user}
              recentHistory={history}
              historyLoading={historyLoading}
              onSelectTab={handleTabChange}
              onOpenForumComposer={() => setIsForumComposerOpen(true)}
              onOpenDocumentUpload={() => setIsDocumentUploadOpen(true)}
            />
          )}

          {activeTab === 'history' && (
            <ReadingHistory
              history={history}
              loading={historyLoading}
              error={historyError}
              onRetry={() => fetchHistory()}
            />
          )}

          {activeTab === 'contributions' && canUpload && (
            <MyContributions
              documents={contributions}
              loading={contributionsLoading}
              error={contributionsError}
              onRetry={() => fetchContributions()}
              onOpenUpload={() => setIsDocumentUploadOpen(true)}
              onRefresh={() => fetchContributions()}
            />
          )}
        </div>

        {/* 4. Shared Modal Dialogs */}
        <AvatarPickerDialog
          isOpen={isAvatarPickerOpen}
          onClose={() => setIsAvatarPickerOpen(false)}
        />

        <CreateForumPostDialog
          isOpen={isForumComposerOpen}
          onClose={() => setIsForumComposerOpen(false)}
        />

        {canUpload && (
          <UploadDocumentDialog
            isOpen={isDocumentUploadOpen}
            onClose={() => setIsDocumentUploadOpen(false)}
            onSuccess={() => fetchContributions()}
          />
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-slate-950">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
