/**
 * ============================================================================
 * TEMANBELAJAR | SCRIPT INTERAKTIVITAS LENGKAP 5 HALAMAN (M07)
 * Mencakup:
 * 1. Navigasi SPA 5 Halaman & Mobile Drawer Toggle
 * 2. Klaim Tugas Mandiri, Filter Status, Quick Add Task Form, & Sinkronisasi Dashboard
 * 3. Matriks Interaktif Schedule Matcher dengan Inisial Anggota per Sel (KF-2)
 * 4. Validasi Form Forum Q&A Anonim, Sakelar Privasi, AI Helper, & Vote Terbantu
 * 5. Rating Bintang Interaktif dengan Label Makna Dinamis pada Peer Evaluation
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const btnMenuToggle = document.getElementById("btn-menu-toggle");
  const btnCloseSidebar = document.getElementById("btn-close-sidebar");
  const navLinks = document.querySelectorAll(".nav-link");
  const pageViews = document.querySelectorAll(".page-view");

  const btnNotification = document.getElementById("btn-notification");
  const notifDot = document.getElementById("notif-dot");
  const btnGotoSchedule = document.getElementById("btn-goto-schedule");
  const btnGotoTaskManager = document.getElementById("btn-goto-task-manager");
  const toastFeedback = document.getElementById("toast-feedback");

  let activeFilter = "all";
  let toastTimer = null;
  let nextTaskNum = 5;

  /**
   * Menampilkan pesan konfirmasi singkat (Toast) di bagian atas halaman
   * @param {string} message - Teks umpan balik untuk pengguna
   */
  function showToast(message) {
    if (!toastFeedback) return;
    toastFeedback.textContent = message;
    toastFeedback.hidden = false;

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastFeedback.hidden = true;
    }, 3600);
  }

  // ==========================================================================
  // 1. KOMPONEN 1 & 2: Navigasi Antarhalaman (5 Halaman) & Mobile Drawer
  // ==========================================================================
  function openMobileSidebar() {
    sidebar.classList.add("open");
    sidebarBackdrop.hidden = false;
    btnMenuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileSidebar() {
    sidebar.classList.remove("open");
    sidebarBackdrop.hidden = true;
    btnMenuToggle.setAttribute("aria-expanded", "false");
  }

  const mainEyebrow = document.getElementById("main-eyebrow");
  const mainPageTitle = document.getElementById("main-page-title");
  const mainPageSubtitle = document.getElementById("main-page-subtitle");

  function switchPageView(targetViewId) {
    pageViews.forEach((view) => {
      const isMatch = view.id === targetViewId;
      view.hidden = !isMatch;
      view.classList.toggle("active", isMatch);
    });

    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("data-target") === targetViewId;
      link.classList.toggle("active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
        if (mainEyebrow) mainEyebrow.textContent = link.getAttribute("data-eyebrow") || "";
        if (mainPageTitle) mainPageTitle.textContent = link.getAttribute("data-heading") || "";
        if (mainPageSubtitle) mainPageSubtitle.textContent = link.getAttribute("data-subtitle") || "";
      } else {
        link.removeAttribute("aria-current");
      }
    });

    closeMobileSidebar();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetViewId = link.getAttribute("data-target");
      if (targetViewId) {
        switchPageView(targetViewId);
      }
    });
  });

  if (btnMenuToggle) {
    btnMenuToggle.addEventListener("click", () => {
      if (sidebar.classList.contains("open")) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener("click", closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeMobileSidebar);
  }

  if (btnGotoSchedule) {
    btnGotoSchedule.addEventListener("click", () => {
      switchPageView("view-schedule-matcher");
    });
  }

  if (btnGotoTaskManager) {
    btnGotoTaskManager.addEventListener("click", () => {
      switchPageView("view-task-manager");
    });
  }

  if (btnNotification) {
    btnNotification.addEventListener("click", () => {
      if (notifDot) notifDot.hidden = true;
      switchPageView("view-dashboard");
      showToast("Pengingat Otomatis (H-2 Jam): Sesi diskusi kelompok hari ini pukul 19:00 WIB.");
    });
  }

  // ==========================================================================
  // 2. KOMPONEN 3 & 4: Task Manager (Klaim Tugas, Filter Tab, & Sinkronisasi Dashboard)
  // ==========================================================================
  const taskCardsContainer = document.getElementById("task-cards-container");
  const filterTabs = document.querySelectorAll(".filter-tab");
  const emptyState = document.getElementById("empty-state");
  const dashUnclaimedList = document.getElementById("dash-unclaimed-list");
  const dashUnclaimedBadge = document.getElementById("dash-unclaimed-badge");
  const navBadgeUnclaimed = document.getElementById("nav-badge-unclaimed");

  const addTaskForm = document.getElementById("add-task-form");
  const taskTitleInput = document.getElementById("task-title-input");
  const taskWeightInput = document.getElementById("task-weight-input");
  const taskDeadlineInput = document.getElementById("task-deadline-input");
  const taskFormError = document.getElementById("task-form-error");

  function syncTasksAndDashboard() {
    const cards = Array.from(taskCardsContainer.querySelectorAll(".task-card"));

    const statusCounts = {
      tersedia: 0,
      dikerjakan: 0,
      selesai: 0
    };

    const memberCounts = {
      "Rian (Kamu)": 0,
      Budi: 0,
      Siti: 0,
      Andi: 0
    };

    const unclaimedItems = [];

    cards.forEach((card) => {
      const code = card.getAttribute("data-id") || "TB-00";
      const status = card.getAttribute("data-status") || "tersedia";
      const owner = card.getAttribute("data-owner") || "";
      const title = card.getAttribute("data-title") || "Sub-Tugas";
      const weight = card.getAttribute("data-weight") || "Sedang";
      const deadline = card.getAttribute("data-deadline") || "30 Okt";

      if (statusCounts[status] !== undefined) {
        statusCounts[status] += 1;
      }

      if (owner && memberCounts[owner] !== undefined) {
        memberCounts[owner] += 1;
      }

      if (status === "tersedia") {
        unclaimedItems.push({ code, title, weight, deadline });
      }
    });

    // Update badge tab filter di Task Manager
    document.getElementById("badge-all").textContent = String(cards.length);
    document.getElementById("badge-tersedia").textContent = String(statusCounts.tersedia);
    document.getElementById("badge-dikerjakan").textContent = String(statusCounts.dikerjakan);
    document.getElementById("badge-selesai").textContent = String(statusCounts.selesai);

    if (navBadgeUnclaimed) {
      navBadgeUnclaimed.textContent = String(statusCounts.tersedia);
      navBadgeUnclaimed.hidden = statusCounts.tersedia === 0;
    }

    // Update bar beban tugas di Task Manager & daftar distribusi di Dashboard
    const updateMemberUI = (key, count) => {
      const tmCount = document.getElementById(`tm-count-${key}`);
      const tmBar = document.getElementById(`tm-bar-${key}`);
      const dashCount = document.getElementById(`dash-count-${key}`);

      if (tmCount) tmCount.textContent = `${count} tugas`;
      if (dashCount) dashCount.textContent = `${count} tugas`;
      if (tmBar) {
        const widthPct = count === 0 ? 0 : Math.min(100, count * 45);
        tmBar.style.width = `${widthPct}%`;
      }
    };

    updateMemberUI("rian", memberCounts["Rian (Kamu)"]);
    updateMemberUI("budi", memberCounts.Budi);
    updateMemberUI("siti", memberCounts.Siti);
    updateMemberUI("andi", memberCounts.Andi);

    // Update daftar Sub-Tugas Belum Diklaim di Dashboard Kelompok
    if (dashUnclaimedBadge) {
      dashUnclaimedBadge.textContent = `${unclaimedItems.length} tersedia`;
    }

    if (dashUnclaimedList) {
      dashUnclaimedList.innerHTML = "";
      if (unclaimedItems.length === 0) {
        dashUnclaimedList.innerHTML = `
          <div class="unclaimed-preview-item">
            <div>
              <p class="unclaimed-preview-title">Seluruh sub-tugas telah memiliki penanggung jawab</p>
              <p class="unclaimed-preview-meta">Tidak ada tugas yang tertunda pembagiannya.</p>
            </div>
            <span class="status-tag tag-green">Tuntas</span>
          </div>
        `;
      } else {
        unclaimedItems.forEach((item) => {
          const div = document.createElement("div");
          div.className = "unclaimed-preview-item";
          div.innerHTML = `
            <div>
              <p class="unclaimed-preview-title"><span class="mono-text">${item.code}</span> · ${item.title}</p>
              <p class="unclaimed-preview-meta">Beban: ${item.weight} · Tenggat: ${item.deadline} · Penanggung Jawab: Belum ada</p>
            </div>
            <span class="pill-badge">Tersedia</span>
          `;
          dashUnclaimedList.appendChild(div);
        });
      }
    }

    // Update kartu progres & keseimbangan di Dashboard
    const completedBase = 2 + statusCounts.selesai;
    const totalProjectTasks = Math.max(5, cards.length + 1);
    const pct = Math.min(100, Math.round((completedBase / totalProjectTasks) * 100));
    const dashProgressText = document.getElementById("dash-progress-text");
    const dashProgressPct = document.getElementById("dash-progress-pct");
    const dashProgressBar = document.getElementById("dash-progress-bar");

    if (dashProgressText) dashProgressText.textContent = `${completedBase}/${totalProjectTasks} Selesai`;
    if (dashProgressPct) dashProgressPct.textContent = `${pct}%`;
    if (dashProgressBar) dashProgressBar.style.width = `${pct}%`;

    const dashBalanceTitle = document.getElementById("dash-balance-title");
    const dashBalanceTag = document.getElementById("dash-balance-tag");
    if (statusCounts.tersedia === 0) {
      if (dashBalanceTitle) dashBalanceTitle.textContent = "Semua Terklaim";
      if (dashBalanceTag) {
        dashBalanceTag.textContent = "Terkendali";
        dashBalanceTag.className = "status-tag tag-green";
      }
    } else {
      if (dashBalanceTitle) dashBalanceTitle.textContent = "Perlu Klaim Tugas";
      if (dashBalanceTag) {
        dashBalanceTag.textContent = `${statusCounts.tersedia} Kosong`;
        dashBalanceTag.className = "status-tag tag-amber";
      }
    }

    applyTaskFilter();
  }

  function applyTaskFilter() {
    const cards = Array.from(taskCardsContainer.querySelectorAll(".task-card"));
    let visible = 0;

    cards.forEach((card) => {
      const status = card.getAttribute("data-status");
      const show = activeFilter === "all" || status === activeFilter;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (emptyState) {
      emptyState.hidden = visible > 0;
    }
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      activeFilter = tab.getAttribute("data-filter") || "all";
      applyTaskFilter();
    });
  });

  if (taskCardsContainer) {
    taskCardsContainer.addEventListener("click", (event) => {
      const btn = event.target;
      if (!(btn instanceof HTMLElement)) return;
      const card = btn.closest(".task-card");
      if (!card) return;

      const title = card.getAttribute("data-title") || "Sub-tugas";
      const badge = card.querySelector(".status-badge");
      const picStrong = card.querySelector(".task-pic strong");
      const actions = card.querySelector(".task-actions");

      if (btn.classList.contains("btn-claim")) {
        card.setAttribute("data-status", "dikerjakan");
        card.setAttribute("data-owner", "Rian (Kamu)");
        if (badge) {
          badge.className = "status-badge badge-dikerjakan";
          badge.textContent = "Dikerjakan";
        }
        if (picStrong) picStrong.textContent = "Rian (Kamu)";
        if (actions) {
          actions.innerHTML = `
            <button type="button" class="btn-secondary btn-unclaim">Batalkan Klaim</button>
            <button type="button" class="btn-primary btn-complete">Tandai Selesai</button>
          `;
        }
        syncTasksAndDashboard();
        showToast(`Berhasil! Sub-tugas "${title}" telah diklaim atas nama Rian (Kamu).`);
      } else if (btn.classList.contains("btn-unclaim")) {
        card.setAttribute("data-status", "tersedia");
        card.setAttribute("data-owner", "");
        if (badge) {
          badge.className = "status-badge badge-tersedia";
          badge.textContent = "Tersedia";
        }
        if (picStrong) picStrong.textContent = "Belum ada";
        if (actions) {
          actions.innerHTML = `<button type="button" class="btn-primary btn-claim">Klaim Tugas</button>`;
        }
        syncTasksAndDashboard();
        showToast(`Klaim pada "${title}" telah dilepas kembali.`);
      } else if (btn.classList.contains("btn-complete")) {
        card.setAttribute("data-status", "selesai");
        if (badge) {
          badge.className = "status-badge badge-selesai";
          badge.textContent = "Selesai";
        }
        if (actions) {
          actions.innerHTML = `<button type="button" class="btn-secondary btn-unclaim">Buka Kembali</button>`;
        }
        syncTasksAndDashboard();
        showToast(`Sub-tugas "${title}" telah ditandai Selesai.`);
      }
    });
  }

  // Form Validasi Tambah Sub-Tugas Baru di Task Manager
  if (addTaskForm) {
    addTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const titleVal = taskTitleInput.value.trim();
      const weightVal = taskWeightInput.value.trim();
      const deadlineVal = taskDeadlineInput.value.trim();

      if (titleVal.length < 5) {
        taskFormError.textContent = "Nama sub-tugas wajib diisi minimal 5 karakter.";
        taskFormError.hidden = false;
        taskTitleInput.focus();
        return;
      }

      if (!weightVal) {
        taskFormError.textContent = "Silakan pilih bobot beban tugas terlebih dahulu.";
        taskFormError.hidden = false;
        taskWeightInput.focus();
        return;
      }

      if (!deadlineVal) {
        taskFormError.textContent = "Tenggat waktu wajib diisi (contoh: 2 Nov).";
        taskFormError.hidden = false;
        taskDeadlineInput.focus();
        return;
      }

      taskFormError.hidden = true;
      const codeId = `TB-0${nextTaskNum++}`;
      const dotClass =
        weightVal === "Ringan" ? "dot-light" : weightVal === "Berat" ? "dot-heavy" : "dot-medium";

      const newCard = document.createElement("article");
      newCard.className = "task-card";
      newCard.setAttribute("data-id", codeId);
      newCard.setAttribute("data-status", "tersedia");
      newCard.setAttribute("data-owner", "");
      newCard.setAttribute("data-title", titleVal);
      newCard.setAttribute("data-weight", weightVal);
      newCard.setAttribute("data-deadline", deadlineVal);

      newCard.innerHTML = `
        <div class="task-info">
          <div class="task-title-row">
            <span class="task-code mono-text">${codeId}</span>
            <h3 class="task-title"></h3>
            <span class="status-badge badge-tersedia">Tersedia</span>
          </div>
          <div class="task-meta">
            <span class="meta-item"><span class="weight-dot ${dotClass}"></span>Beban: ${weightVal}</span>
            <span class="meta-item mono-text">Tenggat: </span>
            <span class="meta-item task-pic">Penanggung Jawab: <strong>Belum ada</strong></span>
          </div>
        </div>
        <div class="task-actions">
          <button type="button" class="btn-primary btn-claim">Klaim Tugas</button>
        </div>
      `;

      newCard.querySelector(".task-title").textContent = titleVal;
      newCard.querySelectorAll(".meta-item")[1].textContent = `Tenggat: ${deadlineVal}`;

      taskCardsContainer.prepend(newCard);
      addTaskForm.reset();
      syncTasksAndDashboard();
      showToast(`Sub-tugas baru "${titleVal}" (${codeId}) berhasil ditambahkan.`);
    });
  }

  // ==========================================================================
  // 3. HALAMAN 3: Schedule Matcher (Matriks Input Jadwal & Irisan Anggota)
  // ==========================================================================
  const slotButtons = document.querySelectorAll(".slot-btn");
  const selectedSlotsCount = document.getElementById("selected-slots-count");
  const selectedSlotsDetail = document.getElementById("selected-slots-detail");
  const btnSaveSchedule = document.getElementById("btn-save-schedule");
  const btnConfirmSchedule = document.getElementById("btn-confirm-schedule");
  const bestMatchTitle = document.getElementById("best-match-title");
  const bestMatchSubtitle = document.getElementById("best-match-subtitle");

  function updateScheduleMatcher() {
    let selectedCount = 0;
    let fullMatchSlot = null;

    slotButtons.forEach((btn) => {
      const isSelected = btn.classList.contains("selected");
      const day = btn.getAttribute("data-day");
      const time = btn.getAttribute("data-time");
      const others = parseInt(btn.getAttribute("data-others") || "0", 10);
      const otherNames = btn.getAttribute("data-names") || "";
      const totalAvailable = others + (isSelected ? 1 : 0);

      if (isSelected) selectedCount += 1;

      const namesList = [];
      if (isSelected) namesList.push("RN");
      if (otherNames) {
        otherNames.split("·").forEach((n) => {
          if (n) namesList.push(n);
        });
      }

      const heatCell = document.querySelector(`[data-heat="${day}-${time}"]`);
      if (heatCell) {
        heatCell.innerHTML = `
          <span class="heat-ratio">${totalAvailable}/4</span>
          <span class="heat-names">${namesList.length ? namesList.join("·") : "Kosong"}</span>
        `;
        heatCell.className = "heat-cell";
        if (totalAvailable === 4) {
          heatCell.classList.add("heat-match");
          fullMatchSlot = `${day}, ${time} - 21:00 WIB`;
        } else if (totalAvailable >= 2) {
          heatCell.classList.add("heat-mid");
        }
      }
    });

    if (selectedSlotsCount) {
      selectedSlotsCount.textContent = String(selectedCount);
    }

    if (fullMatchSlot) {
      if (selectedSlotsDetail) selectedSlotsDetail.textContent = `Termasuk slot irisan utama ${fullMatchSlot}.`;
      if (bestMatchTitle) bestMatchTitle.textContent = fullMatchSlot;
      if (bestMatchSubtitle) bestMatchSubtitle.textContent = "4/4 Anggota Cocok (Rian, Budi, Siti, Andi)";
    } else {
      if (selectedSlotsDetail) selectedSlotsDetail.textContent = "Pilih slot Rabu 19:00 agar keempat anggota bertemu di waktu yang sama.";
      if (bestMatchTitle) bestMatchTitle.textContent = "Belum ada irisan 4/4 anggota";
      if (bestMatchSubtitle) bestMatchSubtitle.textContent = "Maksimal 3/4 anggota cocok pada pilihan saat ini.";
    }
  }

  slotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isSelected = btn.classList.toggle("selected");
      btn.textContent = isSelected ? "Bisa" : "Kosong";
      updateScheduleMatcher();
    });
  });

  if (btnSaveSchedule) {
    btnSaveSchedule.addEventListener("click", () => {
      showToast("Jadwal kosongmu berhasil disimpan dan peta irisan kelompok telah diperbarui.");
    });
  }

  if (btnConfirmSchedule) {
    btnConfirmSchedule.addEventListener("click", () => {
      showToast("Jadwal Kumpul Rabu, 19:00 WIB berhasil ditetapkan! Pengingat H-2 jam diaktifkan.");
    });
  }

  // ==========================================================================
  // 4. KOMPONEN 5: Forum Q&A Anonim (Validasi Form, Sakelar Privasi, & AI Helper)
  // ==========================================================================
  const qnaForm = document.getElementById("qna-form");
  const qnaInput = document.getElementById("qna-input");
  const qnaAnonCheckbox = document.getElementById("qna-anon-checkbox");
  const qnaPrivacyNote = document.getElementById("qna-privacy-note");
  const anonStatusPill = document.getElementById("anon-status-pill");
  const qnaError = document.getElementById("qna-error");
  const btnAskAi = document.getElementById("btn-ask-ai");
  const discussionFeed = document.getElementById("discussion-feed");

  if (qnaAnonCheckbox) {
    qnaAnonCheckbox.addEventListener("change", () => {
      if (qnaAnonCheckbox.checked) {
        if (qnaPrivacyNote) qnaPrivacyNote.textContent = "Identitasmu disembunyikan dari anggota lain.";
        if (anonStatusPill) {
          anonStatusPill.textContent = "Mode Anonim Aktif";
          anonStatusPill.className = "status-tag tag-green";
        }
      } else {
        if (qnaPrivacyNote) qnaPrivacyNote.textContent = "Ditampilkan sebagai Rian (Semester 3).";
        if (anonStatusPill) {
          anonStatusPill.textContent = "Mode Nama Asli";
          anonStatusPill.className = "status-tag tag-amber";
        }
      }
    });
  }

  function createForumPost(questionText, isAnonymous, includeAiReply) {
    const article = document.createElement("article");
    article.className = "discussion-card";

    const authorName = isAnonymous ? "Anggota Anonim" : "Rian (Semester 3)";
    const badgeText = isAnonymous ? "Identitas Terlindungi" : "Anggota Kelompok";

    article.innerHTML = `
      <div class="post-author-row">
        <span class="anon-avatar" aria-hidden="true">
          ${
            isAnonymous
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
              : `<span class="mono-text">RN</span>`
          }
        </span>
        <div>
          <div class="author-line">
            <h3 class="post-author">${authorName}</h3>
            <span class="anon-verified-badge">${badgeText}</span>
          </div>
          <p class="post-time">Baru saja · Topik: Diskusi Kelompok</p>
        </div>
      </div>
      <p class="post-body"></p>
      ${
        includeAiReply
          ? `
        <div class="ai-helper-box">
          <div class="ai-box-header">
            <span class="ai-badge">AI Helper</span>
            <span class="ai-sub">Ringkasan otomatis</span>
          </div>
          <p class="ai-helper-text">
            Struktur Given-When-Then yang kamu tulis sudah memenuhi kaidah pengujian fungsional. Pastikan bagian <strong>Then</strong> menyebutkan perubahan antarmuka yang dapat diverifikasi langsung oleh penguji.
          </p>
        </div>
      `
          : ""
      }
    `;

    article.querySelector(".post-body").textContent = questionText;
    discussionFeed.prepend(article);
  }

  if (qnaForm) {
    qnaForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = qnaInput.value.trim();

      if (text.length < 10) {
        qnaError.textContent = "Pertanyaan wajib diisi minimal 10 karakter sebelum dikirim ke forum.";
        qnaError.hidden = false;
        qnaInput.focus();
        return;
      }

      qnaError.hidden = true;
      const isAnon = qnaAnonCheckbox.checked;
      createForumPost(text, isAnon, true);
      qnaInput.value = "";
      showToast(
        isAnon
          ? "Pertanyaan berhasil dikirim sebagai Anggota Anonim."
          : "Pertanyaan berhasil dikirim ke Forum Diskusi."
      );
    });
  }

  if (btnAskAi) {
    btnAskAi.addEventListener("click", () => {
      const text = qnaInput.value.trim();
      if (text.length < 10) {
        qnaError.textContent = "Ketik pertanyaan minimal 10 karakter terlebih dahulu untuk meminta ringkasan AI.";
        qnaError.hidden = false;
        qnaInput.focus();
        return;
      }
      qnaError.hidden = true;
      createForumPost(text, qnaAnonCheckbox.checked, true);
      qnaInput.value = "";
      showToast("AI Helper telah menambahkan ringkasan penjelasan pada pertanyaanmu.");
    });
  }

  // Tombol Reaksi Terbantu pada Diskusi
  if (discussionFeed) {
    discussionFeed.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const btn = target.closest(".btn-helpful");
      if (!btn) return;

      const countSpan = btn.querySelector(".like-count");
      let likes = parseInt(btn.getAttribute("data-likes") || "3", 10);
      const isVoted = btn.classList.toggle("voted");
      likes = isVoted ? likes + 1 : likes - 1;
      btn.setAttribute("data-likes", String(likes));
      if (countSpan) countSpan.textContent = String(likes);
    });
  }

  // ==========================================================================
  // 5. HALAMAN 5: Peer Evaluation (Rating Bintang & Label Makna Dinamis)
  // ==========================================================================
  const evalCards = document.querySelectorAll(".eval-card");
  const peerEvalForm = document.getElementById("peer-eval-form");
  const evalStatusBanner = document.getElementById("eval-status-banner");
  const btnSubmitEval = document.getElementById("btn-submit-eval");

  const ratingLabels = {
    1: "1/5 · Perlu Perbaikan",
    2: "2/5 · Kurang Aktif",
    3: "3/5 · Cukup Kontributif",
    4: "4/5 · Sangat Kontributif",
    5: "5/5 · Luar Biasa & Inisiator"
  };

  evalCards.forEach((card) => {
    const stars = card.querySelectorAll(".star-btn");
    const meaningEl = card.querySelector("[data-meaning]");

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.getAttribute("data-value") || "4", 10);
        card.setAttribute("data-rating", String(rating));

        if (meaningEl && ratingLabels[rating]) {
          meaningEl.textContent = ratingLabels[rating];
        }

        stars.forEach((s) => {
          const val = parseInt(s.getAttribute("data-value") || "1", 10);
          s.classList.toggle("active", val <= rating);
        });
      });
    });
  });

  if (peerEvalForm) {
    peerEvalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let totalRating = 0;
      evalCards.forEach((card) => {
        totalRating += parseInt(card.getAttribute("data-rating") || "4", 10);
      });
      const avg = (totalRating / evalCards.length).toFixed(1);

      if (evalStatusBanner) {
        evalStatusBanner.innerHTML = `
          <span class="status-tag tag-green">Terkirim Rahasia</span>
          <span>Evaluasi berhasil disimpan (Rata-rata skor kontribusi: <strong class="mono-text">${avg}/5.0</strong>).</span>
        `;
      }
      if (btnSubmitEval) {
        btnSubmitEval.textContent = "Evaluasi Telah Dikirim";
      }
      showToast(`Evaluasi rahasia berhasil dikirim! Rata-rata skor kontribusi kelompok: ${avg}/5.0`);
    });
  }

  // Inisialisasi awal
  syncTasksAndDashboard();
  updateScheduleMatcher();
});
