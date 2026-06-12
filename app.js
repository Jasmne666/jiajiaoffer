const manifestUrl = "assets/manifest.json";

const selectors = {
  filterBar: document.querySelector("#filterBar"),
  workGrid: document.querySelector("#workGrid"),
  videoGrid: document.querySelector("#videoGrid"),
  docGrid: document.querySelector("#docGrid"),
  audioGrid: document.querySelector("#audioGrid"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightboxImage"),
  lightboxCaption: document.querySelector("#lightboxCaption"),
  progress: document.querySelector("#pageProgress"),
};

let manifest = null;
let currentCategory = "全部";

const categoryOrder = ["运营作品", "推文作品", "物料设计", "摄影作品"];
const groupOrder = {
  运营作品: ["自媒体运营"],
  推文作品: ["校园寒招推文", "CNAD 推文作品"],
  物料设计: ["海报作品", "CNAD 活动物料", "雀巢商赛"],
  摄影作品: ["人像摄影", "自然风景摄影"],
};

const categoryNotes = {
  运营作品: "账号主页、内容数据与运营成果。",
  推文作品: "按实际项目分组展示长图文与活动推文。",
  物料设计: "海报、活动物料、包装与商业竞赛视觉。",
  摄影作品: "人像与自然风景摄影，保留照片原始比例展示。",
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const categoriesFromImages = (images) => {
  const existing = new Set(images.map((item) => item.category));
  return ["全部", ...categoryOrder.filter((category) => existing.has(category))];
};

function renderFilters(images) {
  selectors.filterBar.innerHTML = categoriesFromImages(images)
    .map(
      (category) =>
        `<button class="filter-button ${category === currentCategory ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`,
    )
    .join("");

  selectors.filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    currentCategory = button.dataset.category;
    selectors.filterBar.querySelectorAll(".filter-button").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.category === currentCategory);
    });
    renderWorks(manifest.images);
  });
}

function renderWorks(images) {
  const visible = currentCategory === "全部" ? images : images.filter((item) => item.category === currentCategory);
  const categories = orderedGroups(visible, "category", categoryOrder);

  selectors.workGrid.innerHTML = categories
    .map(([category, categoryItems]) => renderWorkCategory(category, categoryItems))
    .join("");
  observeReveals(selectors.workGrid.querySelectorAll(".reveal"));
}

function orderedGroups(items, key, order = []) {
  const groups = new Map();
  items.forEach((item) => {
    const groupKey = item[key];
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(item);
  });

  return [...groups.entries()].sort(([a], [b]) => {
    const aIndex = order.indexOf(a);
    const bIndex = order.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b, "zh-Hans-CN");
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

function renderWorkCategory(category, categoryItems) {
  const subgroups = orderedGroups(categoryItems, "group", groupOrder[category] || []);
  return `
    <section class="work-category reveal">
      <div class="work-category-head">
        <div>
          <p class="eyebrow">${escapeHtml(category)}</p>
          <h3>${escapeHtml(category)}</h3>
          <p>${escapeHtml(categoryNotes[category] || "按作品来源文件夹分组展示。")}</p>
        </div>
        <span>${categoryItems.length} 件作品</span>
      </div>
      <div class="work-subgroup-list">
        ${subgroups.map(([group, items]) => renderWorkSubgroup(group, items)).join("")}
      </div>
    </section>
  `;
}

function renderWorkSubgroup(group, items) {
  return `
    <section class="work-subgroup">
      <div class="work-subgroup-head">
        <h4>${escapeHtml(group)}</h4>
        <span>${items.length} 件</span>
      </div>
      <div class="work-gallery">
        ${items.map((item, index) => renderWorkCard(item, index)).join("")}
      </div>
    </section>
  `;
}

function renderWorkCard(item, index) {
  return `
    <article class="work-card reveal" style="transition-delay: ${Math.min(index * 28, 196)}ms">
      <button type="button" data-full="${escapeHtml(item.full)}" data-title="${escapeHtml(item.title)}" data-meta="${escapeHtml(`${item.category} / ${item.group}`)}">
        <div class="work-image-frame">
          <img src="${escapeHtml(item.thumb)}" width="${item.thumbWidth}" height="${item.thumbHeight}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
        </div>
        <div class="work-meta">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.group)}</span>
        </div>
        <h5>${escapeHtml(item.title)}</h5>
      </button>
    </article>
  `;
}

function renderVideos(videos) {
  selectors.videoGrid.innerHTML = videos
    .map(
      (item) => `
        <article class="video-card reveal">
          <video controls preload="metadata" playsinline poster="${escapeHtml(item.poster)}">
            <source src="${escapeHtml(item.src)}" type="video/mp4" />
          </video>
          <div class="video-body">
            <p class="eyebrow">${escapeHtml(item.category)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.note)}</p>
            <span class="video-size">${escapeHtml(item.sizeMb)} MB</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDocs(docs) {
  selectors.docGrid.innerHTML = docs
    .map(
      (item) => `
        <a class="doc-card reveal" href="${escapeHtml(item.src)}" target="_blank" rel="noreferrer">
          <span class="doc-kind">${escapeHtml(item.kind)} · ${escapeHtml(item.sizeMb)} MB</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.note)}</p>
          <span class="doc-arrow" aria-hidden="true">↗</span>
        </a>
      `,
    )
    .join("");
}

function renderAudio(audio) {
  selectors.audioGrid.innerHTML = audio
    .map(
      (item) => `
        <article class="audio-card reveal">
          <span class="audio-brand">${escapeHtml(item.brand)}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <audio controls preload="none" src="${escapeHtml(item.src)}"></audio>
        </article>
      `,
    )
    .join("");
}

function bindLightbox() {
  selectors.workGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-full]");
    if (!button) return;
    selectors.lightboxImage.src = button.dataset.full;
    selectors.lightboxImage.alt = button.dataset.title;
    selectors.lightboxCaption.textContent = `${button.dataset.title} · ${button.dataset.meta}`;
    selectors.lightbox.classList.add("is-open");
    selectors.lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  const close = () => {
    selectors.lightbox.classList.remove("is-open");
    selectors.lightbox.setAttribute("aria-hidden", "true");
    selectors.lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
  };

  selectors.lightbox.addEventListener("click", (event) => {
    if (event.target === selectors.lightbox || event.target.closest(".lightbox-close")) close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectors.lightbox.classList.contains("is-open")) close();
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
);

function observeReveals(nodes = document.querySelectorAll(".reveal")) {
  nodes.forEach((node) => revealObserver.observe(node));
}

function bindProgress() {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max <= 0 ? 0 : (window.scrollY / max) * 100;
    selectors.progress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function registerGsapPlugins() {
  document.documentElement.dataset.gsapSetup = "loading";
  window.portfolioGsapReady = import("./gsap-setup.js")
    .then(({ default: configuredGsap }) => {
      window.portfolioGsap = configuredGsap;
      document.documentElement.dataset.gsapSetup = "ready";
      return configuredGsap;
    })
    .catch((error) => {
      document.documentElement.dataset.gsapSetup = "failed";
      console.warn("GSAP setup failed to load.", error);
      return null;
    });
}

async function init() {
  const response = await fetch(manifestUrl);
  manifest = await response.json();
  renderFilters(manifest.images);
  renderWorks(manifest.images);
  renderVideos(manifest.videos);
  renderDocs(manifest.docs);
  renderAudio(manifest.audio);
  bindLightbox();
  bindProgress();
  observeReveals();
  registerGsapPlugins();
}

init().catch((error) => {
  console.error(error);
  selectors.workGrid.innerHTML = "<p>作品数据加载失败，请刷新页面。</p>";
});
