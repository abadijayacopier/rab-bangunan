import { ArrowUpRight, Building2, Calculator, ClipboardList, FileText, HardHat, Layers3, Plus, Wallet } from "lucide-react";

const stats = [
  {label:"Total Proyek",value:"0",note:"Proyek terdaftar",icon:Building2},
  {label:"Total RAB",value:"0",note:"Dokumen anggaran",icon:Calculator},
  {label:"Nilai Anggaran",value:"Rp 0",note:"Akumulasi RAB",icon:Wallet},
  {label:"Dalam Pengerjaan",value:"0",note:"Proyek aktif",icon:HardHat}
];
const projects = [
  {code:"PRJ-001",name:"Contoh: Pembangunan Rumah Tinggal",location:"Magetan",budget:"Rp 0",status:"Draft"},
  {code:"PRJ-002",name:"Contoh: Renovasi Bangunan",location:"Magetan",budget:"Rp 0",status:"Draft"}
];
const nav=[["▦","Dashboard"],["▣","Data Proyek"],["▤","Rencana Anggaran"],["◫","Analisa Harga Satuan"],["▧","Material & Upah"],["▥","Realisasi"],["▤","Laporan"]];
export default function Home(){
 return <div className="shell">
  <aside className="sidebar">
   <div className="brand">RAB<span style={{color:"#60a5fa"}}>.</span>BANGUNAN<small>CONSTRUCTION COST SYSTEM</small></div>
   <div style={{fontSize:10,color:"#7890af",fontWeight:700,letterSpacing:1}}>MENU UTAMA</div>
   <nav className="nav">{nav.map(([icon,label],i)=><a className={i===0?"active":""} href="#" key={label}><span style={{marginRight:10}}>{icon}</span>{label}</a>)}</nav>
   <div style={{marginTop:"auto",fontSize:11,color:"#7890af"}}>RAB Bangunan · v0.1.0</div>
  </aside>
  <main className="main">
   <header className="topbar"><div style={{fontSize:13,color:"#718096"}}>Workspace / <b style={{color:"#24364d"}}>Dashboard</b></div><div style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}><span style={{color:"#718096"}}>Administrator</span><span style={{background:"#eaf2ff",color:"#2459b5",borderRadius:30,padding:"9px 11px",fontWeight:700}}>AJ</span></div></header>
   <section className="content">
    <div className="eyebrow">SELAMAT DATANG DI WORKSPACE</div><h1>Dashboard RAB Bangunan</h1><p className="sub">Pantau proyek konstruksi, estimasi biaya, dan progres anggaran dalam satu tempat.</p>
    <div className="cards">{stats.map(({label,value,note,icon:Icon})=><div className="card" key={label}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span className="metric-label">{label}</span><Icon size={19} color="#3478dc"/></div><div className="metric-value">{value}</div><div className="metric-foot">{note}</div></div>)}</div>
    <div className="toolbar"><div style={{fontWeight:700,fontSize:16}}>Proyek Terbaru</div><button className="primary"><Plus size={15} style={{verticalAlign:"middle",marginRight:6}}/>Buat Proyek</button></div>
    <div className="panel"><div className="table-wrap"><table><thead><tr><th>KODE</th><th>NAMA PROYEK</th><th>LOKASI</th><th>NILAI RAB</th><th>STATUS</th></tr></thead><tbody>{projects.map(p=><tr key={p.code}><td style={{color:"#2563eb",fontWeight:700}}>{p.code}</td><td style={{fontWeight:600}}>{p.name}</td><td>{p.location}</td><td>{p.budget}</td><td><span className="pill">{p.status}</span></td></tr>)}</tbody></table></div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16,marginTop:18}}>
     <div className="panel"><div className="panel-title"><ClipboardList size={17} style={{verticalAlign:"middle",marginRight:8}}/>Alur penyusunan RAB</div><p className="sub">1. Buat proyek baru</p><p className="sub">2. Tambahkan item pekerjaan dan volume</p><p className="sub">3. Hubungkan analisa AHSP</p><p className="sub">4. Hitung dan cetak rekapitulasi</p></div>
     <div className="panel"><div className="panel-title"><Layers3 size={17} style={{verticalAlign:"middle",marginRight:8}}/>Database terpusat</div><p className="sub">Master material, upah, alat, dan AHSP akan tersimpan pada Google Sheets yang terhubung ke aplikasi.</p><p className="sub">Siapkan koneksi spreadsheet untuk mengaktifkan penyimpanan data.</p></div>
    </div>
   </section>
  </main>
 </div>
}
