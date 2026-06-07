import { RegisterForm } from '@/components/feature/Auth/AuthForms';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🎓</span>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the academic platform to start researching
          </p>
        </div>
        <RegisterForm />
        <div className="text-center text-sm pt-4 border-t border-gray-100">
          <Link href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
