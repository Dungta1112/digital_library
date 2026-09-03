'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { AIChatStorage } from '@/lib/ai-chat-storage';
import { AIConversation } from '@/types/ai';
import {
  Plus,
  MagnifyingGlass,
  ChatCircleText,
  PencilSimple,
  Trash,
  Check,
  X,
  SignOut,
  Moon,
  Sun,
  HardDrive,
  Books,
} from '@phosphor-icons/react';

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AIConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
}

export function AIChatSidebar({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onClearAll,
}: AIChatSidebarProps) {
  const { user, logout } = useAuth();
  const userId = user?.id || 'guest_user';
  const { theme, setTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isLongTerm, setIsLongTerm] = useState(() => AIChatStorage.isLongTermEnabled(userId));

  const handleToggleLongTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsLongTerm(checked);
    AIChatStorage.setLongTermEnabled(userId, checked);
    AIChatStorage.saveConversations(userId, conversations);
  };

  const startRename = (conv: AIConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (convId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(convId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(convId);
  };

  const executeDelete = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(convId);
    setDeletingId(null);
  };

  // Filtered and grouped conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.contextDocTitle && c.contextDocTitle.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container (260px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl transition-transform duration-300 lg:static lg:z-10 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Top: New Chat & Search */}
        <div className="p-3.5 space-y-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition-all"
          >
            <Plus weight="bold" className="h-4 w-4" />
            <span>Hội thoại mới</span>
          </button>

          <div className="relative">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm lịch sử..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              {searchQuery ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có hội thoại nào'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = editingId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ChatCircleText
                      weight={isActive ? 'duotone' : 'regular'}
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    />

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(conv.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-md border border-emerald-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => saveRename(conv.id, e)}
                          title="Lưu tên"
                          className="p-1 text-emerald-600 hover:text-emerald-500"
                        >
                          <Check weight="bold" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          title="Hủy"
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <X weight="bold" className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => startRename(conv, e)}
                          title="Đổi tên"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <PencilSimple weight="bold" className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => confirmDelete(conv.id, e)}
                          title="Xóa hội thoại"
                          className="rounded p-1 text-slate-400 hover:bg-red-100 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash weight="bold" className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Sidebar: Settings, User & Navigation */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          {/* Long-term storage toggle and Clear All */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isLongTerm}
                onChange={handleToggleLongTerm}
                className="rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-0"
              />
              <HardDrive weight="bold" className="h-3.5 w-3.5" />
              <span>Lưu lâu dài</span>
            </label>

            {conversations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Theme Switcher & Links */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun weight="bold" className="h-3.5 w-3.5 text-amber-400" />
                  <span>Sáng</span>
                </>
              ) : (
                <>
                  <Moon weight="bold" className="h-3.5 w-3.5 text-slate-600" />
                  <span>Tối</span>
                </>
              )}
            </button>

            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Books weight="bold" className="h-3.5 w-3.5" />
              <span>Kho tài liệu</span>
            </Link>
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.fullName || 'Người dùng'}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {user?.role || 'STUDENT'}
              </span>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Đăng xuất"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <SignOut weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Delete Single Conversation Modal */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100">
              <h4 className="text-sm font-bold text-white mb-2">Xác nhận xóa hội thoại</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Bạn có chắc chắn muốn xóa hội thoại này không? Thao tác này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={(e) => executeDelete(deletingId, e)}
                  className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500 shadow"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clear All Modal */}
        {showClearAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100">
              <h4 className="text-sm font-bold text-white mb-2">Xóa toàn bộ lịch sử</h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Tất cả hội thoại đã lưu sẽ bị xóa vĩnh viễn khỏi thiết bị này.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearAllModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setShowClearAllModal(false);
                  }}
                  className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500 shadow"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
