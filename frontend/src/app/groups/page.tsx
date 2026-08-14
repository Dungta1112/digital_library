'use client';
import React, { useState, useEffect } from 'react';
import { GroupService } from '@/services/group.service';
import { StudyGroup } from '@/types/group';
import { GroupCard } from '@/components/feature/Group/GroupComponents';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePermissions } from '@/hooks/usePermissions';
import { Plus, MagnifyingGlass, UsersThree, X } from '@phosphor-icons/react';

export default function GroupsPage() {
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { can } = usePermissions();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'REQUEST_TO_JOIN' | 'PRIVATE'>('PUBLIC');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    const loadGroups = () => {
        setLoading(true);
        GroupService.getGroups().then(g => {
            setGroups(g);
            setLoading(false);
        });
    };

    useEffect(() => {
        loadGroups();
    }, []);

    const filtered = groups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setName('');
        setDescription('');
        setVisibility('PUBLIC');
        setCreateError('');
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setCreateError('Vui lòng nhập tên nhóm');
            return;
        }
        setCreating(true);
        setCreateError('');
        try {
            await GroupService.createGroup(name.trim(), description.trim(), visibility);
            setShowCreateModal(false);
            resetForm();
            loadGroups();
        } catch (error) {
            console.error(error);
            setCreateError('Không thể tạo nhóm, vui lòng thử lại');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/80 dark:bg-slate-950 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header — left-aligned, no card wrapper */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                    <UsersThree weight="duotone" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                    {groups.length} nhóm
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight transition-colors duration-300">
                                Nhóm học tập
                            </h1>
                            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-[55ch] transition-colors duration-300">
                                Tham gia cộng đồng học tập để cùng trao đổi, thảo luận và chia sẻ kiến thức.
                            </p>
                        </div>
                        {can('CREATE_GROUP') && (
                            <Button onClick={() => setShowCreateModal(true)} className="h-11 px-6 shadow-md font-semibold shrink-0 active:scale-[0.98]">
                                <Plus weight="bold" className="w-4 h-4 mr-2" />
                                Tạo nhóm
                            </Button>
                        )}
                    </div>

                    {/* Search bar */}
                    <div className="relative mt-8 max-w-md">
                        <MagnifyingGlass weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhóm..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Groups Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-56 bg-white dark:bg-slate-900/80 rounded-xl animate-pulse border border-gray-200/80 dark:border-slate-700/50 transition-colors duration-300" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MagnifyingGlass weight="duotone" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Không tìm thấy nhóm nào</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Thử từ khoá khác hoặc tạo nhóm mới.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map(g => <GroupCard key={g.id} group={g} />)}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !creating && setShowCreateModal(false)}>
                    <div
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tạo nhóm học tập</h2>
                            <button onClick={() => !creating && setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X weight="bold" className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tên nhóm</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Nhóm luyện đề Toán rời rạc" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mô tả</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Nhóm dành cho ai, học nội dung gì..."
                                    className="w-full rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[90px] resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Chế độ</label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                                    className="w-full h-11 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="PUBLIC">Công khai — ai cũng tham gia được ngay</option>
                                    <option value="REQUEST_TO_JOIN">Cần duyệt — phải xin phép trước khi vào</option>
                                    <option value="PRIVATE">Riêng tư — chỉ mời mới vào được</option>
                                </select>
                            </div>

                            {createError && <p className="text-sm text-red-500">{createError}</p>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => !creating && setShowCreateModal(false)} className="h-11 px-5">
                                Huỷ
                            </Button>
                            <Button onClick={handleCreate} disabled={creating} className="h-11 px-6 font-semibold">
                                {creating ? 'Đang tạo...' : 'Tạo nhóm'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}