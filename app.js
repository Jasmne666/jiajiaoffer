const manifestUrl = "assets/manifest.json";

const selectors = {
  filterBar: document.querySelector("#filterBar"),
  workCarousel: document.querySelector("#workCarousel"),
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
let workCarouselController = null;

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

function carouselImageOrder(images) {
  return [...images].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const categoryDiff = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return a.title.localeCompare(b.title, "zh-Hans-CN");
  });
}

function renderWorkCarousel(images) {
  const items = carouselImageOrder(images);
  const repeatedItems = [0, 1, 2].flatMap((copy) => items.map((item, index) => ({ item, index, copy })));

  selectors.workCarousel.innerHTML = `
    <div class="work-carousel-head">
      <div>
        <p class="eyebrow">Image Stream</p>
        <h3>全部作品图</h3>
      </div>
      <div class="carousel-meta" aria-label="轮播状态">
        <span>${items.length} 张</span>
        <div class="carousel-controls">
          <button class="carousel-control" type="button" data-carousel-direction="-1" aria-label="上一张">‹</button>
          <button class="carousel-control" type="button" data-carousel-direction="1" aria-label="下一张">›</button>
        </div>
      </div>
    </div>
    <div class="work-carousel-viewport">
      <div class="work-carousel-track">
        ${repeatedItems.map(({ item, index, copy }) => renderCarouselCard(item, index, copy)).join("")}
      </div>
    </div>
    <div class="carousel-rail" aria-hidden="true"><span></span></div>
  `;
}

function renderCarouselCard(item, index, copy) {
  const isPrimaryCopy = copy === 1;

  return `
    <button
      class="carousel-card"
      type="button"
      data-carousel-index="${index}"
      data-full="${escapeHtml(item.full)}"
      data-title="${escapeHtml(item.title)}"
      data-meta="${escapeHtml(`${item.category} / ${item.group}`)}"
      ${isPrimaryCopy ? "" : 'aria-hidden="true" tabindex="-1"'}
      aria-label="${escapeHtml(`查看 ${item.title}`)}"
    >
      <span class="carousel-card-shell">
        <span class="carousel-visual">
          <img src="${escapeHtml(item.thumb)}" width="${item.thumbWidth}" height="${item.thumbHeight}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" />
        </span>
        <span class="carousel-card-body">
          <span class="carousel-category">${escapeHtml(item.category)} · ${escapeHtml(item.group)}</span>
          <strong>${escapeHtml(item.title)}</strong>
        </span>
      </span>
    </button>
  `;
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

function bindLightboxTarget(target) {
  target.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-full]");
    if (!button) return;
    if (button.closest(".work-carousel")?.dataset.pointerMoved === "true") return;

    selectors.lightboxImage.src = button.dataset.full;
    selectors.lightboxImage.alt = button.dataset.title;
    selectors.lightboxCaption.textContent = `${button.dataset.title} · ${button.dataset.meta}`;
    selectors.lightbox.classList.add("is-open");
    selectors.lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
}

function bindLightbox() {
  bindLightboxTarget(selectors.workGrid);
  bindLightboxTarget(selectors.workCarousel);

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

  return window.portfolioGsapReady;
}

