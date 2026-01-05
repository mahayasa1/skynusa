import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { useForm } from '@inertiajs/react';
import { request } from '@/routes/password';
import { Head, Link } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const setCanvasSize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };

        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        const particles = Array.from({ length: 25 }).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 2 + Math.random() * 3,
            dx: (Math.random() - 0.5) * 1,
            dy: (Math.random() - 0.5) * 1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 🔹 background gradient subtle tech blue
            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, "rgba(10,25,60,0.6)");
            bg.addColorStop(1, "rgba(5,15,40,0.6)");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 🔵 Draw particles
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

                ctx.fillStyle = "rgba(80,170,255,0.9)";
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#4ea8ff";

                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // 🔗 Connect particles with neon lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];

                    const dist = Math.hypot(a.x - b.x, a.y - b.y);

                    if (dist < 180) {
                        const opacity = 1 - dist / 180;

                        ctx.strokeStyle = `rgba(80,170,255,${opacity * 0.6})`;
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", setCanvasSize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10"
            style={{ filter: "blur(0px)" }}
        />
    );
}


export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => setData('password', ''),
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
                .animate-delay-200 { animation-delay: 0.2s; }
                .animate-delay-400 { animation-delay: 0.4s; }
                .animate-delay-600 { animation-delay: 0.6s; }
                .opacity-0 { opacity: 0; }
            `}</style>

            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

                <AnimatedBackground />

                <div className="relative z-10 w-full max-w-md px-6">

                    <div className="mt-5 mb-5 text-center opacity-0 animate-fade-in-up">
                        <Link href="/" className="inline-flex items-center justify-center mb-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                <img 
                                    src="/asset/footer-logo.png" 
                                    alt="Logo" 
                                    className="h-10 w-100 object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {status && (
                        <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center text-sm font-medium text-green-400 opacity-0 animate-fade-in-up animate-delay-200">
                            {status}
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-white/20 shadow-2xl p-8 opacity-0 animate-fade-in-up animate-delay-400">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <h1 className="text-4xl text-center font-bold text-black">
                                LOGIN
                            </h1>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-black flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="text-black"
                                    name="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-black flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </Label>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        className="text-black"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>

                                <InputError message={errors.password} />

                                {canResetPassword && (
                                    <TextLink href={request()} className="text-gray-500 hover:text-black text-sm">
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                                disabled={processing}
                            >
                                {processing ? <><Spinner /> Signing In...</> : 'Sign In'}
                            </Button>

                            {canRegister && (
                                <div className="text-center text-sm text-black">
                                    Don't have an account?{' '}
                                    <TextLink href={register()} className="text-gray-500 hover:text-black font-semibold">
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className=" mt-2 text-center text-sm text-blue-200/60 opacity-0 animate-fade-in-up animate-delay-600">
                        © 2025 SKYNUSA TECH. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}
