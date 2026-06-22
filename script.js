(() => {
  "use strict";

  const STORAGE_KEYS = {
    saved: "spk_jagung_saw_saved_v3",
    trash: "spk_jagung_saw_trash_v3",
  };

  const defaultAlternatives = [
    { id: genId(), name: "Jagung Manis Premium", c1: 5, c2: 5, c3: 4, c4: 2 },
    { id: genId(), name: "Jagung Hibrida", c1: 4, c2: 4, c3: 5, c4: 3 },
    { id: genId(), name: "Jagung Unggul", c1: 4, c2: 5, c3: 3, c4: 2 },
    { id: genId(), name: "Jagung Lokal", c1: 3, c2: 3, c3: 4, c4: 1 },
    { id: genId(), name: "Jagung Super", c1: 5, c2: 4, c3: 5, c4: 4 },
    { id: genId(), name: "Jagung Tahan Simpan", c1: 3, c2: 4, c3: 5, c4: 2 },
    { id: genId(), name: "Jagung Rasa Manis", c1: 4, c2: 5, c3: 4, c4: 3 },
    { id: genId(), name: "Jagung Ekonomis", c1: 2, c2: 3, c3: 3, c4: 1 },
    { id: genId(), name: "Jagung Pasar", c1: 4, c2: 4, c3: 4, c4: 2 },
    { id: genId(), name: "Jagung Farm", c1: 5, c2: 4, c3: 5, c4: 3 },
    { id: genId(), name: "Jagung Piko", c1: 3, c2: 5, c3: 4, c4: 2 },
    { id: genId(), name: "Jagung Kebus", c1: 4, c2: 4, c3: 3, c4: 1 },
    { id: genId(), name: "Jagung Dessert", c1: 5, c2: 5, c3: 4, c4: 4 },
    { id: genId(), name: "Jagung Welo", c1: 3, c2: 3, c3: 4, c4: 2 },
    { id: genId(), name: "Jagung Mina", c1: 5, c2: 5, c3: 5, c4: 2 },
  ];

  const criteria = [
    { code: "C1", name: "Ukuran Buah", type: "Benefit", weight: 0.25, desc: "Semakin besar ukuran buah, semakin baik." },
    { code: "C2", name: "Tingkat Kemanisan", type: "Benefit", weight: 0.30, desc: "Semakin manis, semakin disukai konsumen." },
    { code: "C3", name: "Ketahanan Penyimpanan", type: "Benefit", weight: 0.25, desc: "Semakin tahan simpan, semakin baik." },
    { code: "C4", name: "Harga Bibit", type: "Cost", weight: 0.20, desc: "Semakin murah harga bibit, semakin baik." },
  ];

  const rules = {
    C1: [[1, "Sangat kecil"], [2, "Kecil"], [3, "Sedang"], [4, "Besar"], [5, "Sangat besar"]],
    C2: [[1, "Sangat kurang manis"], [2, "Kurang manis"], [3, "Cukup manis"], [4, "Manis"], [5, "Sangat manis"]],
    C3: [[1, "Sangat rendah"], [2, "Rendah"], [3, "Sedang"], [4, "Tahan"], [5, "Sangat tahan"]],
    C4: [[1, "Sangat murah"], [2, "Murah"], [3, "Sedang"], [4, "Mahal"], [5, "Sangat mahal"]],
  };

  const el = {
    navbar: document.getElementById("navbar"),
    menuToggle: document.getElementById("menuToggle"),
    pages: Array.from(document.querySelectorAll(".page")),
    navLinks: Array.from(document.querySelectorAll(".nav-link")),
    profileLogo: document.getElementById("profileLogo"),
    criteriaCards: document.getElementById("criteriaCards"),
    rulesGrid: document.getElementById("rulesGrid"),
    jenisTableBody: document.getElementById("jenisTableBody"),
    searchJenis: document.getElementById("searchJenis"),
    alternativeForm: document.getElementById("alternativeForm"),
    editId: document.getElementById("editId"),
    namaAlternatif: document.getElementById("namaAlternatif"),
    c1: document.getElementById("c1"),
    c2: document.getElementById("c2"),
    c3: document.getElementById("c3"),
    c4: document.getElementById("c4"),
    saveButton: document.getElementById("saveButton"),
    saveDataBtn: document.getElementById("saveDataBtn"),
    resetForm: document.getElementById("resetForm"),
    deleteSelected: document.getElementById("deleteSelected"),
    trashList: document.getElementById("trashList"),
    searchAlternatif: document.getElementById("searchAlternatif"),
    sortAlternatif: document.getElementById("sortAlternatif"),
    selectAll: document.getElementById("selectAll"),
    alternatifTableBody: document.getElementById("alternatifTableBody"),
    stepList: document.getElementById("stepList"),
    matrixAwalWrap: document.getElementById("matrixAwalWrap"),
    matrixNormalisasiWrap: document.getElementById("matrixNormalisasiWrap"),
    preferensiWrap: document.getElementById("preferensiWrap"),
    hasilTableBody: document.getElementById("hasilTableBody"),
    searchHasil: document.getElementById("searchHasil"),
    printResult: document.getElementById("printResult"),
    downloadPdf: document.getElementById("downloadPdf"),
    downloadJson: document.getElementById("downloadJson"),
    refreshChart: document.getElementById("refreshChart"),
    resultChart: document.getElementById("resultChart"),
    statAlternatif: document.getElementById("statAlternatif"),
    statKriteria: document.getElementById("statKriteria"),
    statBobot: document.getElementById("statBobot"),
    statTerbaik: document.getElementById("statTerbaik"),
    bestName: document.getElementById("bestName"),
    bestScore: document.getElementById("bestScore"),
    bestMedal: document.getElementById("bestMedal"),
    weightFill: document.getElementById("weightFill"),
    toastContainer: document.getElementById("toastContainer"),
  };

  let workingAlternatives = loadWorkingAlternatives();
  let trashAlternatives = loadTrashAlternatives();
  let dirty = false;
  let currentSearch = { jenis: "", alternatif: "", hasil: "" };
  let sortState = { key: "name", dir: "asc" };
  let selectedIds = new Set();

  init();

  function init() {
    renderSelectOptions();
    renderCriteriaCards();
    renderRulesGrid();
    renderJenisTable();
    renderTrashList();
    renderAll();
    bindEvents();
    const startPage = location.hash.replace("#", "") || "beranda";
    showPage(startPage, false);
  }

  function bindEvents() {
    el.menuToggle.addEventListener("click", toggleNavbar);

    el.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(link.dataset.page, true);
        closeNavbar();
      });
    });

    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => showPage(btn.dataset.go, true));
    });

    el.searchJenis.addEventListener("input", (e) => {
      currentSearch.jenis = e.target.value.trim().toLowerCase();
      renderJenisTable();
    });

    el.searchAlternatif.addEventListener("input", (e) => {
      currentSearch.alternatif = e.target.value.trim().toLowerCase();
      renderAlternatifTable();
    });

    el.searchHasil.addEventListener("input", (e) => {
      currentSearch.hasil = e.target.value.trim().toLowerCase();
      renderHasilTable();
    });

    el.alternativeForm.addEventListener("submit", handleSubmitAlternative);
    el.saveDataBtn.addEventListener("click", saveAllData);
    el.resetForm.addEventListener("click", resetAlternativeForm);
    el.deleteSelected.addEventListener("click", deleteSelectedRows);
    el.sortAlternatif.addEventListener("click", () => {
      sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
      renderAlternatifTable();
      toast(`Urutan: ${sortState.dir === "asc" ? "A-Z" : "Z-A"}`, "info");
    });

    el.selectAll.addEventListener("change", (e) => {
      const checked = e.target.checked;
      document.querySelectorAll(".row-select").forEach((cb) => {
        cb.checked = checked;
        if (checked) selectedIds.add(cb.dataset.id);
        else selectedIds.delete(cb.dataset.id);
      });
    });

    el.printResult.addEventListener("click", printResults);
    el.downloadJson.addEventListener("click", downloadJson);
    el.downloadPdf.addEventListener("click", downloadPdfReport);
    el.refreshChart.addEventListener("click", drawChart);

    document.addEventListener("click", (e) => {
      const altSort = e.target?.dataset?.sort;
      if (altSort && e.target.closest("#alternatifTable thead")) toggleAlternativeSort(altSort);

      const hasilSort = e.target?.dataset?.resultSort;
      if (hasilSort && e.target.closest("#hasilTable thead")) toggleHasilSort(hasilSort);

      const action = e.target?.dataset?.action;
      if (action === "edit") editAlternative(e.target.dataset.id);
      if (action === "delete") deleteAlternative(e.target.dataset.id);

      if (e.target?.dataset?.restore) restoreAlternative(e.target.dataset.restore);
      if (e.target?.dataset?.removeTrash) removeFromTrash(e.target.dataset.removeTrash);
    });

    window.addEventListener("hashchange", () => {
      const page = location.hash.replace("#", "") || "beranda";
      showPage(page, false);
    });

    window.addEventListener("resize", drawChart);

    window.addEventListener("beforeunload", (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
  }

  function toggleNavbar() {
    const open = el.navbar.classList.toggle("open");
    el.menuToggle.setAttribute("aria-expanded", String(open));
  }

  function closeNavbar() {
    el.navbar.classList.remove("open");
    el.menuToggle.setAttribute("aria-expanded", "false");
  }

  function showPage(pageId, updateHash = true) {
    el.pages.forEach((page) => page.classList.toggle("active", page.id === pageId));
    el.navLinks.forEach((link) => link.classList.toggle("active", link.dataset.page === pageId));
    if (updateHash) history.replaceState(null, "", `#${pageId}`);
    renderProses();
    renderHasilTable();
    updateStatsAndHighlights();
    drawChart();
  }

  function renderSelectOptions() {
    const options = [
      [1, "1 - Sangat Rendah"],
      [2, "2 - Rendah"],
      [3, "3 - Sedang"],
      [4, "4 - Tinggi"],
      [5, "5 - Sangat Tinggi"],
    ];
    [el.c1, el.c2, el.c3, el.c4].forEach((select) => {
      select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    });
    el.c1.value = "5";
    el.c2.value = "5";
    el.c3.value = "5";
    el.c4.value = "1";
  }

  function renderCriteriaCards() {
    el.criteriaCards.innerHTML = criteria.map((c) => `
      <div class="criteria-card">
        <h4>${c.code} - ${c.name}</h4>
        <div class="criteria-meta">
          <span>Jenis: <strong>${c.type}</strong></span>
          <span>Bobot: <strong>${Math.round(c.weight * 100)}%</strong></span>
        </div>
        <p class="criteria-desc">${c.desc}</p>
      </div>
    `).join("");
    el.weightFill.style.width = "100%";
  }

  function renderRulesGrid() {
    el.rulesGrid.innerHTML = criteria.map((c) => {
      const rows = rules[c.code].map(([value, label]) => `
        <tr>
          <td>${value}</td>
          <td>${label}</td>
        </tr>
      `).join("");

      return `
        <div class="rule-card">
          <h4>${c.code} - ${c.name}</h4>
          <table class="rule-table">
            <thead>
              <tr>
                <th>Nilai</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }).join("");
  }

  function renderJenisTable() {
    const list = workingAlternatives.filter((a) => a.name.toLowerCase().includes(currentSearch.jenis));
    el.jenisTableBody.innerHTML = list.map((a, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escapeHtml(a.name)}</td>
        <td>Alternatif data jagung untuk proses SAW</td>
      </tr>
    `).join("");
  }

  function renderAlternatifTable() {
    const list = getSortedAlternatives();
    el.selectAll.checked = false;

    el.alternatifTableBody.innerHTML = list.map((a, idx) => `
      <tr>
        <td><input type="checkbox" class="row-select" data-id="${a.id}" ${selectedIds.has(a.id) ? "checked" : ""} /></td>
        <td>${idx + 1}</td>
        <td>${escapeHtml(a.name)}</td>
        <td>${a.c1}</td>
        <td>${a.c2}</td>
        <td>${a.c3}</td>
        <td>${a.c4}</td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${a.id}" type="button">Edit</button>
            <button class="btn btn-danger btn-sm" data-action="delete" data-id="${a.id}" type="button">Hapus</button>
          </div>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".row-select").forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) selectedIds.add(cb.dataset.id);
        else selectedIds.delete(cb.dataset.id);
      });
    });
  }

  function renderTrashList() {
    if (!trashAlternatives.length) {
      el.trashList.innerHTML = `
        <div class="trash-item">
          <h4>Tidak ada data terhapus</h4>
          <p>Semua data masih aktif. Saat menghapus, data akan masuk ke sini dan bisa dipulihkan.</p>
        </div>
      `;
      return;
    }

    el.trashList.innerHTML = trashAlternatives.slice().reverse().map((item) => {
      const when = item.deletedAt ? new Date(item.deletedAt).toLocaleString("id-ID") : "-";
      return `
        <div class="trash-item">
          <h4>${escapeHtml(item.name)}</h4>
          <p>
            Dihapus: ${when}<br/>
            Nilai: C1=${item.c1}, C2=${item.c2}, C3=${item.c3}, C4=${item.c4}
          </p>
          <div class="trash-actions">
            <button class="btn btn-primary btn-sm" data-restore="${item.id}" type="button">Pulihkan</button>
            <button class="btn btn-danger btn-sm" data-remove-trash="${item.id}" type="button">Hapus Permanen</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderProses() {
    const results = calculateSAW();

    el.stepList.innerHTML = `
      <div class="step-item">
        <h4>1. Menyusun Matriks Keputusan</h4>
        <p>Setiap alternatif dinilai menggunakan empat kriteria C1 sampai C4 dengan skala 1–5.</p>
      </div>
      <div class="step-item">
        <h4>2. Normalisasi Nilai</h4>
        <p>Kriteria benefit menggunakan rumus <strong>xij / max(xij)</strong>, sedangkan cost menggunakan <strong>min(xij) / xij</strong>.</p>
      </div>
      <div class="step-item">
        <h4>3. Perkalian Bobot</h4>
        <p>Nilai normalisasi dikalikan bobot kriteria: C1 25%, C2 30%, C3 25%, C4 20%.</p>
      </div>
      <div class="step-item">
        <h4>4. Nilai Preferensi</h4>
        <p>Nilai akhir dihitung dengan menjumlahkan seluruh hasil perkalian bobot untuk memperoleh ranking terbaik.</p>
      </div>
    `;

    el.matrixAwalWrap.innerHTML = buildMatrixTable(results.rawRows, ["Alternatif", "C1", "C2", "C3", "C4"]);
    el.matrixNormalisasiWrap.innerHTML = buildMatrixTable(
      results.normRows.map((row) => ({
        ...row,
        c1: row.c1.toFixed(4),
        c2: row.c2.toFixed(4),
        c3: row.c3.toFixed(4),
        c4: row.c4.toFixed(4),
      })),
      ["Alternatif", "C1", "C2", "C3", "C4"]
    );
    el.preferensiWrap.innerHTML = buildPreferensiTable(results.ranked);
  }

  function renderHasilTable() {
    const ranked = calculateSAW().ranked.filter((r) => r.name.toLowerCase().includes(currentSearch.hasil));
    el.hasilTableBody.innerHTML = ranked.map((r, idx) => {
      const rank = idx + 1;
      const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : String(rank);
      const statusClass = rank === 1 ? "good" : rank <= 3 ? "warn" : "bad";
      const statusText = rank === 1 ? "Terbaik" : rank <= 3 ? "Rekomendasi" : "Pembanding";

      return `
        <tr>
          <td>${medal}</td>
          <td>${escapeHtml(r.name)}</td>
          <td>${r.score.toFixed(4)}</td>
          <td><span class="tag ${statusClass}">${statusText}</span></td>
        </tr>
      `;
    }).join("");
  }

  function updateStatsAndHighlights() {
    const ranked = calculateSAW().ranked;
    el.statAlternatif.textContent = workingAlternatives.length;
    el.statKriteria.textContent = criteria.length;
    el.statBobot.textContent = "100%";

    if (ranked.length) {
      el.statTerbaik.textContent = ranked[0].name;
      el.bestName.textContent = ranked[0].name;
      el.bestScore.textContent = `Nilai preferensi: ${ranked[0].score.toFixed(4)}`;
    } else {
      el.statTerbaik.textContent = "-";
      el.bestName.textContent = "-";
      el.bestScore.textContent = "Nilai preferensi: -";
    }
  }

  function renderAll() {
    renderAlternatifTable();
    renderTrashList();
    renderProses();
    renderHasilTable();
    updateStatsAndHighlights();
    drawChart();
  }

  function handleSubmitAlternative(e) {
    e.preventDefault();

    const payload = {
      id: el.editId.value || genId(),
      name: el.namaAlternatif.value.trim(),
      c1: Number(el.c1.value),
      c2: Number(el.c2.value),
      c3: Number(el.c3.value),
      c4: Number(el.c4.value),
    };

    if (!payload.name) return;

    const exists = workingAlternatives.some((a) => a.id === payload.id);
    if (exists) {
      workingAlternatives = workingAlternatives.map((a) => (a.id === payload.id ? payload : a));
      toast("Data alternatif berhasil diperbarui.", "success");
    } else {
      workingAlternatives.unshift(payload);
      toast("Data alternatif berhasil ditambahkan.", "success");
    }

    dirty = true;
    resetAlternativeForm();
    selectedIds.clear();
    renderAll();
  }

  function resetAlternativeForm() {
    el.editId.value = "";
    el.namaAlternatif.value = "";
    el.c1.value = "5";
    el.c2.value = "5";
    el.c3.value = "5";
    el.c4.value = "1";
    el.saveButton.textContent = "Tambah Data";
  }

  function editAlternative(id) {
    const item = workingAlternatives.find((a) => a.id === id);
    if (!item) return;
    el.editId.value = item.id;
    el.namaAlternatif.value = item.name;
    el.c1.value = item.c1;
    el.c2.value = item.c2;
    el.c3.value = item.c3;
    el.c4.value = item.c4;
    el.saveButton.textContent = "Perbarui Data";
    showPage("alternatif", true);
  }

  function deleteAlternative(id) {
    const item = workingAlternatives.find((a) => a.id === id);
    if (!item) return;
    workingAlternatives = workingAlternatives.filter((a) => a.id !== id);
    trashAlternatives.push({ ...item, deletedAt: new Date().toISOString() });
    selectedIds.delete(id);
    dirty = true;
    if (el.editId.value === id) resetAlternativeForm();
    renderAll();
  }

  function deleteSelectedRows() {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;

    ids.forEach((id) => {
      const item = workingAlternatives.find((a) => a.id === id);
      if (!item) return;
      trashAlternatives.push({ ...item, deletedAt: new Date().toISOString() });
      workingAlternatives = workingAlternatives.filter((a) => a.id !== id);
    });

    selectedIds.clear();
    dirty = true;
    renderAll();
  }

  function restoreAlternative(id) {
    const item = trashAlternatives.find((a) => a.id === id);
    if (!item) return;
    workingAlternatives.unshift({
      id: item.id,
      name: item.name,
      c1: item.c1,
      c2: item.c2,
      c3: item.c3,
      c4: item.c4,
    });
    trashAlternatives = trashAlternatives.filter((a) => a.id !== id);
    dirty = true;
    renderAll();
    toast(`"${item.name}" berhasil dipulihkan.`, "success");
  }

  function removeFromTrash(id) {
    trashAlternatives = trashAlternatives.filter((a) => a.id !== id);
    dirty = true;
    renderTrashList();
  }

  function saveAllData() {
    localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(workingAlternatives));
    localStorage.setItem(STORAGE_KEYS.trash, JSON.stringify(trashAlternatives));
    dirty = false;
    toast("Data berhasil disimpan ke localStorage.", "success");
  }

  function loadWorkingAlternatives() {
    const saved = parseStorage(STORAGE_KEYS.saved);
    if (Array.isArray(saved) && saved.length) return saved;
    return clone(defaultAlternatives);
  }

  function loadTrashAlternatives() {
    const saved = parseStorage(STORAGE_KEYS.trash);
    if (Array.isArray(saved)) return saved;
    return [];
  }

  function parseStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function calculateSAW() {
    const rawRows = clone(workingAlternatives).map((a) => ({
      name: a.name,
      c1: Number(a.c1),
      c2: Number(a.c2),
      c3: Number(a.c3),
      c4: Number(a.c4),
    }));

    if (!rawRows.length) return { rawRows: [], normRows: [], ranked: [] };

    const maxC1 = Math.max(...rawRows.map((r) => r.c1));
    const maxC2 = Math.max(...rawRows.map((r) => r.c2));
    const maxC3 = Math.max(...rawRows.map((r) => r.c3));
    const minC4 = Math.min(...rawRows.map((r) => r.c4));

    const normRows = rawRows.map((r) => ({
      name: r.name,
      c1: r.c1 / maxC1,
      c2: r.c2 / maxC2,
      c3: r.c3 / maxC3,
      c4: minC4 / r.c4,
    }));

    const ranked = normRows
      .map((r) => {
        const score =
          r.c1 * criteria[0].weight +
          r.c2 * criteria[1].weight +
          r.c3 * criteria[2].weight +
          r.c4 * criteria[3].weight;
        return { name: r.name, score, norm: r };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    return { rawRows, normRows, ranked };
  }

  function buildMatrixTable(rows, headers) {
    if (!rows.length) return `<div class="empty-state"><p>Belum ada data untuk ditampilkan.</p></div>`;

    const body = rows.map((r, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.c1}</td>
        <td>${r.c2}</td>
        <td>${r.c3}</td>
        <td>${r.c4}</td>
      </tr>
    `).join("");

    return `
      <table class="data-table center-table">
        <thead>
          <tr>
            <th>No</th>
            ${headers.map((h) => `<th>${h}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    `;
  }

  function buildPreferensiTable(ranked) {
    if (!ranked.length) return `<div class="empty-state"><p>Belum ada data.</p></div>`;

    const body = ranked.map((r) => {
      const c1 = (r.norm.c1 * criteria[0].weight).toFixed(4);
      const c2 = (r.norm.c2 * criteria[1].weight).toFixed(4);
      const c3 = (r.norm.c3 * criteria[2].weight).toFixed(4);
      const c4 = (r.norm.c4 * criteria[3].weight).toFixed(4);

      return `
        <tr>
          <td>${r.rank}</td>
          <td>${escapeHtml(r.name)}</td>
          <td>${c1}</td>
          <td>${c2}</td>
          <td>${c3}</td>
          <td>${c4}</td>
          <td><strong>${r.score.toFixed(4)}</strong></td>
        </tr>
      `;
    }).join("");

    return `
      <table class="data-table center-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Alternatif</th>
            <th>C1×W</th>
            <th>C2×W</th>
            <th>C3×W</th>
            <th>C4×W</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    `;
  }

  function getSortedAlternatives() {
    const arr = workingAlternatives.filter((a) => a.name.toLowerCase().includes(currentSearch.alternatif));
    const { key, dir } = sortState;

    arr.sort((a, b) => {
      if (key === "c1" || key === "c2" || key === "c3" || key === "c4") return a[key] - b[key];
      return a.name.localeCompare(b.name, "id");
    });

    if (dir === "desc") arr.reverse();
    return arr;
  }

  function toggleAlternativeSort(key) {
    if (sortState.key === key) sortState.dir = sortState.dir === "asc" ? "desc" : "asc";
    else {
      sortState.key = key;
      sortState.dir = "asc";
    }
    renderAlternatifTable();
  }

  function toggleHasilSort(key) {
    const ranked = calculateSAW().ranked;
    ranked.sort((a, b) => {
      if (key === "score") return b.score - a.score;
      if (key === "name") return a.name.localeCompare(b.name, "id");
      return a.rank - b.rank;
    });
    renderHasilTable();
  }

  function drawChart() {
    const canvas = el.resultChart;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const results = calculateSAW().ranked;
    const dpr = window.devicePixelRatio || 1;
    const chartWidth = canvas.clientWidth || 900;
    const chartHeight = Math.max(520, 90 + results.length * 28);

    canvas.width = Math.floor(chartWidth * dpr);
    canvas.height = Math.floor(chartHeight * dpr);
    canvas.style.height = `${chartHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, chartWidth, chartHeight);

    ctx.fillStyle = "rgba(255,255,255,0.02)";
    roundRect(ctx, 0, 0, chartWidth, chartHeight, 18, true, false);

    if (!results.length) {
      ctx.fillStyle = "#9fb3d9";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Belum ada data untuk digambar.", chartWidth / 2, chartHeight / 2);
      return;
    }

    const padLeft = 240;
    const padRight = 40;
    const padTop = 48;
    const padBottom = 36;
    const barH = 16;
    const gap = 12;
    const maxScore = Math.max(...results.map((r) => r.score));
    const usableWidth = chartWidth - padLeft - padRight;

    ctx.fillStyle = "#e8f1ff";
    ctx.font = "700 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Grafik Nilai Preferensi", 18, 28);

    ctx.fillStyle = "#9fb3d9";
    ctx.font = "12px sans-serif";
    ctx.fillText(maxScore.toFixed(4), padLeft - 58, padTop + 12);

    ctx.strokeStyle = "rgba(255,255,255,.06)";
    ctx.lineWidth = 1;

    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const x = padLeft + (usableWidth / gridCount) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, chartHeight - padBottom);
      ctx.stroke();
    }

    results.forEach((r, i) => {
      const y = padTop + i * (barH + gap);
      const barWidth = (r.score / maxScore) * usableWidth;
      const gradient = ctx.createLinearGradient(padLeft, 0, padLeft + barWidth, 0);
      gradient.addColorStop(0, "rgba(46,168,255,.95)");
      gradient.addColorStop(1, "rgba(65,214,139,.95)");

      ctx.fillStyle = "#dfeaff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      writeFit(ctx, r.name, padLeft - 14, y + barH - 2, 220);

      ctx.fillStyle = gradient;
      roundRect(ctx, padLeft, y, Math.max(8, barWidth), barH, 10, true, false);

      ctx.fillStyle = "#e8f1ff";
      ctx.textAlign = "left";
      ctx.fillText(r.score.toFixed(4), padLeft + Math.max(8, barWidth) + 10, y + barH - 2);
    });
  }

  function writeFit(ctx, text, x, y, maxWidth) {
    let value = text;
    while (ctx.measureText(value).width > maxWidth && value.length > 3) value = value.slice(0, -1);
    if (value !== text) value = value.slice(0, -3) + "...";
    ctx.fillText(value, x, y);
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function printResults() {
    const results = calculateSAW().ranked;
    const w = window.open("", "_blank", "width=1200,height=900");
    if (!w) return;

    const rows = results.map((r) => `
      <tr>
        <td>${r.rank}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.score.toFixed(4)}</td>
      </tr>
    `).join("");

    w.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hasil SPK Jagung SAW</title>
        <style>
          body{font-family:Arial,sans-serif;margin:24px;color:#111}
          h1,h2{text-align:center}
          table{width:100%;border-collapse:collapse;margin-top:18px}
          th,td{border:1px solid #ccc;padding:10px;text-align:center}
          th{background:#f3f6fb}
          @media print{button{display:none}}
        </style>
      </head>
      <body>
        <h1>Hasil Akhir SPK Pemilihan Jenis Jagung Terbaik</h1>
        <h2>Metode SAW</h2>
        <table>
          <thead>
            <tr><th>Peringkat</th><th>Alternatif</th><th>Nilai Preferensi</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload=function(){window.print();}</script>
      </body>
      </html>
    `);
    w.document.close();
  }

  function downloadJson() {
    const payload = {
      generatedAt: new Date().toISOString(),
      criteria,
      alternatives: workingAlternatives,
      trash: trashAlternatives,
      ranking: calculateSAW().ranked,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    downloadBlob(blob, `spk-jagung-saw-${dateStamp()}.json`);
    toast("JSON berhasil diunduh.", "success");
  }

  function downloadPdfReport() {
    const report = buildPdfReport();
    const blob = new Blob([report], { type: "application/pdf" });
    downloadBlob(blob, `spk-jagung-saw-${dateStamp()}.pdf`);
    toast("PDF berhasil diunduh.", "success");
  }

  function buildPdfReport() {
    const results = calculateSAW().ranked;
    const lines = [];
    lines.push("SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN JENIS JAGUNG TERBAIK");
    lines.push("Metode: Simple Additive Weighting (SAW)");
    lines.push("");
    lines.push("Kriteria:");
    criteria.forEach((c) => lines.push(`${c.code} - ${c.name} | ${c.type} | Bobot ${Math.round(c.weight * 100)}%`));
    lines.push("");
    lines.push("Peringkat Hasil Akhir:");
    results.forEach((r) => lines.push(`${r.rank}. ${r.name} - ${r.score.toFixed(4)}`));
    lines.push("");
    lines.push("Data Alternatif:");
    workingAlternatives.forEach((a, i) => lines.push(`${i + 1}. ${a.name} | C1=${a.c1} C2=${a.c2} C3=${a.c3} C4=${a.c4}`));
    return createSimplePdf(lines, "SPK Jagung SAW");
  }

  function createSimplePdf(lines, title) {
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const fontSize = 11;
    const leading = 15;
    const linesPerPage = Math.floor((pageHeight - margin * 2) / leading);

    const pages = [];
    for (let i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage));

    const objects = [];
    const push = (s) => objects.push(s);

    push(`1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj`);
    push(`2 0 obj << /Type /Pages /Kids [${pages.map((_, i) => `${4 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >> endobj`);
    push(`3 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`);

    let objNumber = 4;
    const pageObjects = [];
    const contentObjects = [];

    pages.forEach((pageLines) => {
      const yStart = pageHeight - margin - 10;
      const content = [];
      content.push(`BT`);
      content.push(`/F1 ${fontSize} Tf`);
      content.push(`1 0 0 1 ${margin} ${yStart} Tm`);
      content.push(`(${escapePdf(title)}) Tj`);
      content.push(`0 -${leading + 2} Td`);
      content.push(`(${escapePdf("Generated by SPK Jagung SAW")}) Tj`);
      content.push(`0 -${leading} Td`);
      content.push(`(${escapePdf(" ")}) Tj`);

      pageLines.forEach((line, idx) => {
        if (idx === 0) content.push(`0 -${leading} Td`);
        content.push(`(${escapePdf(line)}) Tj`);
        if (idx !== pageLines.length - 1) content.push(`0 -${leading} Td`);
      });

      content.push(`ET`);
      const contentObjNum = objNumber + 1;
      const pageObjNum = objNumber;
      contentObjects.push({ num: contentObjNum, stream: content.join("\n") });
      pageObjects.push({ num: pageObjNum, contentNum: contentObjNum });
      objNumber += 2;
    });

    pageObjects.forEach((page) => {
      push(`${page.num} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${page.contentNum} 0 R >> endobj`);
    });

    contentObjects.forEach((c) => {
      push(`${c.num} 0 obj << /Length ${c.stream.length} >> stream\n${c.stream}\nendstream endobj`);
    });

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((obj) => {
      offsets.push(pdf.length);
      pdf += obj + "\n";
    });

    const xrefPos = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += `0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\n`;
    pdf += `startxref\n${xrefPos}\n%%EOF`;

    return pdf;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function toast(message, type = "info") {
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.innerHTML = `<strong>${escapeHtml(message)}</strong><small>${new Date().toLocaleTimeString("id-ID")}</small>`;
    el.toastContainer.appendChild(node);
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateY(8px)";
      setTimeout(() => node.remove(), 220);
    }, 2200);
  }

  function genId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "id-" + Math.random().toString(16).slice(2) + "-" + Date.now();
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function escapePdf(str) {
    return String(str)
      .replaceAll("\\", "\\\\")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)");
  }

  function dateStamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }
})();