const STORAGE_KEY = "rabBangunanDetailedV2";

const form = document.getElementById("rab-form");
const bodyEl = document.getElementById("item-body");
const grandTotalEl = document.getElementById("grand-total");
const exportBtn = document.getElementById("export-csv");
const printBtn = document.getElementById("print-pdf");
const clearBtn = document.getElementById("clear-all");
const totalItemEl = document.getElementById("total-item");
const totalVolumeEl = document.getElementById("total-volume");
const totalQtyEl = document.getElementById("total-qty");
const projectNameEl = document.getElementById("project-name");
const projectLocationEl = document.getElementById("project-location");

let state = loadState();
let items = state.items;

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function toNumber(value) {
  return Number.parseFloat(value) || 0;
}

function calculateVolume(item) {
  return item.panjang * item.lebar * item.tinggi;
}

function calculateQty(item) {
  return calculateVolume(item) * item.koefisien;
}

function calculateTotal(item) {
  return calculateQty(item) * item.harga;
}

function saveState() {
  state = {
    projectName: projectNameEl.value.trim(),
    projectLocation: projectLocationEl.value.trim(),
    items,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { projectName: "", projectLocation: "", items: [] };

  try {
    const parsed = JSON.parse(raw);
    return {
      projectName: parsed?.projectName || "",
      projectLocation: parsed?.projectLocation || "",
      items: Array.isArray(parsed?.items) ? parsed.items : [],
    };
  } catch {
    return { projectName: "", projectLocation: "", items: [] };
  }
}

function hydrateProjectInfo() {
  projectNameEl.value = state.projectName;
  projectLocationEl.value = state.projectLocation;
}

function render() {
  bodyEl.innerHTML = "";

  if (!items.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="14" style="text-align:center;color:#6b7280;">Belum ada item. Tambahkan item pekerjaan terlebih dahulu.</td>`;
    bodyEl.appendChild(row);
  }

  let grand = 0;
  let totalVolume = 0;
  let totalQty = 0;

  items.forEach((item, index) => {
    const volume = calculateVolume(item);
    const qty = calculateQty(item);
    const total = calculateTotal(item);

    totalVolume += volume;
    totalQty += qty;
    grand += total;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.kategori}</td>
      <td>${item.nama}</td>
      <td>${item.panjang}</td>
      <td>${item.lebar}</td>
      <td>${item.tinggi}</td>
      <td>${volume.toFixed(2)} m³</td>
      <td>${item.koefisien}</td>
      <td>${qty.toFixed(2)}</td>
      <td>${item.satuan}</td>
      <td>${formatRupiah(item.harga)}</td>
      <td>${formatRupiah(total)}</td>
      <td>${item.keterangan || "-"}</td>
      <td><button type="button" class="danger" data-index="${index}">Hapus</button></td>
    `;
    bodyEl.appendChild(tr);
  });

  totalItemEl.textContent = String(items.length);
  totalVolumeEl.textContent = `${totalVolume.toFixed(2)} m³`;
  totalQtyEl.textContent = totalQty.toFixed(2);
  grandTotalEl.textContent = formatRupiah(grand);
}

function addItem(event) {
  event.preventDefault();

  const item = {
    kategori: document.getElementById("kategori").value.trim(),
    nama: document.getElementById("nama").value.trim(),
    panjang: toNumber(document.getElementById("panjang").value),
    lebar: toNumber(document.getElementById("lebar").value),
    tinggi: toNumber(document.getElementById("tinggi").value),
    koefisien: toNumber(document.getElementById("koefisien").value),
    satuan: document.getElementById("satuan").value.trim(),
    harga: toNumber(document.getElementById("harga").value),
    keterangan: document.getElementById("keterangan").value.trim(),
  };

  if (
    !item.kategori ||
    !item.nama ||
    !item.satuan ||
    item.panjang <= 0 ||
    item.lebar <= 0 ||
    item.tinggi <= 0 ||
    item.koefisien <= 0 ||
    item.harga < 0
  ) {
    alert("Mohon isi semua input wajib dengan nilai yang valid.");
    return;
  }

  items.push(item);
  saveState();
  render();
  form.reset();
  document.getElementById("koefisien").value = 1;
  document.getElementById("satuan").value = "m3";
}

function deleteItem(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const index = target.dataset.index;
  if (index === undefined) return;

  items.splice(Number(index), 1);
  saveState();
  render();
}

function clearAll() {
  if (!items.length) return;
  const confirmed = confirm("Hapus semua item RAB?");
  if (!confirmed) return;

  items = [];
  saveState();
  render();
}

function exportCSV() {
  const metadata = [
    ["Nama Proyek", projectNameEl.value.trim() || "-"],
    ["Lokasi", projectLocationEl.value.trim() || "-"],
    ["Tanggal Export", new Date().toLocaleString("id-ID")],
    [],
  ];

  const headers = [
    "No",
    "Kategori",
    "Item Pekerjaan",
    "Panjang (m)",
    "Lebar (m)",
    "Tinggi (m)",
    "Volume (m3)",
    "Koefisien",
    "Qty",
    "Satuan",
    "Harga Satuan (Rp)",
    "Total (Rp)",
    "Keterangan",
  ];

  const rows = items.map((item, index) => {
    const volume = calculateVolume(item);
    const qty = calculateQty(item);
    const total = calculateTotal(item);

    return [
      index + 1,
      item.kategori,
      item.nama,
      item.panjang,
      item.lebar,
      item.tinggi,
      volume.toFixed(2),
      item.koefisien,
      qty.toFixed(2),
      item.satuan,
      item.harga,
      total.toFixed(0),
      item.keterangan || "-",
    ];
  });

  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item), 0);
  rows.push(["", "", "", "", "", "", "", "", "", "", "Grand Total", grandTotal.toFixed(0), ""]);

  const allRows = [...metadata, headers, ...rows];
  const content = allRows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rab-bangunan-detail.csv";
  link.click();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", addItem);
bodyEl.addEventListener("click", deleteItem);
clearBtn.addEventListener("click", clearAll);
exportBtn.addEventListener("click", exportCSV);
printBtn.addEventListener("click", () => window.print());
projectNameEl.addEventListener("input", saveState);
projectLocationEl.addEventListener("input", saveState);

hydrateProjectInfo();
render();
