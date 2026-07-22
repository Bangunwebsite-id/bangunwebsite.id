'use client';

import { useEffect, useRef } from 'react';

const INVOICE_STYLES = `
#invoice-tool-root {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  color: #222;
}

#invoice-tool-root #editor {
  position: sticky;
  top: 16px;
  align-self: flex-start;
  width: 340px;
  max-height: calc(100vh - 32px);
  flex-shrink: 0;
  background: #1a1f2e;
  color: #e8eaf0;
  padding: 0;
  overflow-y: auto;
  border-radius: 16px;
  z-index: 10;
  box-shadow: 0 12px 32px rgba(15,23,42,0.25);
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  #invoice-tool-root { flex-direction: column; gap: 16px; }
  #invoice-tool-root #editor {
    position: relative;
    top: 0;
    width: 100%;
    max-height: none;
  }
}

#invoice-tool-root #editor-header {
  background: #1A56A5;
  padding: 18px 20px 14px;
  flex-shrink: 0;
}

#invoice-tool-root #editor-header h2 {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}

#invoice-tool-root #editor-header p {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
}

#invoice-tool-root #editor-body {
  padding: 16px 18px;
  flex: 1;
  overflow-y: auto;
}

#invoice-tool-root .section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #6b8cbe;
  margin: 18px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #2a3348;
}

#invoice-tool-root .section-label:first-child { margin-top: 4px; }

#invoice-tool-root .field-group { margin-bottom: 10px; }

#invoice-tool-root .field-group label {
  display: block;
  font-size: 11px;
  color: #a0aec0;
  margin-bottom: 4px;
}

#invoice-tool-root .field-group input,
#invoice-tool-root .field-group textarea,
#invoice-tool-root .field-group select {
  width: 100%;
  background: #252d42;
  border: 1px solid #2e3a54;
  border-radius: 6px;
  color: #e8eaf0;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 7px 10px;
  outline: none;
  transition: border-color .2s;
  resize: vertical;
}

#invoice-tool-root .field-group input:focus,
#invoice-tool-root .field-group textarea:focus,
#invoice-tool-root .field-group select:focus {
  border-color: #1A56A5;
}

#invoice-tool-root #lingkup-list { display: flex; flex-direction: column; gap: 6px; }

#invoice-tool-root .lingkup-item {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

#invoice-tool-root .lingkup-item input {
  flex: 1;
  background: #252d42;
  border: 1px solid #2e3a54;
  border-radius: 6px;
  color: #e8eaf0;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 6px 9px;
  outline: none;
}

#invoice-tool-root .lingkup-item input:focus { border-color: #1A56A5; }

#invoice-tool-root .btn-remove {
  background: #3d1f1f;
  border: none;
  color: #e07070;
  border-radius: 5px;
  width: 26px;
  height: 28px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
  line-height: 1;
}

#invoice-tool-root .btn-remove:hover { background: #5a2020; }

#invoice-tool-root .btn-add-item {
  background: #1e3a60;
  border: 1px dashed #3a6aaa;
  color: #7aade8;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  cursor: pointer;
  width: 100%;
  margin-top: 4px;
  transition: background .2s;
}

#invoice-tool-root .btn-add-item:hover { background: #254a7a; }

#invoice-tool-root .toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #2a3348;
  font-size: 12px;
  color: #c0cce0;
}

#invoice-tool-root .toggle {
  position: relative;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
}

#invoice-tool-root .toggle input { display: none; }

#invoice-tool-root .toggle-track {
  position: absolute;
  inset: 0;
  background: #2a3348;
  border-radius: 20px;
  cursor: pointer;
  transition: background .2s;
}

#invoice-tool-root .toggle input:checked + .toggle-track { background: #1A56A5; }

#invoice-tool-root .toggle-track::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform .2s;
}

#invoice-tool-root .toggle input:checked + .toggle-track::after { transform: translateX(16px); }

#invoice-tool-root #editor-actions {
  padding: 14px 18px;
  border-top: 1px solid #2a3348;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

#invoice-tool-root .btn-print {
  background: #1A56A5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s;
}

#invoice-tool-root .btn-print:hover { background: #144688; }

#invoice-tool-root .btn-reset {
  background: transparent;
  color: #6b8cbe;
  border: 1px solid #2e3a54;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  cursor: pointer;
}

#invoice-tool-root #preview-wrap {
  flex: 1;
  min-width: 0;
  padding: 16px 0 32px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

@media (max-width: 900px) {
  #invoice-tool-root #preview-wrap { width: 100%; padding: 0 0 32px; }
}

#invoice-tool-root #doc-pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

#invoice-tool-root .doc-block {
  overflow: hidden;
}

#invoice-tool-root .doc-page {
  background: #fff;
  width: 794px;
  min-height: 1123px;
  padding: 36px 40px 48px;
  box-shadow: 0 4px 32px rgba(0,0,0,.15);
  border-radius: 4px;
}

#invoice-tool-root .doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 10px;
  border-bottom: 3px solid #1A56A5;
  margin-bottom: 14px;
}

#invoice-tool-root .header-left img {
  height: 52px;
  display: block;
  margin-bottom: 6px;
}

#invoice-tool-root .header-left .tagline { font-size: 11px; color: #666; margin-bottom: 2px; }
#invoice-tool-root .header-left .contact { font-size: 11px; color: #888; line-height: 1.5; }

#invoice-tool-root .header-right {
  text-align: right;
  border-left: 3px solid #1A56A5;
  padding-left: 18px;
  flex-shrink: 0;
}

#invoice-tool-root .header-right .sp-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A56A5;
  letter-spacing: 1px;
}

#invoice-tool-root .header-right .sp-meta { font-size: 11px; color: #555; margin-top: 2px; }

#invoice-tool-root .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
#invoice-tool-root .meta-table td { padding: 3px 0; font-size: 12.5px; vertical-align: top; }
#invoice-tool-root .meta-table td:first-child { font-weight: 700; width: 130px; white-space: nowrap; }
#invoice-tool-root .meta-table td:nth-child(2) { width: 12px; padding: 3px 6px; }
#invoice-tool-root .meta-table .perihal-val { color: #1A56A5; font-weight: 700; }

#invoice-tool-root .pembuka { font-size: 12.5px; line-height: 1.6; margin-bottom: 10px; }
#invoice-tool-root .pembuka p { margin-bottom: 8px; }

#invoice-tool-root .sec-title {
  font-size: 13px;
  font-weight: 700;
  color: #1A56A5;
  margin: 10px 0 6px;
  padding-bottom: 4px;
}

#invoice-tool-root .data-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; font-size: 12px; }
#invoice-tool-root .data-table th {
  background: #1A56A5;
  color: #fff;
  padding: 7px 10px;
  text-align: left;
  font-weight: 700;
}

#invoice-tool-root .data-table th.center, #invoice-tool-root .data-table td.center { text-align: center; }
#invoice-tool-root .data-table th.right,  #invoice-tool-root .data-table td.right  { text-align: right; }

#invoice-tool-root .data-table td { padding: 5px 10px; border-bottom: 1px solid #e0e8f5; }
#invoice-tool-root .data-table tr:nth-child(odd)  td { background: #f0f6ff; }
#invoice-tool-root .data-table tr:nth-child(even) td { background: #fff; }
#invoice-tool-root .data-table tr.total-row td { background: #1A56A5 !important; color: #fff; font-weight: 700; }
#invoice-tool-root .data-table .green { color: #27ae60; }

#invoice-tool-root .ket-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 4px; }
#invoice-tool-root .ket-table td { padding: 5px 10px; border-bottom: 1px solid #e0e8f5; }
#invoice-tool-root .ket-table td:first-child { font-weight: 700; background: #ebf3ff; width: 175px; white-space: nowrap; }
#invoice-tool-root .ket-table td:last-child { background: #fff; }

#invoice-tool-root .paket-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0 14px; }

#invoice-tool-root .paket-card {
  border: 1.5px solid #d0ddef;
  border-radius: 10px;
  overflow: hidden;
  font-size: 11.5px;
}

#invoice-tool-root .paket-card-header {
  padding: 12px 14px 8px;
  text-align: center;
}

#invoice-tool-root .paket-card .paket-name { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
#invoice-tool-root .paket-card .paket-price { font-weight: 700; font-size: 16px; margin-bottom: 0; }

#invoice-tool-root .paket-card.recom { border-color: #1A56A5; }
#invoice-tool-root .paket-card.recom .paket-card-header { background: #f0f6ff; }
#invoice-tool-root .paket-card.recom .paket-name { color: #1A56A5; }
#invoice-tool-root .paket-card.recom .paket-price { color: #1A56A5; }

#invoice-tool-root .paket-card.premium .paket-card-header { background: #f8f8f8; }
#invoice-tool-root .paket-card.premium .paket-name { color: #333; }
#invoice-tool-root .paket-card.premium .paket-price { color: #333; }

#invoice-tool-root .recom-badge {
  background: #1A56A5;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 0;
  text-align: center;
  letter-spacing: .5px;
}

#invoice-tool-root .paket-features { padding: 8px 14px 10px; list-style: none; }
#invoice-tool-root .paket-features li { padding: 3px 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 6px; }
#invoice-tool-root .paket-features li:last-child { border-bottom: none; }
#invoice-tool-root .paket-features li::before { content: '✓'; color: #1A56A5; font-weight: 700; flex-shrink: 0; }

#invoice-tool-root .penutup { font-size: 12.5px; line-height: 1.6; margin: 10px 0 6px; }
#invoice-tool-root .ttd-block { margin-top: 24px; font-size: 12.5px; }
#invoice-tool-root .ttd-block .hormat { margin-bottom: 32px; }
#invoice-tool-root .ttd-block .nama { font-weight: 700; margin-bottom: 0; }
#invoice-tool-root .ttd-block .brand { color: #1A56A5; font-weight: 700; }
#invoice-tool-root .ttd-block .kontak { color: #555; font-size: 11.5px; }

@page {
  size: A4;
  margin: 0;
}

@media print {
  html, body, #invoice-tool-root, #invoice-tool-root * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  body { background: #fff; }
  #invoice-tool-root { gap: 0; }
  #invoice-tool-root #editor { display: none; }
  #invoice-tool-root #preview-wrap { padding: 0; }
  #invoice-tool-root #doc-pages { gap: 0; }
  #invoice-tool-root .doc-page {
    box-shadow: none;
    border-radius: 0;
    width: 100%;
    min-height: 0;
    break-after: page;
    page-break-after: always;
  }
  #invoice-tool-root .doc-page:last-child {
    break-after: auto;
    page-break-after: auto;
  }
  #invoice-tool-root .doc-block,
  #invoice-tool-root .data-table tr,
  #invoice-tool-root .ket-table tr,
  #invoice-tool-root .paket-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  #invoice-tool-root .paket-grid { break-inside: avoid; page-break-inside: avoid; }
  [data-admin-shell-aside], [data-admin-shell-header] { display: none !important; }
  [data-admin-shell-content] { padding-left: 0 !important; }
}
`;