function setupWorkCarousel(gsap) {
  if (!selectors.workCarousel || !gsap) return;
  if (workCarouselController) workCarouselController.destroy();

  const root = selectors.workCarousel;
  const viewport = root.querySelector(".work-carousel-viewport");
  const track = root.querySelector(".work-carousel-track");
  const controls = root.querySelectorAll("[data-carousel-direction]");
  const rail = root.querySelector(".carousel-rail span");
  const originalCount = manifest.images.length;
  const cards = [...root.querySelectorAll(".carousel-card")];
  const Draggable = gsap.core.globals().Draggable;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!track || !cards.length) return;

  let segmentWidth = 0;
  let snapPoints = [];
  let step = 0;
  let tween = null;
  let draggable = null;
  let isPaused = false;
  let resizeTimer = 0;
  let pointerResetTimer = 0;

  const currentX = () => Number(gsap.getProperty(track, "x")) || 0;
  const normalizeX = (value) => {
    if (!segmentWidth) return value;
    while (value < -segmentWidth) value += segmentWidth;
    while (value >= 0) value -= segmentWidth;
    return value;
  };
  const setTrackX = (value) => {
    gsap.set(track, { x: normalizeX(value) });
    updateActiveCard();
  };
  const nearestSnap = (value) => {
    if (!snapPoints.length) return normalizeX(value);

    let closest = snapPoints[0];
    let closestDistance = Infinity;
    snapPoints.forEach((point) => {
      [-segmentWidth, 0, segmentWidth].forEach((offset) => {
        const candidate = point + offset;
        const distance = Math.abs(candidate - value);
        if (distance < closestDistance) {
          closest = candidate;
          closestDistance = distance;
        }
      });
    });

    return normalizeX(closest);
  };
  const snapTo = (value, duration = 0.58) => {
    if (tween) tween.kill();
    tween = gsap.to(track, {
      x: nearestSnap(value),
      duration,
      ease: "power3.out",
      overwrite: true,
      onUpdate: updateActiveCard,
    });
  };
  const updateActiveCard = () => {
    if (!snapPoints.length) return;
    const x = currentX();
    let activeIndex = 0;
    let closestDistance = Infinity;

    snapPoints.forEach((point, index) => {
      [-segmentWidth, 0, segmentWidth].forEach((offset) => {
        const distance = Math.abs(point + offset - x);
        if (distance < closestDistance) {
          activeIndex = index;
          closestDistance = distance;
        }
      });
    });

    cards.forEach((card) => {
      card.classList.toggle("is-active", Number(card.dataset.carouselIndex) === activeIndex);
    });

    if (rail) {
      rail.style.transform = `scaleX(${(activeIndex + 1) / originalCount})`;
    }
  };
  const refresh = () => {
    const primaryStart = cards[originalCount];
    const thirdStart = cards[originalCount * 2];
    if (!primaryStart || !thirdStart) return;

    segmentWidth = thirdStart.offsetLeft - primaryStart.offsetLeft;
    step = cards[originalCount + 1]?.offsetLeft - primaryStart.offsetLeft || primaryStart.offsetWidth;
    snapPoints = cards.slice(originalCount, originalCount * 2).map((card) => {
      const viewportCenter = viewport.clientWidth / 2;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return viewportCenter - cardCenter;
    });

    setTrackX(nearestSnap(currentX() || -segmentWidth));
    draggable?.update();
  };
  const moveBy = (direction) => {
    isPaused = true;
    snapTo(currentX() - direction * step, 0.62);
    window.clearTimeout(pointerResetTimer);
    pointerResetTimer = window.setTimeout(() => {
      isPaused = false;
    }, 1400);
  };
  const tick = (_time, deltaTime) => {
    if (prefersReducedMotion || isPaused || root.matches(":hover") || root.dataset.pointerMoved === "true") return;
    setTrackX(currentX() - (deltaTime / 1000) * 22);
  };
  const markPointerMoved = () => {
    root.dataset.pointerMoved = "true";
    window.clearTimeout(pointerResetTimer);
  };
  const clearPointerMoved = () => {
    window.clearTimeout(pointerResetTimer);
    pointerResetTimer = window.setTimeout(() => {
      root.dataset.pointerMoved = "false";
      isPaused = false;
    }, 120);
  };
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refresh, 140);
  };

  root.classList.add("is-enhanced");
  controls.forEach((button) => {
    button.addEventListener("click", () => moveBy(Number(button.dataset.carouselDirection)));
  });
  root.addEventListener("pointerenter", () => {
    isPaused = true;
  });
  root.addEventListener("pointerleave", () => {
    if (root.dataset.pointerMoved !== "true") isPaused = false;
  });
  window.addEventListener("resize", onResize);
  refresh();
  gsap.ticker.add(tick);

  if (Draggable) {
    draggable = Draggable.create(track, {
      type: "x",
      trigger: viewport,
      inertia: Boolean(gsap.core.globals().InertiaPlugin),
      allowNativeTouchScrolling: false,
      dragResistance: 0.08,
      edgeResistance: 0.88,
      cursor: "grab",
      activeCursor: "grabbing",
      snap: nearestSnap,
      onPress() {
        isPaused = true;
        if (tween) tween.kill();
        root.classList.add("is-grabbing");
      },
      onDrag() {
        markPointerMoved();
        this.x = normalizeX(this.x);
        gsap.set(track, { x: this.x });
        this.update();
        updateActiveCard();
      },
      onThrowUpdate() {
        this.x = normalizeX(this.x);
        gsap.set(track, { x: this.x });
        updateActiveCard();
      },
      onRelease() {
        root.classList.remove("is-grabbing");
        clearPointerMoved();
        if (!this.isThrowing) snapTo(this.x);
      },
      onThrowComplete() {
        root.classList.remove("is-grabbing");
        clearPointerMoved();
        snapTo(this.x, 0.36);
      },
    })[0];
  }

  workCarouselController = {
    destroy() {
      if (tween) tween.kill();
      draggable?.kill();
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(pointerResetTimer);
    },
  };
}

async function init() {
  const response = await fetch(manifestUrl);
  manifest = await response.json();
  renderWorkCarousel(manifest.images);
  renderFilters(manifest.images);
  renderWorks(manifest.images);
  renderVideos(manifest.videos);
  renderDocs(manifest.docs);
  renderAudio(manifest.audio);
  bindLightbox();
  bindProgress();
  observeReveals();
  registerGsapPlugins().then((gsap) => setupWorkCarousel(gsap));
}

init().catch((error) => {
  console.error(error);
  selectors.workGrid.innerHTML = "<p>作品数据加载失败，请刷新页面。</p>";
});
