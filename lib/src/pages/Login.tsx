import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./dashboard/ui/button";
import { Input } from "./dashboard/ui/input";
import { Label } from "./dashboard/ui/label";
import { Checkbox } from "./dashboard/ui/checkbox";
import { CardContent } from "./dashboard/ui/card";
import { supabase } from "../lib/supabase";

// Import assets
import logo from "../../../assets/image/logo.png";
import pic2 from "../../../assets/image/pic2.jpg";
import pic3 from "../../../assets/image/pic3.png";
import pic4 from "../../../assets/image/pic4.png";

const slides = [
    {
        image: pic2,
        title: "AJGSecurity",
        description: "Professional Protection Services",
    },
    {
        image: pic3,
        title: "Advanced Monitoring",
        description: "24/7 Surveillance & Control SOC",
    },
    {
        image: pic4,
        title: "Expert Personnel",
        description: "Highly Trained Security Professionals",
    },
];

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Check for remembered email on mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    // Carousel auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!email || !password) {
                throw new Error("Please enter both email and password.");
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            // Successful login - handle Remember Me
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
            } else {
                localStorage.removeItem("rememberedEmail");
            }

            navigate("/");
        } catch (err: any) {
            setError(err.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 overflow-hidden p-0">
            {/* Left Side: Animated Carousel */}
            <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden group">
                <div className="w-full h-full lg:rounded-r-[10rem] overflow-hidden shadow-2xl relative group cursor-pointer transition-all duration-700 ease-in-out">
                    {/* Slides */}
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className={`w-full h-full object-cover transition-transform duration-[5s] ease-linear ${index === currentSlide ? "scale-110" : "scale-100"
                                    }`}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Slide Content */}
                            <div className={`absolute bottom-20 left-16 transition-all duration-700 delay-300 ${index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                                }`}>
                                <div className="flex items-center gap-5 mb-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 p-1 bg-white/10 backdrop-blur-md shadow-lg">
                                        <img src={logo} alt="AJG Logo" className="w-full h-full object-contain rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1 italic">Security Focus</p>
                                        <h3 className="text-white font-extrabold text-3xl tracking-tight drop-shadow-md">
                                            {slide.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-white/80 text-lg font-medium max-w-sm leading-relaxed">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Controls */}
                    <div className="absolute bottom-16 right-16 flex gap-4 z-20">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg group/btn"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg group/btn"
                        >
                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="absolute bottom-32 right-16 flex gap-2 z-20">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${i === currentSlide ? "w-8 bg-blue-600" : "w-1.5 bg-white/30 hover:bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-[52%] flex flex-col px-8 lg:px-24 py-12 items-center justify-center relative">
                <div className="w-full max-w-md space-y-10">
                    {/* Header */}
                    <div className="space-y-3">
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
                            AJGSecurity
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">
                            Welcome to AJGSecurity
                        </p>
                    </div>

                    <CardContent className="p-0">
                        <form onSubmit={handleSignIn} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-4">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-14 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-400 transition-all text-lg px-5 shadow-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" title="Password" className="text-sm font-bold text-slate-700 ml-1">
                                    Password
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="h-14 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-400 pr-14 transition-all text-lg px-5 shadow-sm"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                        className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-200 transition-all cursor-pointer"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-bold text-slate-600 cursor-pointer select-none"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                <button
                                    type="button"
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Handle forgot password
                                    }}
                                >
                                    Forgot password ?
                                </button>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-200 text-lg"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                    {/* Footer Social Icons */}
                    <div className="flex flex-col items-center gap-6 pt-6">
                        <div className="flex justify-center gap-8">
                            <a href="#" className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110 active:scale-90"><div className="w-5 h-5 bg-slate-200 rounded-full" /></a>
                            <a href="#" className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110 active:scale-90"><div className="w-5 h-5 bg-slate-200 rounded-full" /></a>
                            <a href="#" className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110 active:scale-90"><div className="w-5 h-5 bg-slate-200 rounded-full" /></a>
                        </div>
                        <p className="text-slate-400 text-xs font-semibold tracking-wider uppercase">
                            AJGSecurity. All Rights Reserved @ 2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
