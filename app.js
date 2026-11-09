/* ============================================================
   🌸 HAPPY BIRTHDAY — Suhaila · app.js
   ============================================================ */
"use strict";

/* ============ 1. KONFIGURASI UTAMA ============ */
const BIRTHDAY_CONFIG = {
  recipientName: "Suhaila",
  senderName: "Hanif Muslim",
  birthdayDate: "10 November",
  targetDateWIB: "2026-11-10T00:00:00+07:00", // 10 Nov 2026, 00.00 WIB
  secretPIN: "101110",
  whatsappNumber: "6283836567878", // ⚠️ GANTI dengan nomor WhatsApp kamu
  playlist: [
    { title: "About You",  artist: "The 1975", src: "assets/1975.mp3",    chorusStart: 20 },
    { title: "Pretty",     artist: "JVKE",     src: "assets/pretty.mp3",  chorusStart: 1 },
    { title: "Beautiful",  artist: "Bazzi",    src: "assets/bazzi.mp3",   chorusStart: 13 }
  ]
  /* 💡 setiap lagu oleh-otomatis mulai di detik chorusStart (tanpa tombol) — sesuaikan menitnya di sini */
};

/* ============ 2. HELPERS ============ */
const $  = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const now = () => performance.now();

/* ============ 3. PABRIK BUNGA SVG ============ */
const PINKS   = ["#F8D0D8", "#FDEBEF", "#F5B3BF", "#EC9FAC"];
const CREAMS  = ["#F9E9C1", "#FEF7E4", "#FDF6E7"];
/* kuning lembut khusus partikel hiasan — kelopak nyaris menyatu dengan bg, hanya titik hijau tengah yang menonjol */
const YELLOWS = ["#F4E6A8", "#F5E9BB", "#F2DF97"];

function makeFlower({ size = 30, petal = "#F8D0D8", center = "#F9E9C1", petals = 5 } = {}) {
  let shapes = "";
  for (let i = 0; i < petals; i++) {
    const a = (360 / petals) * i;
    shapes += `<ellipse cx="20" cy="11.5" rx="4.4" ry="7.6" fill="${petal}" transform="rotate(${a} 20 20)"/>`;
  }
  return `<svg viewBox="0 0 40 40" aria-hidden="true">${shapes}<circle cx="20" cy="20" r="${petals > 5 ? 3.6 : 4.3}" fill="${center}"/></svg>`;
}

/* Ikon 7 bunga buket — emoji, sesuai pilihanmu */
const FLOWER_EMOJI = {
  rose: "🌹",
  tulip: "🌷",
  sakura: "🌸",
  peony: "🌺",
  daisy: "🌼",
  sunflower: "🌻",
  lily: "💐"
};

/* Daftar bunga buket (posisi %, ukuran, quote persis sesuai spesifikasi) */
const BOUQUET_FLOWERS = [
  { key: "rose",      name: "Rose",           pos: [10, 30], size: 33,
    quote: `Seperti mawar yang tetap tumbuh di antara duri, semoga ka shua selalu ada kekuatan buat lewatin semua tantangan kesulitan dan tetap mekar dengan indah.` },
  { key: "tulip",     name: "Tulip",          pos: [27, 8],  size: 35,
    quote: `Nggak perlu buru-buru ngejar semuanya. Setiap orang punya waktunya masing-masing untuk berkembang. Tetap semangat, nikmati prosesnya, dan jangan lupa kasih diri sendiri waktu untuk istirahat juga.` },
  { key: "sakura",    name: "Cherry Blossom", pos: [50, 0],  size: 36,
    quote: `Seperti bunga sakura yang mekar hanya sementara, jangan lupa menikmati setiap momen indah dalam hidup. Nggak semua hal harus bertahan selamanya untuk bisa dikenang.` },
  { key: "peony",     name: "Peony",          pos: [71, 10], size: 34,
    quote: `Kayak bunga kembang sepatu yang lagi mekar penuh, senyum ka shua selalu ceria dan bersinar.` },
  { key: "daisy",     name: "Daisy",          pos: [90, 30], size: 37,
    quote: `Ka shua itu kayak bunga daisy, sederhana tapi selalu ada cara sendiri buat bikin suasana hati jadi lebih menyenangkan. Tetap jadi diri sendiri yang ceria yaaa!` },
  { key: "sunflower", name: "Sunflower",      pos: [38, 36], size: 35,
    quote: `Semoga ka shua selalu ada alasan buat bangkit setiap kali hari terasa berat. Nggak harus selalu ceria, yang penting jangan kehilangan semangat untuk mencari hal-hal baik di sekitarmu.` },
  { key: "lily",      name: "Lily",           pos: [64, 42], size: 33,
    quote: `Aku harap ka shua punya banyak hal - hal baik buat ditemuin. Aku doain hari-hari ka shua dipenuhi cerita menyenangkan, orang-orang baik, dan kebahagiaan kecil yang datang tanpa disangka.` }
];