const INVOICE_BODY_HTML = `
<aside id="editor">
  <div id="editor-header">
    <h2>✏️ Editor Surat Penawaran</h2>
    <p>Edit kolom lalu lihat hasilnya langsung</p>
  </div>

  <div id="editor-body">

    <div class="section-label">Identitas Pengirim</div>

    <div class="field-group">
      <label>Nama Brand</label>
      <input type="text" id="f-brand" value="Bangunwebsite.id">
    </div>
    <div class="field-group">
      <label>Tagline</label>
      <input type="text" id="f-tagline" value="Developer Website & IT Consultant">
    </div>
    <div class="field-group">
      <label>Email</label>
      <input type="text" id="f-email" value="muhakbar1141@gmail.com">
    </div>
    <div class="field-group">
      <label>No. WhatsApp / HP</label>
      <input type="text" id="f-phone" value="0812-4817-5090">
    </div>
    <div class="field-group">
      <label>Kota</label>
      <input type="text" id="f-kota" value="Makassar, Sulawesi Selatan">
    </div>
    <div class="field-group">
      <label>Nama Penanda Tangan</label>
      <input type="text" id="f-nama" value="Muhammad Akbar">
    </div>

    <div class="section-label">Info Surat</div>

    <div class="field-group">
      <label>No. Surat</label>
      <input type="text" id="f-nosurat" value="SP-2607-001">
    </div>
    <div class="field-group">
      <label>Tanggal</label>
      <input type="date" id="f-tanggal">
    </div>

    <div class="section-label">Data Klien</div>

    <div class="field-group">
      <label>Nama Klien / Perusahaan</label>
      <input type="text" id="f-klien" value="Prima Event">
    </div>
    <div class="field-group">
      <label>Alamat Klien</label>
      <textarea id="f-alamat" rows="3">Jl. Waduk Tunggu Pampang Jl. Bitoa Lama, Antang, Kec. Manggala, Kota Makassar, Sulawesi Selatan 90231</textarea>
    </div>

    <div class="section-label">Perihal & Pembuka</div>

    <div class="field-group">
      <label>Perihal Surat</label>
      <input type="text" id="f-perihal" value="Penawaran Pembuatan Website dan Sistem Perusahaan">
    </div>
    <div class="field-group">
      <label>Kalimat Pembuka</label>
      <textarea id="f-pembuka" rows="3">Melalui surat penawaran ini, kami dari Bangunwebsite.id menawarkan jasa pembuatan website dan sistem digital untuk mendukung operasional perusahaan Anda secara lebih efisien, profesional, dan terukur.</textarea>
    </div>

    <div class="section-label">Lingkup Pekerjaan</div>

    <div id="lingkup-list">
      <div class="lingkup-item"><input type="text" value="Landing page perusahaan dan product"><button class="btn-remove">×</button></div>
      <div class="lingkup-item"><input type="text" value="Sistem perusahaan: Absensi"><button class="btn-remove">×</button></div>
      <div class="lingkup-item"><input type="text" value="Sistem perusahaan: Perhitungan otomatis KPI &amp; slip gaji karyawan"><button class="btn-remove">×</button></div>
      <div class="lingkup-item"><input type="text" value="Sistem perusahaan: Invoice/surat penawaran otomatis untuk customer (menggunakan template perusahaan)"><button class="btn-remove">×</button></div>
      <div class="lingkup-item"><input type="text" value="Sistem perusahaan: Pencatatan revenue perusahaan (lihat harian &amp; performa bulanan, export dokumen)"><button class="btn-remove">×</button></div>
    </div>
    <button class="btn-add-item">+ Tambah Item</button>

    <div class="section-label">Harga</div>

    <div class="field-group">
      <label>Deskripsi Layanan</label>
      <input type="text" id="f-deskripsiharga" value="Pengembangan Website & Sistem Perusahaan (5 modul)">
    </div>
    <div class="field-group">
      <label>Qty</label>
      <input type="text" id="f-qty" value="1 Paket">
    </div>
    <div class="field-group">
      <label>Total Harga</label>
      <input type="text" id="f-harga" value="Rp 3.500.000">
    </div>

    <div class="section-label">Ketentuan</div>

    <div class="field-group">
      <label>Estimasi Pengerjaan</label>
      <input type="text" id="f-estimasi" value="5 – 14 hari kerja setelah DP diterima">
    </div>
    <div class="field-group">
      <label>Pembayaran</label>
      <input type="text" id="f-pembayaran" value="DP Rp 500.000 di awal, pelunasan setelah semua selesai">
    </div>
    <div class="field-group">
      <label>Revisi</label>
      <input type="text" id="f-revisi" value="Maksimal 5x revisi dalam masa pengerjaan">
    </div>
    <div class="field-group">
      <label>Source Code</label>
      <input type="text" id="f-sourcecode" value="Diserahkan ke klien setelah pelunasan">
    </div>
    <div class="field-group">
      <label>Masa Berlaku Penawaran</label>
      <input type="text" id="f-masaberlaku" value="14 hari kalender sejak tanggal surat ini">
    </div>

    <div class="section-label">Optional</div>

    <div class="toggle-row">
      <span>Tampilkan Paket Maintener</span>
      <label class="toggle">
        <input type="checkbox" id="tog-optional" checked>
        <span class="toggle-track"></span>
      </label>
    </div>

  </div>

  <div id="editor-actions">
    <button class="btn-print">🖨️ Cetak / Simpan PDF</button>
    <button class="btn-reset">↺ Reset ke Default</button>
  </div>
</aside>

<div id="preview-wrap">
  <div id="doc-pages">
    <div class="doc-page">

    <div class="doc-block doc-header">
      <div class="header-left">
        <img src="/bangun-website.png" alt="Bangunwebsite.id" id="doc-logo">
        <div class="tagline" id="doc-tagline">Developer Website &amp; IT Consultant</div>
        <div class="contact">
          <span id="doc-email">muhakbar1141@gmail.com</span> &nbsp;|&nbsp;
          <span id="doc-phone">0812-4817-5090</span><br>
          <span id="doc-kota">Makassar, Sulawesi Selatan</span>
        </div>
      </div>
      <div class="header-right">
        <div class="sp-title">SURAT PENAWARAN</div>
        <div class="sp-meta">No: <span id="doc-nosurat">SP-2607-001</span></div>
        <div class="sp-meta" id="doc-tanggal"></div>
      </div>
    </div>

    <table class="doc-block meta-table">
      <tr><td>Kepada Yth.</td><td>:</td><td><strong id="doc-klien">Prima Event</strong></td></tr>
      <tr><td>Alamat</td><td>:</td><td id="doc-alamat">Jl. Waduk Tunggu Pampang Jl. Bitoa Lama, Antang, Kec. Manggala, Kota Makassar, Sulawesi Selatan 90231</td></tr>
      <tr><td>Perihal</td><td>:</td><td class="perihal-val" id="doc-perihal">Penawaran Pembuatan Website dan Sistem Perusahaan</td></tr>
    </table>

    <div class="doc-block pembuka">
      <p>Dengan hormat,</p>
      <p id="doc-pembuka">Melalui surat penawaran ini, kami dari Bangunwebsite.id menawarkan jasa pembuatan website dan sistem digital untuk mendukung operasional perusahaan Anda secara lebih efisien, profesional, dan terukur.</p>
    </div>

    <div class="doc-block">
      <div class="sec-title">Lingkup Pekerjaan</div>
      <table class="data-table">
        <thead><tr><th style="width:40px" class="center">No</th><th>Lingkup Pekerjaan</th></tr></thead>
        <tbody id="doc-lingkup"></tbody>
      </table>
    </div>

    <div class="doc-block">
      <div class="sec-title">Rincian Biaya</div>
      <table class="data-table">
        <thead><tr><th>Deskripsi</th><th style="width:90px" class="center">Qty</th><th style="width:110px" class="right">Harga</th></tr></thead>
        <tbody>
          <tr><td id="doc-deskripsiharga">Pengembangan Website &amp; Sistem Perusahaan (5 modul)</td><td class="center" id="doc-qty">1 Paket</td><td class="right" id="doc-harga">Rp 3.500.000</td></tr>
          <tr><td>Training &amp; Serah Terima (1 sesi online)</td><td class="center">1 Sesi</td><td class="right green">Gratis</td></tr>
          <tr class="total-row"><td><strong>TOTAL</strong></td><td></td><td class="right" id="doc-total">Rp 3.500.000</td></tr>
        </tbody>
      </table>
    </div>

    <div class="doc-block">
      <div class="sec-title">Ketentuan &amp; Syarat</div>
      <table class="ket-table">
        <tr><td>Estimasi Pengerjaan</td><td id="doc-estimasi">5 – 14 hari kerja setelah DP diterima</td></tr>
        <tr><td>Pembayaran</td><td id="doc-pembayaran">DP Rp 500.000 di awal, pelunasan setelah semua selesai</td></tr>
        <tr><td>Revisi</td><td id="doc-revisi">Maksimal 5x revisi dalam masa pengerjaan</td></tr>
        <tr><td>Source Code</td><td id="doc-sourcecode">Diserahkan ke klien setelah pelunasan</td></tr>
        <tr><td>Masa Berlaku</td><td id="doc-masaberlaku">14 hari kalender sejak tanggal surat ini</td></tr>
      </table>
    </div>

    <div id="section-optional" class="doc-block">
      <div class="sec-title">Optional: Paket Maintener &amp; IT Consultant</div>
      <p style="font-size:12px;color:#555;margin-bottom:10px;">Tersedia paket lanjutan untuk menjaga performa dan pengembangan berkelanjutan sistem Anda. Semua layanan dapat diakses dan dikomunikasikan via WhatsApp.</p>
      <div class="paket-grid">
        <div class="paket-card recom">
          <div class="paket-card-header">
            <div style="font-size:18px;margin-bottom:4px;">👍</div>
            <div class="paket-name">Paket Maintener</div>
            <div class="paket-price">Rp 500.000 / bulan</div>
          </div>
          <div class="recom-badge">👍 DIREKOMENDASIKAN</div>
          <ul class="paket-features">
            <li>Update berkala website</li>
            <li>Penambahan 2 fitur per bulan sesuai kebutuhan</li>
            <li>Optimasi SEO</li>
            <li>Blog SEO</li>
            <li>Google Analytics setup &amp; monitoring</li>
            <li>Setup Ads (Google/Meta)</li>
            <li>Komunikasi &amp; konsultasi via WhatsApp</li>
          </ul>
        </div>
        <div class="paket-card premium">
          <div class="paket-card-header">
            <div class="paket-name">Paket IT Consultant Aktif</div>
            <div class="paket-price">Rp 1.500.000 / bulan</div>
          </div>
          <ul class="paket-features">
            <li>Semua yang ada di Paket Rp 500.000/bulan</li>
            <li>Analisis aktif kebutuhan bisnis</li>
            <li>Eksekusi pengembangan setelah disetujui klien</li>
            <li>Prioritas pengerjaan (response &amp; delivery lebih cepat)</li>
            <li>Konsultasi IT strategis rutin</li>
          </ul>
        </div>
      </div>
    </div>

    <p class="doc-block penutup">Kami sangat terbuka untuk diskusi lebih lanjut mengenai kebutuhan spesifik perusahaan Anda. Silakan hubungi kami melalui WhatsApp atau email untuk koordinasi lebih lanjut.</p>

    <div class="doc-block ttd-block">
      <p class="hormat">Hormat kami,</p>
      <p class="nama" id="doc-nama">Muhammad Akbar</p>
      <p class="brand" id="doc-brand-ttd">Bangunwebsite.id</p>
      <p class="kontak"><span id="doc-phone-ttd">0812-4817-5090</span> &nbsp;|&nbsp; <span id="doc-email-ttd">muhakbar1141@gmail.com</span></p>
    </div>

    </div>
  </div>
</div>
`;

