'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await AuthService.login(email, password);
            login(res.user, res.accessToken, res.refreshToken);
            router.push('/library');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800/50">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Địa chỉ email
                </label>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="email@truong.edu.vn"
                    className="h-12"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Mật khẩu
                </label>
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12"
                />
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold mt-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
        </form>
    );
}

export function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.register(email, password, fullName);
            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800/50">
                    {error}
                </div>
            )}
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Họ và tên
                </label>
                <Input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    placeholder="Nguyễn Văn A"
                    className="h-12"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Địa chỉ email
                </label>
                <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="sinhvien@truong.edu.vn"
                    className="h-12"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Mật khẩu
                </label>
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className="h-12"
                />
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-bold mt-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
        </form>
    );
}