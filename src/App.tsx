import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { ImageGenerator } from "./components/ImageGenerator";
import { Gallery } from "./components/Gallery";
import "./styles.css";

function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid email or password" : "Could not create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 md:w-32 md:h-32 bg-sunny rotate-12 rounded-blob opacity-60 animate-float" />
      <div className="absolute top-20 right-16 w-16 h-16 md:w-24 md:h-24 bg-sky rotate-[-8deg] rounded-blob opacity-50 animate-float-delayed" />
      <div className="absolute bottom-20 left-20 w-24 h-24 md:w-40 md:h-40 bg-coral rotate-6 rounded-blob opacity-40 animate-float" />
      <div className="absolute bottom-32 right-10 w-14 h-14 md:w-20 md:h-20 bg-mint rotate-[-12deg] rounded-blob opacity-50 animate-float-delayed" />

      {/* Stars scattered */}
      <Star className="absolute top-[15%] left-[30%] text-sunny w-6 h-6 md:w-8 md:h-8" />
      <Star className="absolute top-[40%] right-[20%] text-coral w-5 h-5 md:w-6 md:h-6" />
      <Star className="absolute bottom-[30%] left-[15%] text-sky w-7 h-7 md:w-10 md:h-10" />

      <div className="w-full max-w-md relative z-10">
        <div className="paper-card p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2 wiggle-text">
              Doodle Dreams
            </h1>
            <p className="font-hand text-lg md:text-xl text-charcoal/70">
              Where imagination comes to life!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-hand text-base md:text-lg text-charcoal block mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                className="crayon-input"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="font-hand text-base md:text-lg text-charcoal block mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                className="crayon-input"
                placeholder="Super secret password"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="bg-coral/20 border-2 border-coral border-dashed rounded-lg p-3 text-coral font-hand text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="crayon-button w-full bg-sky text-white hover:bg-sky/90 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">✨</span> Loading...
                </span>
              ) : (
                flow === "signIn" ? "Let's Go!" : "Join the Fun!"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="font-hand text-base md:text-lg text-charcoal/70 hover:text-charcoal underline decoration-wavy decoration-coral underline-offset-4"
            >
              {flow === "signIn" ? "New here? Sign up!" : "Already have an account? Sign in!"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-dashed border-charcoal/20">
            <button
              onClick={() => signIn("anonymous")}
              className="crayon-button w-full bg-mint text-charcoal hover:bg-mint/90"
            >
              Try as Guest 🎨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L14.5 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9.5L12 2Z" />
    </svg>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [showGallery, setShowGallery] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🎨</div>
          <p className="font-display text-2xl text-charcoal">Loading the magic...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-cream relative">
      {/* Paper texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')]" />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-dashed border-charcoal/20 bg-cream/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl md:text-3xl text-charcoal flex items-center gap-2">
            <span className="text-2xl md:text-3xl">🖍️</span>
            <span className="hidden sm:inline">Doodle Dreams</span>
            <span className="sm:hidden">Doodle</span>
          </h1>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowGallery(!showGallery)}
              className="crayon-button-small bg-sunny text-charcoal"
            >
              {showGallery ? "✏️ Create" : "🖼️ Gallery"}
            </button>
            <button
              onClick={() => signOut()}
              className="crayon-button-small bg-coral/80 text-white"
            >
              <span className="hidden sm:inline">Bye Bye</span>
              <span className="sm:hidden">👋</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-8">
        {showGallery ? <Gallery /> : <ImageGenerator />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 md:py-8 border-t-2 border-dashed border-charcoal/10">
        <p className="font-hand text-xs md:text-sm text-charcoal/40">
          Requested by @OxPaulius · Built by @clonkbot
        </p>
      </footer>

      {/* Decorative corner doodles */}
      <div className="fixed bottom-4 left-4 opacity-20 pointer-events-none hidden md:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-coral">
          <path d="M10 70C10 70 20 30 40 40C60 50 70 10 70 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5"/>
        </svg>
      </div>
      <div className="fixed top-20 right-4 opacity-20 pointer-events-none hidden md:block">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-sky">
          <circle cx="30" cy="30" r="25" stroke="currentColor" strokeWidth="3" strokeDasharray="8 4"/>
        </svg>
      </div>
    </div>
  );
}

export default App;
