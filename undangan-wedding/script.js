
/* =====================================
   1. PENGATURAN UNDANGAN
===================================== */

// Format: tahun, bulan (0 = Januari), tanggal, jam
const weddingDate = new Date(2027, 3, 24, 9, 0, 0);

// Nama pasangan
const coupleNames = "Daniel & Sarah";

// Nomor WhatsApp tujuan RSVP.
// Ganti dengan nomor WhatsApp keluarga/panitia.
// Gunakan kode negara tanpa tanda + atau spasi.
// Contoh Indonesia: 6281234567890
const whatsappNumber = "6281234567890";

// =====================================
// 2. NAMA TAMU DARI LINK
// =====================================

// Contoh:
// index.html?to=Budi%20Santoso

const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
const guestNameElement = document.getElementById("guestName");

if (guest && guest.trim()) {
  guestNameElement.textContent = guest.trim().slice(0, 100);
}

// =====================================
// 3. BUKA COVER UNDANGAN
// =====================================

const cover = document.getElementById("cover");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicToggle");

openButton.addEventListener("click", async () => {
  cover.classList.add("opened");

  // Beri kesempatan transisi cover selesai.
  setTimeout(() => {
    cover.style.display = "none";
  }, 950);

  // Musik baru dicoba setelah interaksi pengunjung.
  try {
    await music.play();
    musicButton.classList.add("playing");
    musicButton.setAttribute("aria-label", "Hentikan musik");
  } catch (error) {
    // Tetap lanjut walaupun musik belum tersedia.
    console.info("Musik belum tersedia atau gagal diputar.");
  }
});

// =====================================
// 4. TOMBOL MUSIK
// =====================================

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
    } catch (error) {
      alert("Musik belum dapat diputar. Periksa file music.mp3.");
    }
  } else {
    music.pause();
  }
});

music.addEventListener("play", () => {
  musicButton.classList.add("playing");
  musicButton.setAttribute("aria-label", "Hentikan musik");
});

music.addEventListener("pause", () => {
  musicButton.classList.remove("playing");
  musicButton.setAttribute("aria-label", "Putar musik");
});

// =====================================
// 5. NAVIGASI MOBILE
// =====================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Tutup navigasi" : "Buka navigasi"
  );

  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
    menuToggle.textContent = "☰";
  });
});

// Bayangan navbar ketika halaman digulir.
function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

// =====================================
// 6. COUNTDOWN OTOMATIS
// =====================================

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");

function updateCountdown() {
  const now = Date.now();
  const difference = weddingDate.getTime() - now;

  if (difference <= 0) {
    daysElement.textContent = "00";
    hoursElement.textContent = "00";
    minutesElement.textContent = "00";
    secondsElement.textContent = "00";

    countdownMessage.textContent =
      "Hari yang diberkati telah tiba. Tuhan memberkati kita semua.";

    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");

  countdownMessage.textContent = "";
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =====================================
// 7. ANIMASI SAAT SCROLL
// =====================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Fallback untuk browser lama.
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// =====================================
// 8. GALERI LIGHTBOX
// =====================================

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightboxButton = document.getElementById("closeLightbox");

let previousFocus = null;

function openLightbox(button) {
  const image = button.querySelector("img");

  if (!image) return;

  previousFocus = button;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;

  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("no-scroll");

  if (previousFocus) {
    previousFocus.focus();
  }
}

galleryItems.forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(button);
  });
});

closeLightboxButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("active")) {
    closeLightbox();
  }
});

// =====================================
// 9. FORM RSVP KE WHATSAPP
// =====================================

const rsvpForm = document.getElementById("rsvpForm");
const rsvpResult = document.getElementById("rsvpResult");

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(rsvpForm);

  const name = String(formData.get("name") || "").trim();
  const attendance = String(formData.get("attendance") || "");
  const guests = String(formData.get("guests") || "1");
  const message = String(formData.get("message") || "").trim();

  if (!name || !attendance) {
    rsvpResult.textContent =
      "Mohon isi nama dan konfirmasi kehadiran.";
    return;
  }

  // Buat pesan konfirmasi.
  const whatsappMessage = [
    `Konfirmasi Undangan ${coupleNames}`,
    "",
    `Nama: ${name}`,
    `Kehadiran: ${attendance}`,
    `Jumlah tamu: ${attendance === "Hadir" ? guests : "-"}`,
    `Ucapan / doa: ${message || "-"}`,
  ].join("\n");

  // Validasi nomor WhatsApp tujuan.
  const validNumber = /^\d{10,15}$/.test(whatsappNumber);

  if (!validNumber || whatsappNumber === "6281234567890") {
    rsvpResult.textContent =
      "Silakan atur nomor WhatsApp tujuan pada script.js sebelum menggunakan RSVP.";
    return;
  }

  const whatsappURL =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  rsvpResult.textContent =
    "Konfirmasi siap dikirim. WhatsApp akan dibuka.";

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

// =====================================
// 10. BAGIKAN LINK UNDANGAN
// =====================================

const shareButton = document.getElementById("shareButton");

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: `Undangan Pernikahan ${coupleNames}`,
    text: `Dengan sukacita, kami mengundang Anda ke pernikahan ${coupleNames}.`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(shareData.url);

      shareButton.textContent = "✓ Link berhasil disalin";

      setTimeout(() => {
        shareButton.textContent = "↗ Bagikan Undangan";
      }, 2500);
    } else {
      window.prompt("Salin link undangan ini:", shareData.url);
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      window.prompt("Salin link undangan ini:", shareData.url);
    }
  }
});

// =====================================
// 11. JUDUL HALAMAN
// =====================================

document.title = `Undangan Pernikahan | ${coupleNames}`;

console.log("Undangan pernikahan berhasil dimuat.");
