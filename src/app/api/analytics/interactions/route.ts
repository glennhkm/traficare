import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Insert interaction data
    const { error } = await supabaseAdmin.from("analytics_interactions").insert({
      type: data.type,
      path: data.path,
      element: data.element || null,
      text: data.text || null,
      scroll_depth: data.scroll_depth || null,
      student_nis: data.student_nis || null,
      session_id: data.session_id,
      timestamp: data.timestamp,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Interactions insert error:", error);
      return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Interactions API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