/* ============ 4. PARTIKEL BUNGA MELAYANG ============ */
function flowerIconList() {
  return [
    { petal: pick(PINKS),  center: "#FDF6E7" },
    /* kuning/emas — cream dihapus karena nyaris menyatu dgn background (th. revisi amplop) */
    { petal: pick(["#F2DF97", "#F4E6A8", "#E2B451"]), center: "#2C5340" },
    { petal: pick(PINKS),  center: "#F9E9C1" }
  ];
}
/* palet partikel: pink + kuning menyatu-bg (pengganti cream), tanpa mengubah overlay/buket */
function particleFlowerColors() {
  return [
    { petal: pick(PINKS),   center: "#FDF6E7" },
    { petal: pick(YELLOWS), center: "#2C5340" },
    { petal: pick(PINKS),   center: "#F9E9C1" }
  ];
}
function spawnParticles(box, mult = 1) {
  const n = Math.round((+box.dataset.particles || 8) * mult);
  const maxTop = +box.dataset.maxTop || 100;
  for (let i = 0; i < n; i++) {
    const li = document.createElement("li");
    li.className = "particle";
    const s = rnd(15, 34);
    li.style.left = rnd(2, 97) + "%";
    li.style.top  = rnd(0, maxTop) + "%";
    li.style.width = s + "px";
    li.style.height = s + "px";
    li.style.opacity = rnd(0.4, 0.85).toFixed(2);
    li.style.setProperty("--dur",   rnd(4, 8).toFixed(2) + "s");
    li.style.setProperty("--delay", (-rnd(0, 6)).toFixed(2) + "s");
    li.style.setProperty("--rise",  rnd(16, 40).toFixed(0) + "px");
    li.style.setProperty("--rot",   rnd(14, 46).toFixed(0) + "deg");
    li.innerHTML = makeFlower(pick(particleFlowerColors()));
    box.appendChild(li);
  }
}

/* ============ 5. STAGE MACHINE ============ */
const stages = { load: $("#stage-load"), pin: $("#stage-pin"), count: $("#stage-count"),
                 envelope: $("#stage-envelope"), main: $("#stage-main") };
let envelopeDone = false, wished = false;

