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
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">{error}</div>}
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4">
                Gợi ý (dữ liệu giả): dùng email bất kỳ, mật khẩu: <strong>password</strong>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="sinhvien@truong.edu.vn" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 text-lg mt-2">
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
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await AuthService.register(email, password, fullName);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">{error}</div>}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Nguyễn Văn A" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ email</label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="sinhvien@truong.edu.vn" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 text-lg mt-2">
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </Button>
        </form>
    );
}