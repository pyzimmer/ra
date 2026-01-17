const qs = new URLSearchParams(location.search);
const procPath = qs.get("proc") || "procedures/consignation.json";

const ui = {
  proc: document.getElementById("bProc"),
  step: document.getElementById("bStep"),
  marker: document.getElementById("bMarker"),
  title: document.getElementById("uiTitle"),
  desc: document.getElementById("uiDesc"),
  prev: document.getElementById("prevBtn"),
  next: document.getElementById("nextBtn"),
  reset: document.getElementById("resetBtn"),
  video: document.getElementById("videoPlayer")
};

const markerEl = document.getElementById("marker");
const aAssets = document.getElementById("assets");
const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const icon = document.getElementById("icon");

let proc = null;
let i = 0;

markerEl.addEventListener("markerFound", () => {
  ui.marker.textContent = "Marker : détecté";
});
markerEl.addEventListener("markerLost", () => {
  ui.marker.textContent = "Marker : non détecté";
});

function ensureAsset(id, src) {
  if (!src) return null;
  if (document.getElementById(id)) return id;
  const img = document.createElement("img");
  img.setAttribute("id", id);
  img.setAttribute("src", src);
  aAssets.appendChild(img);
  return id;
}

function renderVideo(step) {
  if (step.video) {
    ui.video.src = step.video;
    ui.video.style.display = "block";
    ui.video.pause();
    ui.video.currentTime = 0;
  } else {
    ui.video.style.display = "none";
    ui.video.removeAttribute("src");
  }
}

function render() {
  if (!proc) return;
  i = Math.max(0, Math.min(i, proc.steps.length - 1));
  const step = proc.steps[i];

  ui.proc.textContent = proc.title;
  ui.step.textContent = `Étape ${i + 1}/${proc.steps.length}`;
  ui.title.textContent = step.title;
  ui.desc.textContent = step.desc || "";

  const iconId = ensureAsset(`icon_${i}`, step.icon);
  if (iconId) icon.setAttribute("src", `#${iconId}`);
  else icon.removeAttribute("src");

  t1.setAttribute("value", step.title);
  t2.setAttribute("value", step.short || "");

  renderVideo(step);
}

async function loadProc() {
  const res = await fetch(procPath);
  proc = await res.json();
  i = 0;
  render();
}

ui.prev.onclick = () => { i--; render(); };
ui.next.onclick = () => { i++; render(); };
ui.reset.onclick = () => { i = 0; render(); };

loadProc();
