/**
 * lib/validations.ts
 * Shared validation for order payload – used by both API route (server)
 * and can be imported by the client form for instant feedback.
 */

export const CHANNELS = ["ecommerce", "retail", "wholesale", "export"] as const;
export type Channel = (typeof CHANNELS)[number];

export interface OrderPayload {
  order_id:    string;
  customer_id: string;
  sku:         string;
  quantity:    number | string;
  unit_price:  number | string;
  order_date:  string;
  channel:     string;
}

export type FormErrors = Partial<Record<keyof OrderPayload, string>>;

export interface ValidationResult {
  ok:     boolean;
  errors: FormErrors;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE       = /^[A-Za-z0-9_-]+$/;

export function validateOrder(data: Partial<OrderPayload>): ValidationResult {
  const errors: Partial<Record<keyof OrderPayload, string>> = {};

  // order_id
  if (!data.order_id?.trim()) {
    errors.order_id = "El Order ID es obligatorio.";
  } else if (!ID_RE.test(data.order_id.trim())) {
    errors.order_id = "Solo letras, números, guiones y guiones bajos.";
  }

  // customer_id
  if (!data.customer_id?.trim()) {
    errors.customer_id = "El Customer ID es obligatorio.";
  } else if (!ID_RE.test(data.customer_id.trim())) {
    errors.customer_id = "Solo letras, números, guiones y guiones bajos.";
  }

  // sku
  if (!data.sku?.trim()) {
    errors.sku = "El SKU es obligatorio.";
  }

  // quantity
  const qty = Number(data.quantity);
  if (data.quantity === "" || data.quantity === undefined || data.quantity === null) {
    errors.quantity = "La cantidad es obligatoria.";
  } else if (!Number.isInteger(qty) || qty <= 0) {
    errors.quantity = "Debe ser un entero mayor a 0.";
  }

  // unit_price
  const price = Number(data.unit_price);
  if (data.unit_price === "" || data.unit_price === undefined || data.unit_price === null) {
    errors.unit_price = "El precio unitario es obligatorio.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.unit_price = "Debe ser un número mayor a 0.";
  }

  // order_date
  if (!data.order_date?.trim()) {
    errors.order_date = "La fecha es obligatoria.";
  } else if (!ISO_DATE_RE.test(data.order_date.trim())) {
    errors.order_date = "Formato inválido (YYYY-MM-DD).";
  } else {
    const d = new Date(data.order_date.trim());
    if (Number.isNaN(d.getTime())) {
      errors.order_date = "Fecha inválida.";
    }
  }

  // channel
  if (!data.channel?.trim()) {
    errors.channel = "El canal es obligatorio.";
  } else if (!CHANNELS.includes(data.channel.trim() as Channel)) {
    errors.channel = `Canal inválido. Opciones: ${CHANNELS.join(", ")}.`;
  }

  return { ok: Object.keys(errors).length === 0, errors };
}