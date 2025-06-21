// app/api/auth/session/route.js
import { getServerSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession();
  return new Response(JSON.stringify(session), {
    headers: { "Content-Type": "application/json" },
    status: 200
  });
}