import OrderForm from "@/components/OrderForm";

export default function Home() {
  return (
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

      {/* ── Top bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Rose logo mark */}
            <svg className="w-6 h-6 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/>
            </svg>
            <span
              className="font-display text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="gradient-text">Rose</span>
              <span className="text-slate-800">Amor</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
              Sistema activo
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* Page header */}
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 mb-5">
            <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 4.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.9-.994a5.002 5.002 0 019.8 0zM14.25 5.75a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5z"/>
            </svg>
            <span className="text-xs font-semibold text-rose-700 tracking-wide uppercase">
              Gestión de pedidos
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Registro de{" "}
            <span className="gradient-text italic">pedidos</span>
          </h1>
          <p className="text-slate-500 text-base max-w-xl leading-relaxed">
            Ingresa los datos del pedido. Todos los registros se guardan en la base de datos
            local de RoseAmor y quedan disponibles de inmediato para análisis en BI.
          </p>

          {/* Metadata strip */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.75 2a.75.75 0 00-.75.75v10.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75V6.56l-4.31-4.56H3.75zm5 1.06L12 6.44V13H4V3h4.75v.06zM6.5 7.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5zm.75-2.25a.875.875 0 100 1.75.875.875 0 000-1.75z"/>
              </svg>
              tabla: <code className="font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded">fact_sales</code>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2.75C2 1.784 2.784 1 3.75 1h8.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0112.25 15h-8.5A1.75 1.75 0 012 13.25V2.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25h-8.5z"/>
              </svg>
              <code className="font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded truncate max-w-[280px]">
                ../database/roseamor.db
              </code>
            </span>
          </div>
        </div>

        {/* Form + table */}
        <OrderForm />

      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="mx-auto max-w-5xl px-6 py-8 mt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} RoseAmor · Prueba Técnica Full Stack</span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" clipRule="evenodd"/>
            </svg>
            Next.js · Tailwind · SQLite
          </span>
        </div>
      </footer>

    </div>
  );
}