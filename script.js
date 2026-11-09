/**
 * ============================================================================
 * TEMANBELAJAR — SCRIPT INTERAKTIVITAS LENGKAP 5 HALAMAN (M07)
 * Mencakup:
 * 1. Navigasi SPA 5 Halaman (Dashboard, Task Manager, Schedule Matcher,
 *    Forum Q&A Anonim, Peer Evaluation) & Mobile Drawer Toggle
 * 2. Klaim Tugas Mandiri, Filter Status, & Sinkronisasi Real-Time ke Dashboard
 * 3. Interaksi Matriks Schedule Matcher & Penetapan Irisan Jadwal 4/4 (KF-2)
 * 4. Validasi Form Forum Q&A Anonim, Toggle Privasi, & Balasan AI Helper (KF-4)
 * 5. Interaksi Rating Bintang Rahasia pada Peer Evaluation (KF-5)
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
    }, 3800);
  }

  // ==========================================================================
  // 1. KOMPONEN 1 & 2: Navigasi Antarhalaman (5 Halaman Figma) & Mobile Drawer
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

  // Pintasan dari Dashboard ke Schedule Matcher & Task Manager
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
      showToast("🔔 Pengingat Otomatis (H-2 Jam): Jadwal Kumpul Kelompok hari ini pukul 19:00 WIB.");
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
        unclaimedItems.push({ title, weight, deadline });
      }
    });

    // Update badge tab filter di Task Manager
    document.getElementById("badge-all").textContent = String(cards.length);
    document.getElementById("badge-tersedia").textContent = String(statusCounts.tersedia);
    document.getElementById("badge-dikerjakan").textContent = String(statusCounts.dikerjakan);
    document.getElementById("badge-selesai").textContent = String(statusCounts.selesai);

    // Update bar beban tugas di Task Manager & daftar distribusi di Dashboard
    const updateMemberUI = (key, count) => {
      const tmCount = document.getElementById(`tm-count-${key}`);
      const tmBar = document.getElementById(`tm-bar-${key}`);
      const dashCount = document.getElementById(`dash-count-${key}`);

      if (tmCount) tmCount.textContent = `${count} tugas`;
      if (dashCount) dashCount.textContent = `${count} tugas`;
      if (tmBar) {
        const widthPct = count === 0 ? 0 : Math.min(100, count * 35);
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
            <p class="unclaimed-preview-title">Semua sub-tugas telah diklaim!</p>
            <p class="unclaimed-preview-meta">Tidak ada sub-tugas yang menunggu penanggung jawab.</p>
          </div>
        `;
      } else {
        unclaimedItems.forEach((item) => {
          const div = document.createElement("div");
          div.className = "unclaimed-preview-item";
          div.innerHTML = `
            <p class="unclaimed-preview-title">${item.title}</p>
            <p class="unclaimed-preview-meta">Beban: ${item.weight} &nbsp;·&nbsp; Deadline: ${item.deadline}</p>
            <p class="unclaimed-preview-meta">Penanggung Jawab: Belum ada</p>
          `;
          dashUnclaimedList.appendChild(div);
        });
      }
    }

    // Update kartu progres di Dashboard
    const completedBase = 2 + statusCounts.selesai;
    const totalProjectTasks = 5;
    const pct = Math.min(100, Math.round((completedBase / totalProjectTasks) * 100));
    const dashProgressText = document.getElementById("dash-progress-text");
    const dashProgressBar = document.getElementById("dash-progress-bar");
    if (dashProgressText) dashProgressText.textContent = `${completedBase}/${totalProjectTasks} Selesai (${pct}%)`;
    if (dashProgressBar) dashProgressBar.style.width = `${pct}%`;

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
      const picSpan = card.querySelector(".task-pic span");
      const actions = card.querySelector(".task-actions");

      if (btn.classList.contains("btn-claim")) {
        card.setAttribute("data-status", "dikerjakan");
        card.setAttribute("data-owner", "Rian (Kamu)");
        if (badge) badge.textContent = "Dikerjakan";
        if (picSpan) picSpan.textContent = "Rian (Kamu)";
        if (actions) {
          actions.innerHTML = `
            <button type="button" class="btn-secondary btn-unclaim">Batalkan Klaim</button>
            <button type="button" class="btn-primary btn-complete">Tandai Selesai</button>
          `;
        }
        syncTasksAndDashboard();
        showToast(`Berhasil! Tugas "${title}" telah diklaim atas nama Rian (Kamu).`);
      } else if (btn.classList.contains("btn-unclaim")) {
        card.setAttribute("data-status", "tersedia");
        card.setAttribute("data-owner", "");
        if (badge) badge.textContent = "Tersedia";
        if (picSpan) picSpan.textContent = "Belum ada";
        if (actions) {
          actions.innerHTML = `<button type="button" class="btn-primary btn-claim">Klaim Tugas</button>`;
        }
        syncTasksAndDashboard();
        showToast(`Klaim pada "${title}" dibatalkan.`);
      } else if (btn.classList.contains("btn-complete")) {
        card.setAttribute("data-status", "selesai");
        if (badge) badge.textContent = "Selesai";
        if (actions) {
          actions.innerHTML = `<button type="button" class="btn-secondary btn-unclaim">Buka Kembali</button>`;
        }
        syncTasksAndDashboard();
        showToast(`Mantap! Tugas "${title}" telah ditandai Selesai.`);
      }
    });
  }

  // ==========================================================================
  // 3. HALAMAN 3: Schedule Matcher (Matriks Input Jadwal & Irisan 4/4)
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
      const totalAvailable = others + (isSelected ? 1 : 0);

      if (isSelected) selectedCount += 1;

      const heatCell = document.querySelector(`[data-heat="${day}-${time}"]`);
      if (heatCell) {
        heatCell.textContent = `${totalAvailable}/4`;
        heatCell.className = "heat-cell";
        if (totalAvailable === 4) {
          heatCell.classList.add("heat-match");
          fullMatchSlot = `${day}, ${time} - 21:00`;
        } else if (totalAvailable >= 2) {
          heatCell.classList.add("heat-mid");
        }
      }
    });

    if (selectedSlotsCount) {
      selectedSlotsCount.textContent = String(selectedCount);
    }

    if (fullMatchSlot) {
      if (selectedSlotsDetail) selectedSlotsDetail.textContent = `Termasuk ${fullMatchSlot}.`;
      if (bestMatchTitle) bestMatchTitle.textContent = fullMatchSlot;
      if (bestMatchSubtitle) bestMatchSubtitle.textContent = "4/4 Anggota Cocok!";
    } else {
      if (selectedSlotsDetail) selectedSlotsDetail.textContent = "Pilih Rabu 19:00 agar cocok 4/4 anggota.";
      if (bestMatchTitle) bestMatchTitle.textContent = "Belum ada irisan 4/4";
      if (bestMatchSubtitle) bestMatchSubtitle.textContent = "Maksimal 3/4 anggota cocok saat ini.";
    }
  }

  slotButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isSelected = btn.classList.toggle("selected");
      btn.textContent = isSelected ? "✓" : "—";
      updateScheduleMatcher();
    });
  });

  if (btnSaveSchedule) {
    btnSaveSchedule.addEventListener("click", () => {
      showToast("✅ Jadwal kosongmu berhasil disimpan dan peta irisan kelompok telah diperbarui!");
    });
  }

  if (btnConfirmSchedule) {
    btnConfirmSchedule.addEventListener("click", () => {
      showToast("✅ Jadwal Kumpul Rabu, 19:00 WIB berhasil ditetapkan! Pengingat otomatis H-2 jam diaktifkan.");
    });
  }

  // ==========================================================================
  // 4. KOMPONEN 5: Forum Q&A Anonim (Validasi Form, Toggle Anonim, & AI Helper)
  // ==========================================================================
  const qnaForm = document.getElementById("qna-form");
  const qnaInput = document.getElementById("qna-input");
  const qnaAnonCheckbox = document.getElementById("qna-anon-checkbox");
  const qnaPrivacyNote = document.getElementById("qna-privacy-note");
  const qnaError = document.getElementById("qna-error");
  const btnAskAi = document.getElementById("btn-ask-ai");
  const discussionFeed = document.getElementById("discussion-feed");

  if (qnaAnonCheckbox && qnaPrivacyNote) {
    qnaAnonCheckbox.addEventListener("change", () => {
      if (qnaAnonCheckbox.checked) {
        qnaPrivacyNote.textContent = "🛡️ Identitasmu tidak ditampilkan pada kiriman.";
      } else {
        qnaPrivacyNote.textContent = "👤 Kiriman akan ditampilkan atas nama Rian (Smt 3).";
      }
    });
  }

  function createForumPost(questionText, isAnonymous, includeAiReply) {
    const article = document.createElement("article");
    article.className = "discussion-card";

    const authorName = isAnonymous ? "Anggota Anonim" : "Rian (Smt 3)";
    const avatarLabel = isAnonymous ? "👤" : "R";

    article.innerHTML = `
      <div class="post-author-row">
        <span class="anon-avatar" aria-hidden="true">${avatarLabel}</span>
        <div>
          <h3 class="post-author">${authorName}</h3>
          <p class="post-time">Baru saja · Materi UX</p>
        </div>
      </div>
      <p class="post-body"></p>
      ${
        includeAiReply
          ? `
        <div class="ai-helper-box">
          <p class="ai-helper-title">✨ AI Helper</p>
          <p class="ai-helper-text">
            Format Given-When-Then yang kamu tulis sudah tepat! Pastikan bagian <strong>Then</strong> menyebutkan perubahan antarmuka yang terukur (mis. nama penanggung jawab muncul otomatis dan status berubah menjadi "Dikerjakan").
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
        qnaError.textContent = "⚠️ Pertanyaan wajib diisi minimal 10 karakter sebelum dikirim ke forum.";
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
          ? "✅ Pertanyaan berhasil dikirim secara Anonim tanpa menampilkan nama & foto profil!"
          : "✅ Pertanyaan berhasil dikirim ke Forum Diskusi!"
      );
    });
  }

  if (btnAskAi) {
    btnAskAi.addEventListener("click", () => {
      const text = qnaInput.value.trim();
      if (text.length < 10) {
        qnaError.textContent = "⚠️ Ketik pertanyaan minimal 10 karakter terlebih dahulu untuk bertanya ke AI.";
        qnaError.hidden = false;
        qnaInput.focus();
        return;
      }
      qnaError.hidden = true;
      createForumPost(text, qnaAnonCheckbox.checked, true);
      qnaInput.value = "";
      showToast("✨ AI Helper telah menambahkan penjelasan pada utas pertanyaanmu!");
    });
  }

  // ==========================================================================
  // 5. HALAMAN 5: Peer Evaluation (Rating Bintang Interaktif Rahasia)
  // ==========================================================================
  const evalCards = document.querySelectorAll(".eval-card");
  const peerEvalForm = document.getElementById("peer-eval-form");
  const evalStatusBanner = document.getElementById("eval-status-banner");
  const btnSubmitEval = document.getElementById("btn-submit-eval");

  evalCards.forEach((card) => {
    const stars = card.querySelectorAll(".star-btn");
    stars.forEach((star) => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.getAttribute("data-value") || "4", 10);
        card.setAttribute("data-rating", String(rating));

        stars.forEach((s) => {
          const val = parseInt(s.getAttribute("data-value") || "1", 10);
          if (val <= rating) {
            s.classList.add("active");
            s.textContent = "★";
          } else {
            s.classList.remove("active");
            s.textContent = "☆";
          }
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
        evalStatusBanner.textContent = `✅ Berhasil! Evaluasi rahasia telah dikirim (Rata-rata penilaian: ${avg}/5.0 bintang). Identitasmu tetap dirahasiakan.`;
      }
      if (btnSubmitEval) {
        btnSubmitEval.textContent = "Evaluasi Telah Dikirim";
      }
      showToast(`✅ Evaluasi rahasia berhasil dikirim! Rata-rata skor kontribusi: ${avg} ★`);
    });
  }

  // Inisialisasi awal
  syncTasksAndDashboard();
  updateScheduleMatcher();
});