function showStage(name) {
  Object.values(stages).forEach(s => s.classList.remove("active"));
  stages[name]?.classList.add("active");
  if (name === "main" && !envelopeDone) envelopeDone = true;
  if (name === "main") {
    document.body.classList.add("unlocked");
    window.scrollTo({ top: 0, behavior: "instant" });
    $("#audioWidget").classList.add("show");
    initReveal(); /* aktifkan reveal-on-scroll */
    startTaglineTyping(); /* efek ketik tagline hero */
    initHeroFixed(); /* bunga tetap milik hero + pudar saat scroll */
  }
}
/* ============ 6. LOADING → PIN ============ */
function bootDecor() {
  const loader = $("#loaderFlower");
  if (loader) loader.innerHTML = makeFlower({ size: 78, petal: "#F5B7C2", center: "#FEF7E4", petals: 5 });
  const badge = $("#pinBadge");
  if (badge) badge.innerHTML =
    `<svg viewBox="0 0 60 60" aria-hidden="true">
      <path d="M30 52 q-3 -10 1 -17 M30 52 q3 -8 -1 -17" stroke="#2C5942" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M31 36 c8 -2 12 -8 11 -15 c-8 1 -13 7 -13 14z" fill="#2C5942"/>
      ${[0,60,120,180,240,300].map(a=>`<ellipse cx="30" cy="17" rx="6.2" ry="10.5" fill="#F5B7C2" transform="rotate(${a} 30 32)"/>`).join("")}
      <circle cx="30" cy="32" r="5" fill="#FDF6E7"/>
    </svg>`;
  $$(".seal-flower").forEach(el => { el.innerHTML = makeFlower({ size: 30, petal: "#FEF7E4", center: "#EDB6BF" }); });
  $$(".v-label-flower").forEach(el => { el.innerHTML = makeFlower({ size: 64, petal: "#F8D0D8", center: "#FEF7E4" }); });
  const tf = $(".title-flower"), bf = $(".m-badge-flower");
  if (tf) tf.innerHTML = makeFlower({ size: 30, petal: "#F5B7C2", center: "#FEF7E4" });
  if (bf) bf.innerHTML = makeFlower({ size: 46, petal: "#F5B7C2", center: "#FEF7E4" });
  $$(".ow-icon").forEach(el => { el.innerHTML = miniEnvelopeSVG(); });
  const ov = $("#floralOverlay");
  if (ov && !ov.childElementCount) {
    const grid = document.createElement("div");
    grid.className = "ov-flowers";
    for (let i = 0; i < 28; i++) {
      const d = document.createElement("div");
      d.className = "ov-flower";
      const s = rnd(26, 58);
      d.style.width = s + "px"; d.style.height = s + "px";
      d.style.animationDelay = (i * 18) + "ms";
      d.innerHTML = makeFlower(pick(flowerIconList()));
      grid.appendChild(d);
    }
    ov.appendChild(grid);
  }
}
function miniEnvelopeSVG() {
  return `<svg viewBox="0 0 64 46" aria-hidden="true">
    <rect x="2" y="4" width="60" height="38" rx="5.5" fill="#F5E8C9" stroke="#DCD6C0" stroke-width="1.2"/>
    <path d="M4 7 L32 28 L60 7" fill="none" stroke="#E3B4BF" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M32 37 c-2-1.6-5-3.6-5-6 0-1.7 1.3-3 3-3 1 0 1.7 .5 2 1.3 .3-.8 1-1.3 2-1.3 1.7 0 3 1.3 3 3 0 2.4-3 4.4-5 6z" fill="#EC9FAC"/>
  </svg>`;
}
function initParticlesAll() {
  /* halaman scroll utama dibuat lebih ramai (×1.7); stage lain tetap */
  $$("[data-particles]").forEach(box => spawnParticles(box, box.closest("#stage-main") ? 1.3 : 1));
}

/* ============ 7. SISTEM PIN ============ */
let pinInput = "";
const pinDots = () => $$("#pinDots .dot");
function refreshDots() {
  pinDots().forEach((d, i) => d.classList.toggle("filled", i < pinInput.length));
}
function handlePin(key) {
  const card = $("#pinCard");
  if (key === "clear") { pinInput = ""; refreshDots(); return; }
  if (key === "submit") {
    if (pinInput.length < 6) return;
    if (pinInput === BIRTHDAY_CONFIG.secretPIN) {
      refreshDots();
      setTimeout(() => pinSuccess(), 240);
    } else {
      card.classList.add("shake");
      setTimeout(() => { card.classList.remove("shake"); pinInput = ""; refreshDots(); }, 520);
    }
    return;
  }
  if (pinInput.length >= 6) return;
  pinInput += key;
  refreshDots();
}
function pinSuccess() {
  const reached = Date.now() >= new Date(BIRTHDAY_CONFIG.targetDateWIB).getTime();
  if (reached) showStage("envelope");
  else { showStage("count"); startCountdown(); }
}
$("#keypad").addEventListener("click", e => {
  const btn = e.target.closest(".key");
  if (btn) handlePin(btn.dataset.key);
});
document.addEventListener("keydown", e => {
  if (!stages.pin.classList.contains("active")) return;
  if (/^[0-9]$/.test(e.key)) handlePin(e.key);
  else if (e.key === "Backspace" || e.key.toLowerCase() === "x") handlePin("clear");
  else if (e.key === "Enter") handlePin("submit");
});

