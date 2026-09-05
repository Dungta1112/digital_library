'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroupService } from '@/services/group.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDialogAccessibility } from '@/hooks/useDialogAccessibility';
import {
  X,
  GraduationCap,
  BookOpen,
  ProjectorScreenChart,
  Sparkle,
  Plus,
  Icon,
} from '@phosphor-icons/react';

interface CreateGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface TemplateOption {
  id: string;
  name: string;
  icon: Icon;
  defaultName: string;
  defaultDescription: string;
  tip: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'exam',
    name: 'Ôn thi',
    icon: GraduationCap,
    defaultName: 'Nhóm ôn thi môn ',
    defaultDescription:
      '• Môn học cần ôn:\n• Nội dung trọng tâm:\n• Cách thức trao đổi và giải bài tập cùng nhau:',
    tip: 'Thích hợp cho nhóm ôn luyện đề thi, giải bài tập cuối kỳ.',
  },
  {
    id: 'reading',
    name: 'Đọc tài liệu',
    icon: BookOpen,
    defaultName: 'Nhóm đọc chuyên đề ',
    defaultDescription:
      '• Chuyên đề / tài liệu thư viện cùng đọc:\n• Mục tiêu nắm bắt kiến thức:\n• Trao đổi ghi chú & trích dẫn:',
    tip: 'Thích hợp cho việc cùng đọc sách chuyên khảo, giáo trình thư viện.',
  },
  {
    id: 'project',
    name: 'Làm đồ án',
    icon: ProjectorScreenChart,
    defaultName: 'Nhóm nghiên cứu đồ án ',
    defaultDescription:
      '• Đề tài nghiên cứu:\n• Mục tiêu sản phẩm / đồ án:\n• Kế hoạch phối hợp thực hiện:',
    tip: 'Thích hợp cho nhóm làm tiểu luận, đồ án môn học hoặc khóa luận.',
  },
  {
    id: 'custom',
    name: 'Tự do',
    icon: Sparkle,
    defaultName: '',
    defaultDescription: '',
    tip: 'Tự viết tên và mục tiêu tham gia theo nhu cầu riêng của bạn.',
  },
];

export function CreateGroupDialog({ isOpen, onClose, onCreated }: CreateGroupDialogProps) {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('exam');
  const [name, setName] = useState<string>(TEMPLATES[0].defaultName);
  const [description, setDescription] = useState<string>(TEMPLATES[0].defaultDescription);
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const dialogRef = useDialogAccessibility<HTMLDivElement>(isOpen, onClose, creating);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: TemplateOption) => {
    setSelectedTemplate(tpl.id);
    setName(tpl.defaultName);
    setDescription(tpl.defaultDescription);
    setError('');
  };

  const handleClose = () => {
    if (creating) return;
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Vui lòng nhập tên nhóm học tập');
      return;
    }
    if (trimmedName.length > 120) {
      setError('Tên nhóm không được vượt quá 120 ký tự');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const newGroup = await GroupService.createGroup(trimmedName, description.trim(), 'PUBLIC');
      onClose();
      if (onCreated) onCreated();
      if (newGroup && newGroup.id) {
        router.push(`/groups/${newGroup.id}`);
      }
    } catch (err: unknown) {
      console.error('Lỗi khi tạo nhóm:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tạo nhóm học tập lúc này. Vui lòng thử lại sau.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="create-group-title" className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl outline-none dark:border dark:border-slate-800 dark:bg-slate-900 transition-all max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
          <h2 id="create-group-title" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Tạo phòng học nhóm
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Cùng nhau đọc tài liệu, trao đổi bài học và đạt mục tiêu học tập.
            </p>
          </div>
          <button
            type="button"
          onClick={handleClose}
          disabled={creating}
          aria-label="Đóng hộp thoại tạo nhóm"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pt-5 space-y-5 pr-1">
          {/* Template Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Chọn mẫu mục tiêu
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-300 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <Icon weight={isSelected ? 'fill' : 'duotone'} className="w-6 h-6 mb-1 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold">{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Tên nhóm <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {name.length}/120 ký tự
              </span>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nhóm ôn thi Cơ sở Dữ liệu K21"
              maxLength={120}
              disabled={creating}
              className="h-11 rounded-xl text-sm"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả & Hướng dẫn học tập
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu học tập, tài liệu sẽ cùng nhau đọc..."
              disabled={creating}
              rows={4}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Visibility Note */}
          <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 p-3 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            💡 Nhóm sẽ được tạo ở chế độ <strong>Công khai</strong> để các bạn học viên có thể tìm thấy và tham gia cùng học ngay.
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={creating}
              className="h-11 px-5 rounded-xl text-sm font-semibold"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={creating || !name.trim()}
              aria-busy={creating}
              className="h-11 px-6 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 flex items-center gap-2"
            >
              <Plus weight="bold" className="w-4 h-4" />
              {creating ? 'Đang tạo phòng...' : 'Tạo phòng học'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
