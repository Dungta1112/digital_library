'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AIChatHeader } from './AIChatHeader';
import { AIChatSidebar } from './AIChatSidebar';
import { AIEmptyState } from './AIEmptyState';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { CitationPanel } from './CitationPanel';
import { ArrowDown } from '@phosphor-icons/react';
import { useAIChat } from '@/hooks/useAIChat';

interface AIChatShellProps {
  initialDocId?: string | null;
  contextDocTitle?: string | null;
  onClearContextDoc?: () => void;
}

export function AIChatShell({
  initialDocId,
  contextDocTitle,
  onClearContextDoc,
}: AIChatShellProps) {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    loading,
    isSidebarOpen,
    setIsSidebarOpen,
    citationPanelState,
    openCitationPanel,
    closeCitationPanel,
    createNewConversation,
    selectConversation,
    renameConversation,
    deleteConversation,
    clearAllConversations,
    sendMessage,
    stopWaiting,
    retryMessage,
  } = useAIChat(initialDocId);

  const transcriptRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState('');
  const isNearBottomRef = useRef(true);

  // Scroll listener to check if user is near bottom
  const handleScroll = useCallback(() => {
    const el = transcriptRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceToBottom < 120;
    isNearBottomRef.current = nearBottom;
    setShowScrollBottom(!nearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: transcriptRef.current.scrollHeight,
        behavior: 'smooth',
      });
      isNearBottomRef.current = true;
      setShowScrollBottom(false);
    }
  }, []);

  // Auto-scroll on new messages only if near bottom
  useEffect(() => {
    if (isNearBottomRef.current && transcriptRef.current) {
      transcriptRef.current.scrollTo({
        top: transcriptRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const handleSelectPrompt = (promptText: string) => {
    setDraftPrompt(promptText);
  };

  const handleSend = (text: string) => {
    setDraftPrompt('');
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* 1. Left Sidebar */}
      <AIChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewChat={() => createNewConversation(initialDocId, contextDocTitle)}
        onRenameConversation={renameConversation}
        onDeleteConversation={deleteConversation}
        onClearAll={clearAllConversations}
      />

      {/* 2. Main Central Workspace */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header (56px) */}
        <AIChatHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={() => createNewConversation(initialDocId, contextDocTitle)}
          contextDocTitle={activeConversation?.contextDocTitle || contextDocTitle}
          contextDocId={activeConversation?.contextDocId || initialDocId}
          onClearContextDoc={onClearContextDoc}
        />

        {/* Reading & Conversation Area */}
        <main
          ref={transcriptRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 relative custom-scrollbar overscroll-contain"
        >
          {!hasMessages ? (
            <AIEmptyState
              contextDocTitle={activeConversation?.contextDocTitle || contextDocTitle}
              onSelectPrompt={handleSelectPrompt}
            />
          ) : (
            <div className="max-w-[800px] mx-auto w-full pb-8">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onOpenCitations={openCitationPanel}
                  onRetry={retryMessage}
                />
              ))}
            </div>
          )}

          {/* Floating Scroll-to-Bottom Button */}
          {showScrollBottom && (
            <div className="sticky bottom-4 flex justify-center z-10 pointer-events-none">
              <button
                type="button"
                onClick={scrollToBottom}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                <ArrowDown weight="bold" className="h-3.5 w-3.5" />
                <span>Xuống cuối</span>
              </button>
            </div>
          )}
        </main>

        {/* Bottom Pinned Composer */}
        <footer className="shrink-0 pb-4 pt-1 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 dark:to-transparent">
          <ChatInput
            onSend={handleSend}
            onStop={stopWaiting}
            loading={loading}
            initialDraft={draftPrompt}
            contextDocTitle={activeConversation?.contextDocTitle || contextDocTitle}
            onClearContextDoc={onClearContextDoc}
          />
        </footer>
      </div>

      {/* 3. Right Citation Panel */}
      <CitationPanel
        isOpen={citationPanelState.isOpen}
        onClose={closeCitationPanel}
        citations={citationPanelState.citations}
      />
    </div>
  );
}
