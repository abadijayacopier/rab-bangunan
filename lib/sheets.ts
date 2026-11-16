import { google } from "googleapis";

export const SHEET_NAMES = [
  "USERS","PROYEK","PEKERJAAN","MATERIAL","UPAH","ALAT",
  "AHSP","AHSP_DETAIL","RAB","DETAIL_RAB","REALISASI",
  "LOG_AKTIVITAS","PENGATURAN"
] as const;

const HEADERS: Record<string,string[]> = {
  USERS:["user_id","nama","email","password_hash","role","status","created_at","updated_at"],
  PROYEK:["proyek_id","kode","nama","lokasi","pemilik","tanggal_mulai","tanggal_selesai","status","created_by","created_at","updated_at"],
  PEKERJAAN:["pekerjaan_id","kode","uraian","satuan","kategori","created_at","updated_at"],
  MATERIAL:["material_id","kode","nama","satuan","harga","supplier","updated_at"],
  UPAH:["upah_id","jabatan","satuan","harga","updated_at"],
  ALAT:["alat_id","kode","nama","satuan","harga","updated_at"],
  AHSP:["ahsp_id","kode","uraian","satuan","kategori","versi","updated_at"],
  AHSP_DETAIL:["detail_id","ahsp_id","jenis","sumber_id","uraian","satuan","koefisien"],
  RAB:["rab_id","proyek_id","nomor","versi","tanggal","status","subtotal","overhead_persen","profit_persen","pajak_persen","total","created_by","approved_by","created_at","updated_at"],
  DETAIL_RAB:["detail_id","rab_id","pekerjaan_id","kode","uraian","satuan","volume","harga_satuan","jumlah","urutan"],
  REALISASI:["realisasi_id","rab_id","detail_id","tanggal","volume","biaya","keterangan","created_by"],
  LOG_AKTIVITAS:["log_id","user_id","aktivitas","entitas","entitas_id","waktu","metadata"],
  PENGATURAN:["key","value","keterangan","updated_at"]
};

export function sheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g,"\n");
  if (!email || !key || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    throw new Error("Konfigurasi Google Sheets belum lengkap. Periksa environment variables.");
  }
  const auth = new google.auth.JWT({ email, key, scopes:["https://www.googleapis.com/auth/spreadsheets"] });
  return google.sheets({ version:"v4", auth });
}

export async function initializeWorkbook() {
  const api = sheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const meta = await api.spreadsheets.get({ spreadsheetId });
  const existing = new Set((meta.data.sheets ?? []).map(s=>s.properties?.title));
  const missing = SHEET_NAMES.filter(n=>!existing.has(n));
  if (missing.length) {
    await api.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody:{ requests:missing.map(title=>({addSheet:{properties:{title}}})) }
    });
  }
  await api.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody:{
      valueInputOption:"RAW",
      data:SHEET_NAMES.map(name=>({range:`${name}!A1`,values:[HEADERS[name]]}))
    }
  });
  return { created:missing, sheets:SHEET_NAMES };
}

export async function readRows<T=Record<string,string>>(tab:string):Promise<T[]> {
  if (!SHEET_NAMES.includes(tab as typeof SHEET_NAMES[number])) throw new Error("Sheet tidak diizinkan");
  const api=sheetsClient();
  const response=await api.spreadsheets.values.get({spreadsheetId:process.env.GOOGLE_SHEETS_SPREADSHEET_ID!,range:`${tab}!A:Z`});
  const [header,...rows]=response.data.values ?? [];
  if (!header) return [];
  return rows.filter(r=>r.some(Boolean)).map(row=>Object.fromEntries(header.map((h:string,i:number)=>[h,row[i]??""])) as T);
}
