import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import { guessColumnMap, type ParsedSheet } from "@/lib/catalog-import";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload an Excel or CSV file" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  if (!/\.(xlsx|xls|csv)$/.test(name)) {
    return NextResponse.json(
      { error: "Use .xlsx, .xls, or .csv" },
      { status: 400 },
    );
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer", raw: false });
    const sheetName = wb.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ error: "Sheet is empty" }, { status: 400 });
    }
    const sheet = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    if (!json.length) {
      return NextResponse.json({ error: "No data rows found" }, { status: 400 });
    }

    const headers = Object.keys(json[0] ?? {});
    const rows: Record<string, string>[] = json.map((r) => {
      const out: Record<string, string> = {};
      for (const h of headers) {
        out[h] = String(r[h] ?? "").trim();
      }
      return out;
    });

    const payload: ParsedSheet & {
      suggestedMap: ReturnType<typeof guessColumnMap>;
      sheetName: string;
      preview: Record<string, string>[];
    } = {
      headers,
      rows,
      suggestedMap: guessColumnMap(headers),
      sheetName,
      preview: rows.slice(0, 8),
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Could not read that file. Try exporting again as .xlsx or .csv." },
      { status: 400 },
    );
  }
}