/* ============ 8. COUNTDOWN WIB ============ */
const TARGET = new Date(BIRTHDAY_CONFIG.targetDateWIB).getTime();
let countTimer = null;
function startCountdown() {
  if (countTimer) clearInterval(countTimer);
  const el = { d: $("#cDays"), h: $("#cHours"), m: $("#cMins"), s: $("#cSecs") };
  const tick = () => {
    let diff = TARGET - Date.now();
    if (diff <= 0) { clearInterval(countTimer); countTimer = null; showStage("envelope"); return; }
    el.d.textContent = pad(Math.floor(diff / 864e5));
    el.h.textContent = pad(Math.floor(diff % 864e5 / 36e5));
    el.m.textContent = pad(Math.floor(diff % 36e5 / 6e4));
    el.s.textContent = pad(Math.floor(diff % 6e4 / 1e3));
  };
  tick();
  countTimer = setInterval(tick, 1000);
}

/* ============ 9. ENVELOPE → FLORAL CROSSFADE → MAIN ============ */
const envelope = $("#envelope");
let opened = false;
function openEnvelope() {
  if (opened) return;
  opened = true;
  startAudio(); // autoplay dimulai dari interaksi pengguna (kebijakan browser)
  envelope.classList.add("open");
  $("#envTap").classList.add("hide");
  const bloom = $(".bloom", envelope);
  const layer = $("#petalsLayer");
  setTimeout(() => bloom.classList.add("on"), 260);
  /* kelopak bunga muncul berkelipatan */
  const wave = (n, cx, cy) => {
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const s = rnd(13, 26);
      p.style.left = cx + "%";
      p.style.top = cy + "%";
      p.style.width = s + "px"; p.style.height = s + "px";
      p.style.setProperty("--tx", rnd(-300, 300).toFixed(0) + "px");
      p.style.setProperty("--ty", rnd(-330, -60).toFixed(0) + "px");
      p.style.setProperty("--rr", rnd(-160, 160).toFixed(0) + "deg");
      p.style.animationDelay = rnd(0, .25).toFixed(2) + "s";
      /* cream (#F9E9C1) & pink putih pucat (#FDEBEF) diganti kuning/coklat muda — jangan menyatu dgn bg (th. revisi amplop) */
      p.innerHTML = makeFlower({ size: s, petal: pick(["#F8D0D8", "#F5B7C2", "#F2DF97", "#ECDAC4"]), center: "#FEF7E4" });
      layer.appendChild(p);
      setTimeout(() => p.remove(), 2600);
    }
  };
  setTimeout(() => wave(9, 47, 52), 380);
  setTimeout(() => wave(8, 53, 48), 660);
  setTimeout(() => wave(9, 50, 55), 940);
  /* crossfade overlay bunga → stage utama */
  const ov = $("#floralOverlay");
  setTimeout(() => ov.classList.add("on"), 1500);
  setTimeout(() => showStage("main"), 2450);
  setTimeout(() => { ov.classList.add("away"); ov.style.pointerEvents = "none"; }, 2900);
  setTimeout(() => ov.remove(), 4400);
}
envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openEnvelope(); });
/* ============ 10. AUDIO ENGINE ============ */
const audio = new Audio();
audio.preload = "metadata";
audio.volume = .8;
let trackIdx = 0, fmtDuration = "—";

