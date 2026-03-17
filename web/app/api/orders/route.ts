/**
 * app/api/orders/route.ts
 * POST  /api/orders  — registrar nuevo pedido
 * GET   /api/orders  — listar últimos pedidos
 */

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { validateOrder, type OrderPayload } from "@/lib/validations";

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: Partial<OrderPayload>;

  try {
    body = (await req.json()) as Partial<OrderPayload>;
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const { ok, errors } = validateOrder(body);
  if (!ok) {
    return NextResponse.json(
      { error: "Errores de validación.", fields: errors },
      { status: 422 }
    );
  }

  const row = {
    order_id:    (body.order_id as string).trim(),
    customer_id: (body.customer_id as string).trim(),
    sku:         (body.sku as string).trim().toUpperCase(),
    quantity:    Number(body.quantity),
    unit_price:  Number(body.unit_price),
    order_date:  (body.order_date as string).trim(),
    channel:     (body.channel as string).trim().toLowerCase(),
  };

  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO fact_sales
        (order_id, customer_id, sku, quantity, unit_price, order_date, channel)
      VALUES
        (@order_id, @customer_id, @sku, @quantity, @unit_price, @order_date, @channel)
    `).run(row);

    return NextResponse.json({ success: true, order: row }, { status: 201 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("UNIQUE constraint")) {
      return NextResponse.json(
        { error: `Ya existe un pedido con order_id "${row.order_id}".` },
        { status: 409 }
      );
    }

    console.error("[POST /api/orders]", msg);
    return NextResponse.json(
      { error: "Error interno al guardar el pedido." },
      { status: 500 }
    );
  }
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit  = Math.min(parseInt(searchParams.get("limit")  ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const db = getDb();

    const orders = db.prepare(`
      SELECT order_id, customer_id, sku, quantity, unit_price,
             order_date, channel, created_at
      FROM   fact_sales
      ORDER  BY created_at DESC
      LIMIT  ? OFFSET ?
    `).all(limit, offset);

    const { n } = db.prepare(
      "SELECT COUNT(*) AS n FROM fact_sales"
    ).get() as { n: number };

    return NextResponse.json({ orders, total: n, limit, offset });

  } catch (err: unknown) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json(
      { error: "Error al obtener pedidos." },
      { status: 500 }
    );
  }
}