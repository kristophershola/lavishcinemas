// Thin wrapper around the Paystack REST API. Uses the secret key server side
// only; never expose PAYSTACK_SECRET_KEY to the client.

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata
    })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack initialize failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<{
    status: boolean;
    data: { authorization_url: string; access_code: string; reference: string };
  }>;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secretKey()}` }
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paystack verify failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<{
    status: boolean;
    data: { status: "success" | "failed" | "abandoned"; amount: number; reference: string };
  }>;
}