const ui = {
  vTitle: $("#vinyl") ? $("#pArtist") : null, pTrack: $("#pTrack"), pArtist: $("#pArtist"),
  pCur: $("#pCur"), pDur: $("#pDur"), prog: $("#prog"),
  btnPlay: $("#btnPlay"), btnPrev: $("#btnPrev"), btnNext: $("#btnNext"),
  awPlay: $("#awPlay"), awMute: $("#awMute"), awTitle: $("#awTitle"), awArtist: $("#awArtist"),
  widget: $("#audioWidget"), queue: $("#queue"), vinyl: $("#vinyl")
};
function loadTrack(i, tryPlay = true) {
  trackIdx = (i + BIRTHDAY_CONFIG.playlist.length) % BIRTHDAY_CONFIG.playlist.length;
  const t = BIRTHDAY_CONFIG.playlist[trackIdx];
  audio.src = t.src;
  ui.pTrack.textContent = t.title;
  ui.pArtist.textContent = t.artist;
  ui.awTitle.textContent = t.title;
  ui.awArtist.textContent = t.artist;
  ui.pCur.textContent = "0:00";
  ui.pDur.textContent = "—";
  ui.prog.value = 0;
  ui.prog.disabled = true;
  paintProg(0);
  markQueue();
  if (tryPlay) play();
  else if (!audio.paused) audio.pause();
  setPlaying(false);
}
function play() {
  audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
}
function togglePlay() { audio.paused ? play() : (audio.pause(), setPlaying(false)); }
function setPlaying(playing) {
  ui.widget.classList.toggle("playing", playing);
  /* ikon = kondisi saat ini: play → ikon play, pause → ikon pause (berubah tiap ditekan) */
  $$("svg.ic-play", ui.widget).forEach(s => s.hidden = !playing);
  $$("svg.ic-pause", ui.widget).forEach(s => s.hidden = playing);
  $$("svg.ic-play", ui.btnPlay).forEach(s => s.hidden = !playing);
  $$("svg.ic-pause", ui.btnPlay).forEach(s => s.hidden = playing);
  /* penanda warna tambahan: pause → tombol pink, play → hijau (ikon tidak mungkin terlewat) */
  ui.btnPlay.classList.toggle("paused", !playing);
  ui.vinyl.classList.toggle("spin", playing);
  const cur = $("li.current", ui.queue);
  if (cur) cur.classList.toggle("is-playing", playing);
}
function markQueue() {
  $$("#queue li").forEach((li, i) => li.classList.toggle("current", i === trackIdx));
}
function startAudio() {
  if (audio.src) { play(); return; }
  loadTrack(0, true);
}
ui.btnPlay.addEventListener("click", () => audio.src ? togglePlay() : loadTrack(0, true));
ui.awPlay.addEventListener("click", () => audio.src ? togglePlay() : loadTrack(0, true));
ui.btnPrev.addEventListener("click", () => loadTrack(trackIdx - 1));
ui.btnNext.addEventListener("click", () => loadTrack(trackIdx + 1));
ui.awMute.addEventListener("click", () => {
  audio.muted = !audio.muted;
  $("svg.ic-vol", ui.widget).hidden = audio.muted;   /* tak dimute → ikon speaker */
  $("svg.ic-mute", ui.widget).hidden = !audio.muted; /* dimute → ikon speaker-silang */
  ui.awMute.classList.toggle("muted", audio.muted);  /* tombol ikut berwarna biar kelihatan */
});

