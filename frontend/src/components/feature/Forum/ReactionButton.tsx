'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp } from '@phosphor-icons/react';
import { useForumStore, ReactionType } from '@/hooks/useForumStore';
import { motion, AnimatePresence } from 'framer-motion';

// Reaction configurations
const REACTIONS: { type: ReactionType; label: string; emoji: string; colorClass: string }[] = [
  { type: 'like', label: 'Thích', emoji: '👍', colorClass: 'text-blue-500' },
  { type: 'love', label: 'Yêu thích', emoji: '❤️', colorClass: 'text-red-500' },
  { type: 'haha', label: 'Haha', emoji: '😂', colorClass: 'text-yellow-500' },
  { type: 'wow', label: 'Wow', emoji: '😮', colorClass: 'text-yellow-600' },
  { type: 'sad', label: 'Buồn', emoji: '😢', colorClass: 'text-blue-400' },
  { type: 'angry', label: 'Phẫn nộ', emoji: '😡', colorClass: 'text-orange-600' },
];

export function ReactionButton({ postId }: { postId: string }) {
  const { reactions, setReaction } = useForumStore();
  const [showPopover, setShowPopover] = useState(false);
  const popoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const postReactionState = reactions[postId] || {
    myReaction: undefined,
    counts: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
    total: 0
  };

  const myReactionObj = REACTIONS.find(r => r.type === postReactionState.myReaction);

  const handleMouseEnter = () => {
    if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    popoverTimeoutRef.current = setTimeout(() => {
      setShowPopover(false);
    }, 450); // Small grace period
  };

  const handleReactionClick = (type: ReactionType) => {
    // If clicking the active reaction, toggle/remove it
    if (postReactionState.myReaction === type) {
      setReaction(postId, undefined);
    } else {
      setReaction(postId, type);
    }
    setShowPopover(false);
  };

  const handleMainClick = () => {
    // Quick click like toggle
    if (postReactionState.myReaction) {
      setReaction(postId, undefined);
    } else {
      setReaction(postId, 'like');
    }
  };

  // Clean timeout on unmount
  useEffect(() => {
    return () => {
      if (popoverTimeoutRef.current) clearTimeout(popoverTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative flex items-center justify-center flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reaction Popover */}
      <AnimatePresence>
        {showPopover && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-3 py-2 rounded-full shadow-xl flex items-center gap-2.5 z-30 select-none"
          >
            {REACTIONS.map((item, index) => (
              <motion.button
                key={item.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.35, y: -6 }}
                onClick={() => handleReactionClick(item.type)}
                className="text-2xl hover:drop-shadow-md active:scale-95 transition-all outline-none cursor-pointer duration-100 flex flex-col items-center group/emoji"
              >
                <span>{item.emoji}</span>
                <span className="absolute top-full mt-1 bg-slate-950/80 text-white font-bold text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/emoji:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button trigger */}
      <button 
        onClick={handleMainClick}
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold text-sm w-full outline-none ${
          myReactionObj ? myReactionObj.colorClass : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {myReactionObj ? (
          <span className="text-base select-none animate-in zoom-in-50 duration-200">
            {myReactionObj.emoji}
          </span>
        ) : (
          <ThumbsUp weight="bold" className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        )}
        <span>{myReactionObj ? myReactionObj.label : 'Thích'}</span>
      </button>
    </div>
  );
}
