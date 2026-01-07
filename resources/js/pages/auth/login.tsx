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
    const mouseRef = useRef({ x: 0, y: 0 });

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

        // Track mouse movement on entire window
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        window.addEventListener('mousemove', handleMouseMove);

        const particles = Array.from({ length: 50 }).map(() => {
            const homeX = Math.random() * canvas.width;
            const homeY = Math.random() * canvas.height;
            return {
                x: homeX,
                y: homeY,
                homeX: homeX,
                homeY: homeY,
                radius: 2 + Math.random() * 3,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                baseVx: (Math.random() - 0.5) * 0.5,
                baseVy: (Math.random() - 0.5) * 0.5
            };
        });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background gradient
            const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            bg.addColorStop(0, "rgba(10,25,60,0.6)");
            bg.addColorStop(1, "rgba(5,15,40,0.6)");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(p => {
                // Calculate distance to mouse
                const dxMouse = mouseRef.current.x - p.x;
                const dyMouse = mouseRef.current.y - p.y;
                const distanceToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                // Calculate distance to home
                const dxHome = p.homeX - p.x;
                const dyHome = p.homeY - p.y;
                const distanceToHome = Math.sqrt(dxHome * dxHome + dyHome * dyHome);
                
                const attractionRadius = 150;
                
                // If mouse is close, move away from mouse
                if (distanceToMouse < attractionRadius) {
                    const force = (attractionRadius - distanceToMouse) / attractionRadius;
                    const moveStrength = 3;
                    
                    // Move away from mouse
                    p.vx -= (dxMouse / distanceToMouse) * force * moveStrength;
                    p.vy -= (dyMouse / distanceToMouse) * force * moveStrength;
                } else {
                    // Return to home position with base movement
                    const returnStrength = 0.03;
                    if (distanceToHome > 50) {
                        p.vx += dxHome * returnStrength;
                        p.vy += dyHome * returnStrength;
                    } else {
                        // Add base floating movement when near home
                        p.vx += p.baseVx * 0.1;
                        p.vy += p.baseVy * 0.1;
                    }
                }
                
                // Always add slight random floating movement
                p.vx += (Math.random() - 0.5) * 0.05;
                p.vy += (Math.random() - 0.5) * 0.05;
                
                // Apply velocity with damping
                p.vx *= 0.92;
                p.vy *= 0.92;
                
                p.x += p.vx;
                p.y += p.vy;
                
                // Update home position slowly (drift effect)
                p.homeX += p.baseVx * 0.3;
                p.homeY += p.baseVy * 0.3;
                
                // Bounce home position off edges
                if (p.homeX < 0 || p.homeX > canvas.width) {
                    p.baseVx *= -1;
                    p.homeX = Math.max(0, Math.min(canvas.width, p.homeX));
                }
                if (p.homeY < 0 || p.homeY > canvas.height) {
                    p.baseVy *= -1;
                    p.homeY = Math.max(0, Math.min(canvas.height, p.homeY));
                }
                
                // Keep particle within bounds
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                p.x = Math.max(0, Math.min(canvas.width, p.x));
                p.y = Math.max(0, Math.min(canvas.height, p.y));

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(80,170,255,0.9)";
                ctx.shadowBlur = 20;
                ctx.shadowColor = "#4ea8ff";
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Connect particles with lines
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

            // Draw glow around mouse
            const mouseDistance = 150;
            particles.forEach(p => {
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseDistance) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(100,200,255,${(1 - distance / mouseDistance) * 0.3})`;
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", setCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 -z-10 cursor-pointer"
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
                        </form>
                    </div>

                    <div className=" mt-5 text-center text-sm text-blue-200/60 opacity-0 animate-fade-in-up animate-delay-600">
                        © 2025 SKYNUSA TECH. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}