/* ============ 10b. MULAI DARI DETIK chorusStart · default tanpa tombol ============ */
function applyChorusSeek() {
  const t = BIRTHDAY_CONFIG.playlist[trackIdx];
  if (!t || !isFinite(t.chorusStart)) return;
  const at = Math.min(t.chorusStart, audio.duration || t.chorusStart);
  try { audio.currentTime = at; } catch (e) { /* durasi belum siap */ }
  ui.pCur.textContent = secStr(at);
  paintProg(at / (audio.duration || 1) * 100);
}
const secStr = t => { if (!isFinite(t)) return "—"; return `${Math.floor(t / 60)}:${pad(Math.floor(t % 60))}`; };
audio.addEventListener("loadedmetadata", () => {
  ui.prog.disabled = false;
  ui.prog.max = audio.duration || 0;
  ui.pDur.textContent = secStr(audio.duration);
  applyChorusSeek(); /* default: lagu selalu dimulai dari detik chorusStart */
});
audio.addEventListener("timeupdate", () => {
  if (!ui.prog.max) return;
  ui.prog.value = audio.currentTime;
  ui.pCur.textContent = secStr(audio.currentTime);
  paintProg(audio.currentTime / audio.duration * 100);
});
audio.addEventListener("ended", () => loadTrack(trackIdx + 1));
ui.prog.addEventListener("input", () => {
  if (!ui.prog.disabled) {
    audio.currentTime = +ui.prog.value;
    paintProg(+ui.prog.value / (ui.prog.max || 1) * 100);
  }
});
function paintProg(p) { p = Math.min(100, Math.max(0, p || 0));
  ui.prog.style.background = `linear-gradient(90deg,var(--pink-deep) ${p}%,rgba(30,65,45,.16) ${p}%)`; }
/* render antrean lagu */
BIRTHDAY_CONFIG.playlist.forEach((t, i) => {
  const li = document.createElement("li");
  li.innerHTML = `<span class="q-num">${pad(i + 1)}</span>
    <span class="q-meta"><b>${t.title}</b><span>${t.artist}</span></span>
    <span class="q-eq" aria-hidden="true"><i></i><i></i><i></i></span>
    <svg class="q-note" viewBox="0 0 24 24"><path d="M9 17.5V6l9-2v3.2L11.4 8.7V17.5a2.6 2.6 0 1 1-2.4-2.6z" fill="currentColor"/></svg>`;
  li.addEventListener("click", () => loadTrack(i, true));
  ui.queue.appendChild(li);
});
loadTrack(0, false);

/* ============ 11. BOUQUET ============ */
const field = $("#bField");
BOUQUET_FLOWERS.forEach(f => {
  const btn = document.createElement("button");
  btn.className = "b-flower";
  btn.setAttribute("aria-label", f.name);
  const clampSize = base => `clamp(${Math.round(base * .62)}px, ${(base / 4.2).toFixed(1)}vw, ${base}px)`;
  btn.style.left = f.pos[0] + "%";
  btn.style.top = f.pos[1] + "%";
  btn.style.width = clampSize(f.size);
  btn.style.fontSize = Math.round(f.size) + "px"; /* ukuran emoji mengikuti ukuran bunga lama */
  btn.innerHTML = `<span class="f-inner">${FLOWER_EMOJI[f.key]}</span>`;
  btn.addEventListener("click", () => {
    btn.classList.remove("active"); void btn.offsetWidth; btn.classList.add("active");
    spawnMiniFlowers(btn); /* bunga kecil bermekaran di sekitar bunga yang diketuk */
    const q = $("#bQuote");
    q.classList.add("swap");
    setTimeout(() => {
      $("#quoteText").textContent = `“${f.quote}”`;
      $("#quoteName").textContent = f.name;
      q.classList.remove("swap");
    }, 300);
  });
  field.appendChild(btn);
});

/* burst bunga kecil di sekitar bunga buket yang baru diketuk */
function spawnMiniFlowers(btn) {
  for (let i = 0; i < 7; i++) {
    const s = document.createElement("span");
    s.className = "mini-flower";
    const sz = rnd(11, 19);
    const ang = (Math.PI * 2 * i) / 7 + rnd(-.35, .35);
    const dist = rnd(36, 62);
    s.style.width = s.style.height = sz + "px";
    s.style.setProperty("--dx", (Math.cos(ang) * dist).toFixed(0) + "px");
    s.style.setProperty("--dy", (Math.sin(ang) * dist - 12).toFixed(0) + "px");
    s.style.setProperty("--rot", rnd(90, 270).toFixed(0) + "deg");
    s.innerHTML = makeFlower({ size: sz, petal: pick(["#F8D0D8", "#FDEBEF", "#F5B3BF", "#F4E6A8"]),
                               center: pick(["#F9E9C1", "#2C5340"]) });
    btn.appendChild(s);
    setTimeout(() => s.remove(), 1150);
  }
}