export function InvoicePanel() {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return;
        }

        const byId = (id: string) => root.querySelector<HTMLElement>(`#${id}`);
        const v = (id: string) => (byId(id) as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';

        function formatDate(val: string) {
            if (!val) return '';
            const d = new Date(`${val}T00:00:00`);
            return d.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }

        const setText = (id: string, text: string) => {
            const el = byId(id);
            if (el) el.textContent = text;
        };

        const bindings: Array<[string, () => void]> = [
            ['f-brand', () => setText('doc-brand-ttd', v('f-brand'))],
            ['f-tagline', () => setText('doc-tagline', v('f-tagline'))],
            [
                'f-email',
                () => {
                    setText('doc-email', v('f-email'));
                    setText('doc-email-ttd', v('f-email'));
                },
            ],
            [
                'f-phone',
                () => {
                    setText('doc-phone', v('f-phone'));
                    setText('doc-phone-ttd', v('f-phone'));
                },
            ],
            ['f-kota', () => setText('doc-kota', v('f-kota'))],
            ['f-nama', () => setText('doc-nama', v('f-nama'))],
            ['f-nosurat', () => setText('doc-nosurat', v('f-nosurat'))],
            ['f-tanggal', () => setText('doc-tanggal', formatDate(v('f-tanggal')))],
            ['f-klien', () => setText('doc-klien', v('f-klien'))],
            ['f-alamat', () => setText('doc-alamat', v('f-alamat'))],
            ['f-perihal', () => setText('doc-perihal', v('f-perihal'))],
            ['f-pembuka', () => setText('doc-pembuka', v('f-pembuka'))],
            [
                'f-deskripsiharga',
                () => setText('doc-deskripsiharga', v('f-deskripsiharga')),
            ],
            ['f-qty', () => setText('doc-qty', v('f-qty'))],
            [
                'f-harga',
                () => {
                    setText('doc-harga', v('f-harga'));
                    setText('doc-total', v('f-harga'));
                },
            ],
            ['f-estimasi', () => setText('doc-estimasi', v('f-estimasi'))],
            ['f-pembayaran', () => setText('doc-pembayaran', v('f-pembayaran'))],
            ['f-revisi', () => setText('doc-revisi', v('f-revisi'))],
            ['f-sourcecode', () => setText('doc-sourcecode', v('f-sourcecode'))],
            ['f-masaberlaku', () => setText('doc-masaberlaku', v('f-masaberlaku'))],
            [
                'tog-optional',
                () => {
                    const section = byId('section-optional');
                    const toggle = byId('tog-optional') as HTMLInputElement | null;
                    if (section && toggle) {
                        section.style.display = toggle.checked ? '' : 'none';
                    }
                },
            ],
        ];

        function syncLingkup() {
            const inputs = root!.querySelectorAll<HTMLInputElement>(
                '#lingkup-list .lingkup-item input'
            );
            const tbody = byId('doc-lingkup');
            if (!tbody) return;
            tbody.innerHTML = '';
            inputs.forEach((inp, i) => {
                const tr = document.createElement('tr');
                const tdNo = document.createElement('td');
                tdNo.className = 'center';
                tdNo.textContent = String(i + 1);
                const tdVal = document.createElement('td');
                tdVal.textContent = inp.value;
                tr.appendChild(tdNo);
                tr.appendChild(tdVal);
                tbody.appendChild(tr);
            });
            requestPaginate();
        }

        function addItem() {
            const list = byId('lingkup-list');
            if (!list) return;
            const div = document.createElement('div');
            div.className = 'lingkup-item';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Lingkup pekerjaan...';
            input.addEventListener('input', syncLingkup);

            const button = document.createElement('button');
            button.className = 'btn-remove';
            button.type = 'button';
            button.textContent = '×';
            button.addEventListener('click', () => {
                div.remove();
                syncLingkup();
            });

            div.appendChild(input);
            div.appendChild(button);
            list.appendChild(div);
            input.focus();
            syncLingkup();
        }

        function resetForm() {
            if (window.confirm('Reset semua field ke nilai default?')) {
                window.location.reload();
            }
        }

        // A4 @ 96dpi = 794 x 1123px. Doc padding is 36px top / 48px bottom.
        const PAGE_HEIGHT = 1123;
        const PAGE_CONTENT_HEIGHT = PAGE_HEIGHT - 36 - 48;

        function createPageEl() {
            const page = document.createElement('div');
            page.className = 'doc-page';
            return page;
        }

        function paginateDoc() {
            const pagesContainer = byId('doc-pages');
            if (!pagesContainer) return;

            const blocks = Array.from(
                root!.querySelectorAll<HTMLElement>('.doc-block')
            );

            pagesContainer.innerHTML = '';

            let currentPage = createPageEl();
            pagesContainer.appendChild(currentPage);
            let usedHeight = 0;

            blocks.forEach((block) => {
                currentPage.appendChild(block);
                const blockHeight = block.offsetHeight;

                if (usedHeight + blockHeight > PAGE_CONTENT_HEIGHT && usedHeight > 0) {
                    currentPage.removeChild(block);
                    currentPage = createPageEl();
                    pagesContainer.appendChild(currentPage);
                    currentPage.appendChild(block);
                    usedHeight = blockHeight;
                } else {
                    usedHeight += blockHeight;
                }
            });
        }

        let paginateScheduled = false;
        function requestPaginate() {
            if (paginateScheduled) return;
            paginateScheduled = true;
            requestAnimationFrame(() => {
                paginateScheduled = false;
                paginateDoc();
            });
        }

        const cleanups: Array<() => void> = [];

        bindings.forEach(([id, fn]) => {
            const el = byId(id);
            if (!el) return;
            const handler = () => {
                fn();
                requestPaginate();
            };
            el.addEventListener('input', handler);
            el.addEventListener('change', handler);
            cleanups.push(() => {
                el.removeEventListener('input', handler);
                el.removeEventListener('change', handler);
            });
        });

        const lingkupList = byId('lingkup-list');
        lingkupList?.addEventListener('input', syncLingkup);
        cleanups.push(() => lingkupList?.removeEventListener('input', syncLingkup));

        root
            .querySelectorAll<HTMLButtonElement>('#lingkup-list .btn-remove')
            .forEach((btn) => {
                const handler = () => {
                    btn.parentElement?.remove();
                    syncLingkup();
                };
                btn.addEventListener('click', handler);
                cleanups.push(() => btn.removeEventListener('click', handler));
            });

        const addBtn = root.querySelector<HTMLButtonElement>('.btn-add-item');
        addBtn?.addEventListener('click', addItem);
        cleanups.push(() => addBtn?.removeEventListener('click', addItem));

        const printBtn = root.querySelector<HTMLButtonElement>('.btn-print');
        const handlePrint = () => window.print();
        printBtn?.addEventListener('click', handlePrint);
        cleanups.push(() => printBtn?.removeEventListener('click', handlePrint));

        const resetBtn = root.querySelector<HTMLButtonElement>('.btn-reset');
        resetBtn?.addEventListener('click', resetForm);
        cleanups.push(() => resetBtn?.removeEventListener('click', resetForm));

        // Default tanggal & nomor surat berdasarkan hari ini.
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const tanggalInput = byId('f-tanggal') as HTMLInputElement | null;
        if (tanggalInput) tanggalInput.value = todayStr;
        setText(
            'doc-tanggal',
            today.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        );

        const yy = String(today.getFullYear()).slice(2);
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const nosurat = `SP-${yy}${mm}-001`;
        const nosuratInput = byId('f-nosurat') as HTMLInputElement | null;
        if (nosuratInput) nosuratInput.value = nosurat;
        setText('doc-nosurat', nosurat);

        syncLingkup();

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, []);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: INVOICE_STYLES }} />
            <div
                id='invoice-tool-root'
                ref={rootRef}
                dangerouslySetInnerHTML={{ __html: INVOICE_BODY_HTML }}
            />
        </>
    );
}
