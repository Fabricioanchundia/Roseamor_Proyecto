import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roseamor",
  description: "Roseamor ETL & Sales Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#f8f7f5] text-slate-900 selection:bg-rose-200 selection:text-rose-900">
        <div className="relative min-h-screen overflow-hidden">
          {/* ── Decorative background ────────────────────────────── */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            {/* Warm off-white base */}
            <div className="absolute inset-0 bg-[#f8f7f5]" />
            {/* Radial rose glow top-right */}
            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-rose-200/30 blur-[96px]" />
            {/* Soft slate glow bottom-left */}
            <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-slate-300/20 blur-[80px]" />
            {/* Fine dot grid */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(#be1243 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          {/* ── Main container ──────────────────────────────────── */}
          <div className="relative z-10 min-h-screen mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-lg shadow-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent">Roseamor</h1>
                  <p className="text-sm text-slate-500">Sales & Orders Management</p>
                </div>
              </div>
            </header>

            {/* Content */}
            <main>
              {children}
            </main>
          </div>

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer className="relative z-10 mt-20 py-8 text-center text-xs text-slate-400 border-t border-slate-200/40">
            <p>© 2025 Roseamor. Built with ❀ | ETL & Analytics Platform</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