/* ============ 12. MODAL OPEN-WHEN ============ */
const OW_CONTENT = {
  sedih: { title: "Untuk Hari-Hari Yang Terasa Berat",
    body: `Haloo… kalo buka surat ini, barti hari ini lagi kerasa berat yaa. Aku cuma mau bilang, inget kalo ka shua engga pernah sendirian. Semua perasaan lelah dan sedih itu valid, tapi jangan biarkan perasaan itu menetap terlalu lama. Tarik napas panjang, istirahat dulu, Pelan-pelan aja, nggak perlu memaksakan semuanya harus selesai hari ini. Semoga besok jadi hari yang lebih baik dan selalu punya semangat untuk lewati apa pun. Jangan lupa apresiasi diri sendiri karena sudah berusaha sejauh ini. 🤍` },
  insecure: { title: "Saat Kamu Mulai Meragukan Dirimu Sendiri",
    body: `Hei Heii, kok bisa bisanya orang sebaik dan secantik bidadari ini ngerasa insecure. Jangan terlalu keras sama diri sendiri yaa. Ka shua nggak harus jadi kayak orang lain buat keliatan menarik. Jadi diri sendiri juga udah lebih dari cukup. Nggak perlu terus ngebandingin diri sendiri sama standar orang lain. Coba sesekali lihat dari sudut pandang orang-orang yang sayang sama ka shua. Mungkin bakal sadar kalo ada banyak hal baik dalam dirimu yang selama ini sering diabaikan. Jangan lupa untuk menghargai dan menyayangi diri sendiri juga yaa. 🌷` },
  capek: { title: "Pengingat Buat Kamu Yang Selalu Berjuang",
    body: `Kalo ka shua lagi ngerasa capek ada aku yang siap dengerin semua cerita keluh kesah, mau marah, mau sedih, mau emosi apapun segalanya aku siap dengerin. Siap selalu sedia buat ngevalidasi perasaan emosi itu biar ga terlalu numpuk. Makan yang enak, tidur yang cukup. Pelan-pelan aja yaa, nggak semua hal harus di hadapin sekaligus, terus biarin hari ini selesai tanpa beban yang seharusnya bukan milik sendiri. 🤍` }
};
const owModal = $("#owModal");
$$(".ow-card").forEach(card => card.addEventListener("click", () => {
  const c = OW_CONTENT[card.dataset.ow];
  $("#owEmoji").textContent = c.emoji;
  $("#owTitle").textContent = c.title;
  $("#owBody").textContent = c.body;
  owModal.classList.add("show");
}));
function closeModals() { $$(".modal-back").forEach(m => m.classList.remove("show")); }
$$(".modal-back").forEach(m => {
  m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) m.classList.remove("show"); });
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModals(); });

