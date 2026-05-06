import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

export function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear error when switching modes
        setError(null);
    }, [isSignUp]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName,
                        },
                    },
                });
                if (error) throw error;
                if (data.user && !data.session) {
                    setError("Check your email for the confirmation link.");
                } else {
                    navigate("/");
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate("/");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className={`auth-container ${isSignUp ? "active" : ""}`}>
                <span className="bg-animate"></span>
                <span className="bg-animate2"></span>

                <div className="form-box login">
                    <h2 className="animation" style={{ "--i": 14, "--j": 0 } as any}>Login</h2>
                    <form onSubmit={handleAuth}>
                        <div className="input-box animation" style={{ "--i": 15, "--j": 1 } as any}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <label>Email</label>
                            <i><Mail size={18} /></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 16, "--j": 2 } as any}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <label>Password</label>
                            <i
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                            </i>
                        </div>
                        <button
                            type="submit"
                            className="btn animation"
                            style={{ "--i": 17, "--j": 3 } as any}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                        </button>
                        <div className="logreg-link animation" style={{ "--i": 18, "--j": 4 } as any}>
                            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); }} className="register-link">Sign Up</a></p>
                        </div>
                        {error && !isSignUp && (
                            <div className="error-message text-red-500 text-xs mt-2 text-center animation" style={{ "--i": 19, "--j": 5 } as any}>
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="info-text login">
                    <h2 className="animation" style={{ "--i": 12, "--j": 0 } as any}>WELCOME </h2><h2 className="animation" style={{ "--i": 13, "--j": 1 } as any}>BACK!</h2>
                    <p className="animation" style={{ "--i": 14, "--j": 2 } as any}>Protecting what matters </p><p className="animation" style={{ "--i": 16, "--j": 4 } as any}>    most with AJGSecurity.</p>
                </div>

                <div className="form-box register">
                    <h2 className="animation" style={{ "--i": 14, "--j": 0 } as any}>Sign Up</h2>
                    <form onSubmit={handleAuth}>
                        <div className="input-box animation" style={{ "--i": 15, "--j": 1 } as any}>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                            <label>Username</label>
                            <i><User size={18} /></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 16, "--j": 2 } as any}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <label>Email</label>
                            <i><Mail size={18} /></i>
                        </div>
                        <div className="input-box animation" style={{ "--i": 17, "--j": 3 } as any}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <label>Password</label>
                            <i
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                            </i>
                        </div>
                        <button
                            type="submit"
                            className="btn animation"
                            style={{ "--i": 18, "--j": 4 } as any}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                        </button>
                        <div className="logreg-link animation" style={{ "--i": 19, "--j": 5 } as any}>
                            <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); }} className="login-link">Login</a></p>
                        </div>
                        {error && isSignUp && (
                            <div className="error-message text-red-500 text-xs mt-2 text-center animation" style={{ "--i": 20, "--j": 6 } as any}>
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className="info-text register">
                    <h2 className="animation" style={{ "--i": 14, "--j": 0 } as any}>WELCOME!</h2>
                    <p className="animation" style={{ "--i": 15, "--j": 1 } as any}>Join the AJGSecurity </p><p className="animation" style={{ "--i": 16, "--j": 2 } as any}>family today.</p>
                </div>
            </div>
        </div>
    );
}
