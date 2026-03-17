"use client";

import { useState, useCallback } from "react";
import { validateOrder, CHANNELS, type OrderPayload, type FormErrors } from "@/lib/validations";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Order {
  order_id:    string;
  customer_id: string;
  sku:         string;
  quantity:    number;
  unit_price:  number;
  order_date:  string;
  channel:     string;
  created_at:  string;
}

const EMPTY: OrderPayload = {
  order_id:    "",
  customer_id: "",
  sku:         "",
  quantity:    "",
  unit_price:  "",
  order_date:  new Date().toISOString().split("T")[0],
  channel:     "",
};

const CHANNEL_LABELS: Record<string, string> = {
  ecommerce: "E-commerce",
  retail:    "Retail",
  wholesale: "Wholesale",
  export:    "Export",
};

const CHANNEL_COLORS: Record<string, string> = {
  ecommerce: "bg-violet-100 text-violet-700",
  retail:    "bg-emerald-100 text-emerald-700",
  wholesale: "bg-amber-100 text-amber-700",
  export:    "bg-sky-100 text-sky-700",
};

// ── Small components ──────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 3.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 7a.875.875 0 110-1.75.875.875 0 010 1.75z" />
      </svg>
      {msg}
    </p>
  );
}

function ChannelBadge({ channel }: { channel: string }) {
  const color = CHANNEL_COLORS[channel] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {CHANNEL_LABELS[channel] ?? channel}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OrderForm() {
  const [form,        setForm]        = useState<OrderPayload>(EMPTY);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [status,      setStatus]      = useState<"idle" | "loading" | "success" | "error">("idle");
  const [apiMsg,      setApiMsg]      = useState("");
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [tableLoaded, setTableLoaded] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const fetchOrders = useCallback(async () => {
    try {
      const res  = await fetch("/api/orders?limit=10");
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders ?? []);
      setTableLoaded(true);
    } catch {
      setTableLoaded(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { ok, errors: ve } = validateOrder(form);
    if (!ok) {
      setErrors(ve);
      return;
    }

    setStatus("loading");
    setErrors({});

    try {
      const res  = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = (await res.json()) as {
        success?: boolean;
        order?:   Order;
        error?:   string;
        fields?:  FormErrors;
      };

      if (res.ok && data.order) {
        setStatus("success");
        setApiMsg(`✓ Pedido ${data.order.order_id} registrado correctamente.`);
        setForm({ ...EMPTY, order_date: new Date().toISOString().split("T")[0] });
        void fetchOrders();
      } else {
        setStatus("error");
        if (data.fields) setErrors(data.fields);
        setApiMsg(data.error ?? "Error desconocido.");
      }
    } catch {
      setStatus("error");
      setApiMsg("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="space-y-8">

      {/* ── FORM CARD ───────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl shadow-xl shadow-rose-900/5 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-md shadow-rose-500/30 flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Nuevo pedido</h2>
            <p className="text-xs text-slate-400">Completa todos los campos requeridos</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-8 py-7 space-y-6">

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label" htmlFor="order_id">
                Order ID <span className="text-rose-400">*</span>
              </label>
              <input
                id="order_id" name="order_id" type="text"
                className={`field-input ${errors.order_id ? "error" : ""}`}
                placeholder="O001234"
                value={form.order_id as string}
                onChange={handleChange}
                autoComplete="off"
              />
              <FieldError msg={errors.order_id} />
            </div>
            <div>
              <label className="field-label" htmlFor="customer_id">
                Customer ID <span className="text-rose-400">*</span>
              </label>
              <input
                id="customer_id" name="customer_id" type="text"
                className={`field-input ${errors.customer_id ? "error" : ""}`}
                placeholder="C0001"
                value={form.customer_id as string}
                onChange={handleChange}
                autoComplete="off"
              />
              <FieldError msg={errors.customer_id} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label" htmlFor="sku">
                SKU <span className="text-rose-400">*</span>
              </label>
              <input
                id="sku" name="sku" type="text"
                className={`field-input ${errors.sku ? "error" : ""}`}
                placeholder="SKU0001"
                value={form.sku as string}
                onChange={handleChange}
                autoComplete="off"
              />
              <FieldError msg={errors.sku} />
            </div>
            <div>
              <label className="field-label" htmlFor="channel">
                Canal <span className="text-rose-400">*</span>
              </label>
              <select
                id="channel" name="channel"
                className={`field-input ${errors.channel ? "error" : ""}`}
                value={form.channel as string}
                onChange={handleChange}
              >
                <option value="">— Seleccionar —</option>
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>{CHANNEL_LABELS[ch]}</option>
                ))}
              </select>
              <FieldError msg={errors.channel} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="field-label" htmlFor="quantity">
                Cantidad <span className="text-rose-400">*</span>
              </label>
              <input
                id="quantity" name="quantity" type="number"
                min="1" step="1"
                className={`field-input ${errors.quantity ? "error" : ""}`}
                placeholder="1"
                value={form.quantity as string}
                onChange={handleChange}
              />
              <FieldError msg={errors.quantity} />
            </div>
            <div>
              <label className="field-label" htmlFor="unit_price">
                Precio unitario <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">$</span>
                <input
                  id="unit_price" name="unit_price" type="number"
                  min="0.01" step="0.01"
                  className={`field-input pl-7 ${errors.unit_price ? "error" : ""}`}
                  placeholder="0.00"
                  value={form.unit_price as string}
                  onChange={handleChange}
                />
              </div>
              <FieldError msg={errors.unit_price} />
            </div>
            <div>
              <label className="field-label" htmlFor="order_date">
                Fecha <span className="text-rose-400">*</span>
              </label>
              <input
                id="order_date" name="order_date" type="date"
                className={`field-input ${errors.order_date ? "error" : ""}`}
                value={form.order_date as string}
                onChange={handleChange}
              />
              <FieldError msg={errors.order_date} />
            </div>
          </div>

          {/* Success banner */}
          {status === "success" && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-emerald-700 font-medium">{apiMsg}</p>
            </div>
          )}

          {/* Error banner (only if no field-level errors) */}
          {status === "error" && Object.keys(errors).length === 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-rose-700 font-medium">{apiMsg}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              <span className="text-rose-400 font-bold">*</span> Campos obligatorios
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {status === "loading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Guardando…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Registrar pedido
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── ORDERS TABLE ────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl shadow-xl shadow-rose-900/5 overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.272 2.272 0 011 14.75l-.01-9.51zM8.25 10.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm0 3a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25zm-3-6a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H5.25zM5.25 12a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Últimos pedidos</h2>
              <p className="text-xs text-slate-400">10 más recientes en fact_sales</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M13.836 2.477a.75.75 0 01.75.75v3.182a.75.75 0 01-.75.75h-3.182a.75.75 0 010-1.5h1.37l-.84-.841a4.5 4.5 0 00-7.08.932.75.75 0 01-1.3-.75 6 6 0 019.44-1.242l.842.84V3.227a.75.75 0 01.75-.75zm-.911 7.5A.75.75 0 0112.199 11a4.5 4.5 0 01-7.439-.932.75.75 0 111.301.75 3 3 0 004.895.562l.84-.84h-1.38a.75.75 0 010-1.5h3.181a.75.75 0 01.75.75v3.18a.75.75 0 01-1.5 0v-1.37l-.84.84z" clipRule="evenodd" />
            </svg>
            Actualizar
          </button>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          {!tableLoaded ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <svg className="w-10 h-10 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V6m17.25 13.5a1.125 1.125 0 001.125-1.125M21 19.5h-1.5c-.621 0-1.125-.504-1.125-1.125M21 6H3m18 0v12.375m0-12.375c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.875 3 5.379 3 6z" />
              </svg>
              <p className="text-sm font-medium">Presiona «Actualizar» para cargar los pedidos</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <svg className="w-10 h-10 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <p className="text-sm font-medium">No hay pedidos registrados aún</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {["Order ID", "Cliente", "SKU", "Qty", "Precio", "Canal", "Fecha"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-rose-50/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">{o.order_id}</td>
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{o.customer_id}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{o.sku}</td>
                    <td className="px-5 py-3 text-center font-semibold text-slate-700">{o.quantity}</td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                      ${Number(o.unit_price).toFixed(2)}
                    </td>
                    <td className="px-5 py-3"><ChannelBadge channel={o.channel} /></td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{o.order_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