/* ============ 13. GUESTBOOK → WHATSAPP ============ */
$("#gbSend").addEventListener("click", () => {
  const ta = $("#gbText");
  const text = ta.value.trim();
  if (!text) {
    ta.classList.add("shake"); ta.focus();
    setTimeout(() => ta.classList.remove("shake"), 550);
    return;
  }
  const msg = `${text}`;
  window.open(`https://wa.me/${BIRTHDAY_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ============ 14. MAKE A WISH · LILIN & KONFETI ============ */
const cakeZone = $("#cakeZone");
let blown = false;
$("#btnWish").addEventListener("click", () => $("#wishModal").classList.add("show"));
cakeZone.addEventListener("click", () => {
  if (blown) return;
  blown = true;
  const flame = $("#flame");
  flame.classList.add("out");
  const fx = $("#fxLayer"), cr = cakeZone.getBoundingClientRect();
  for (let i = 0; i < 5; i++) { /* asap */
    const p = document.createElement("i");
    p.className = "puff";
    p.style.left = `calc(50% + ${rnd(-9, 9)}px)`;
    p.style.top = "20%";
    p.style.width = p.style.height = rnd(10, 18) + "px";
    p.style.setProperty("--dx", rnd(-14, 14) + "px");
    p.style.animationDelay = (i * 90) + "ms";
    fx.appendChild(p);
  }
  for (let i = 0; i < 8; i++) { /* percikan */
    const s = document.createElement("i");
    s.className = "spark";
    s.textContent = "✦";
    s.style.left = "50%"; s.style.top = "22%";
    s.style.setProperty("--dx", rnd(-46, 46) + "px");
    s.style.setProperty("--dy", rnd(-52, -8) + "px");
    fx.appendChild(s);
  }
  $("#wishHint").classList.add("fade");
  setTimeout(() => $("#wishReveal").classList.add("show"), 650);
  setTimeout(confetti, 750);
});
function confetti() {
  const layer = $("#confettiLayer");
  const colors = ["#F8D0D8", "#FDEBEF", "#F9E9C1", "#1E412D", "#EC9FAC", "#ECDAC4", "#E2B451"];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement("i");
    c.style.left = rnd(0, 100) + "%";
    c.style.background = pick(colors);
    c.style.width = rnd(5, 10) + "px";
    c.style.height = rnd(9, 15) + "px";
    c.style.setProperty("--dur", rnd(1.9, 3.4).toFixed(2) + "s");
    c.style.setProperty("--delay", rnd(0, 1.1).toFixed(2) + "s");
    c.style.setProperty("--rot", rnd(360, 900) + "deg");
    layer.appendChild(c);
    setTimeout(() => c.remove(), 4600);
  }
}

/* ============ 14b. HERO · EFEK KETIK TAGLINE ============ */
let taglineTyped = false;
function startTaglineTyping() {
  if (taglineTyped) return;
  const el = $("#heroTag");
  if (!el) return;
  taglineTyped = true;
  const full = el.textContent.trim();
  el.textContent = "";
  el.classList.add("typing");
  let i = 0, hold = 0;
  const PAUSE = 50; /* ~2,7 detik jeda sebelum diketik ulang */
  setInterval(() => { /* siklus tanpa henti: ketik → jeda → ketik lagi dari awal */
    if (i <= full.length) {
      el.textContent = full.slice(0, i++);
    } else if (++hold > PAUSE) {
      hold = 0; i = 0;
      el.textContent = "";
    }
  }, 55);
}

/* ============ 14c. HERO · BUNGA TETAP (layer fixed, memudar saat digulir) ============ */
let heroFixedInit = false;
function initHeroFixed() {
  if (heroFixedInit) return;
  const fx = $("#heroFixed");
  if (!fx) return;
  heroFixedInit = true;
  const fade = () => {
    const p = Math.min(1, window.scrollY / (window.innerHeight * .55));
    fx.style.opacity = String(1 - p);
    fx.style.visibility = p >= 1 ? "hidden" : "visible";
  };
  window.addEventListener("scroll", fade, { passive: true });
  fade();
}

/* ============ 15. SCROLL REVEAL ============ */
let observer = null;
function initReveal() {
  if (observer) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); observer.unobserve(en.target); } });
  }, { threshold: .13 });
  $$(".reveal").forEach(el => observer.observe(el));
}

/* ============ 16. BOOT ============ */
bootDecor();
initParticlesAll();
$("#heroDate").textContent = BIRTHDAY_CONFIG.birthdayDate.toUpperCase();
setTimeout(() => showStage("pin"), 2500); /* Stage 1 → Stage 2 (2.5 detik) */
