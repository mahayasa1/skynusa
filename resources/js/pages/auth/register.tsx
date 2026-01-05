import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, Shield, User } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    return (
        <>
            <Head title="Register" />
            
            {/* Reuse same animations from login */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-pulse-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
                }

                .animate-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .animate-delay-400 {
                    animation-delay: 0.4s;
                }
                
                .animate-delay-600 {
                    animation-delay: 0.6s;
                }

                .opacity-0 {
                    opacity: 0;
                }

                .gradient-mesh {
                    background: 
                        radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 50%),
                        radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%),
                        radial-gradient(at 80% 50%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%),
                        radial-gradient(at 80% 100%, rgba(99, 102, 241, 0.2) 0px, transparent 50%);
                }
            `}</style>

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Animated Background */}
                <div className="absolute inset-0 gradient-mesh"></div>
                <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzFmMmQzZCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>

                {/* Register Container */}
                <div className="relative z-10 w-full max-w-md px-6 py-8">
                    
                    {/* Logo & Title */}
                    <div className="mb-8 text-center opacity-0 animate-fade-in-up">
                        <Link href="/" className="inline-flex items-center justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-2xl animate-pulse-glow">
                                    <Shield className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </Link>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-blue-200">
                            Join SKYNUSA TECH today
                        </p>
                    </div>

                    {/* Register Form Card */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 opacity-0 animate-slide-in-right animate-delay-400">
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Name Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-white flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="John Doe"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* Email Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-white flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-white flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Create a strong password"
                                                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-white flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? 'text' : 'password'}
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Confirm your password"
                                                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                                            >
                                                {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    {/* Register Button */}
                                    <Button
                                        type="submit"
                                        className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                                        tabIndex={5}
                                        disabled={processing}
                                        data-test="register-user-button"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner />
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </Button>

                                    {/* Login Link */}
                                    <div className="text-center text-sm text-blue-200">
                                        Already have an account?{' '}
                                        <TextLink 
                                            href={login()} 
                                            tabIndex={6}
                                            className="text-blue-300 hover:text-white font-semibold"
                                        >
                                            Log in
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-blue-200/60 opacity-0 animate-fade-in-up animate-delay-600">
                        © 2025 SKYNUSA TECH. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}