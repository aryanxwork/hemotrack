import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Login() {
  const { login, register, user } = useAuth();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const result = isSignup ? await register(u, p) : await login(u, p);
    
    if (result.success) {
      toast.success(isSignup ? "Account created successfully!" : `Welcome, ${u}`);
      nav("/");
    } else {
      toast.error(result.message || (isSignup ? "Registration failed" : "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-primary/20 blur-3xl animate-blob-1" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-primary/15 blur-3xl animate-blob-2" />
      </div>

      <div className="glass glow-border rounded-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-3 glow-border">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary-foreground" fill="currentColor">
              <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl tracking-wide">HemoTrack</h1>
          <p className="text-sm text-muted-foreground">{isSignup ? "Patient Registration" : "Blood Bank Management System"}</p>
          {user && <Badge className="mt-3 bg-primary/15 text-primary border-primary/30">{user.role}</Badge>}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="u">Username</Label>
            <Input id="u" value={u} onChange={e => setU(e.target.value)} placeholder="Username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p">Password</Label>
            <Input id="p" type="password" value={p} onChange={e => setP(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-primary hover:underline transition-all"
          >
            {isSignup ? "Already have an account? Sign In" : "Need an account? Sign up as Patient"}
          </button>
        </div>

        {!isSignup && (
          <div className="mt-6 p-3 rounded-md bg-muted/40 text-xs text-muted-foreground space-y-1">
            <p><span className="font-semibold text-foreground">Admin:</span> admin1 / password123</p>
            <p><span className="font-semibold text-foreground">Staff:</span> staff1 / password123</p>
          </div>
        )}
      </div>
    </div>
  );
}
