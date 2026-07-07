const manifestUrl = "assets/manifest.json";

const selectors = {
  filterBar: document.querySelector("#filterBar"),
  workCarousels: document.querySelector("#workCarousels"),
  workGrid: document.querySelector("#workGrid"),
  videoGrid: document.querySelector("#videoGrid"),
  docGrid: document.querySelector("#docGrid"),
  audioGrid: document.querySelector("#audioGrid"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightboxImage"),
  lightboxCaption: document.querySelector("#lightboxCaption"),
  progress: document.querySelector("#pageProgress"),
  assistantLauncher: document.querySelector("#assistantLauncher"),
  assistantDialog: document.querySelector("#careerAssistant"),
  assistantClose: document.querySelector("#assistantClose"),
  assistantMessages: document.querySelector("#assistantMessages"),
  assistantForm: document.querySelector("#assistantForm"),
  assistantInput: document.querySelector("#assistantInput"),
  assistantSource: document.querySelector("#assistantSource"),
};

let manifest = null;
let currentCategory = "全部";
let workCarouselControllers = [];

const categoryOrder = ["运营作品", "物料设计", "推文作品", "摄影作品"];
const videoOrder = [
  "AI 短剧《烬骨》预告片",
  "《酸甜一口，童心一刻》",
  "AI 短片《未命名人生》",
  "夜宵摊创业故事采访",
  "《ditto》翻拍",
  "Logo 动画视频",
];
const groupOrder = {
  运营作品: ["自媒体运营"],
  推文作品: ["校园寒招推文", "CNAD 推文作品"],
  物料设计: ["海报作品", "IP 形象设计", "CNAD 活动物料", "雀巢商赛"],
  摄影作品: ["人像摄影", "自然风景摄影"],
};

const categoryNotes = {
  运营作品: "账号主页、内容数据与运营成果。",
  推文作品: "按实际项目分组展示长图文与活动推文。",
  物料设计: "海报、IP 形象、活动物料、包装与商业竞赛视觉。",
  摄影作品: "人像与自然风景摄影，保留照片原始比例展示。",
};

const assistantKnowledge = [
  {
    keywords: ["代表作品", "代表项目", "作品", "案例", "做过什么", "项目亮点"],
    answer:
      "代表项目包括 PawCare 宠物健康管理网站、《烬骨》AIGC 悬疑短剧、大广赛省级一等奖微电影，以及累计 30 万+浏览的小红书账号。她也完成了活动推文、品牌物料、摄影、广播广告和策划案等作品。",
    links: [
      { label: "AI Coding 项目", href: "#aiProjects" },
      { label: "视频作品", href: "#motion" },
      { label: "运营与视觉", href: "#works" },
    ],
  },
  {
    keywords: ["ai能力", "ai 能力", "ai工具", "ai 工具", "aigc", "coding", "codex", "人工智能"],
    answer:
      "她能把 AI 用于 Coding 和多模态内容生产。PawCare 使用 Figma、Codex 与 Coding Agent 完成 8+个页面和功能模块，并经过 3 轮优化；《烬骨》使用 Midjourney、即梦、可灵和剪映建立文本、图像、视频、声音的生产链路。",
    links: [
      { label: "查看 PawCare", href: "#aiProjects" },
      { label: "查看 AIGC 视频", href: "#motion" },
    ],
  },
  {
    keywords: ["视频", "短片", "短剧", "剪辑", "分镜", "拍摄", "影像", "烬骨", "大广赛"],
    answer:
      "视频经历覆盖 AIGC 短剧、品牌微电影、人物采访、翻拍和动态设计。《烬骨》完成约 3 万字剧本、10 分钟短剧与 1 分 45 秒预告片，获路演第一名；大广赛微电影项目由她担任队长，主导 5 版脚本和 30+个分镜，获省级一等奖。",
    links: [{ label: "查看视频作品", href: "#motion" }],
  },
  {
    keywords: ["运营", "增长", "小红书", "账号", "数据", "粉丝", "点赞", "浏览"],
    answer:
      "她独立负责小红书账号的选题、标题、封面、图文设计与互动，累计获得 30 万+浏览、1.3 万+点赞和 950+粉丝。单篇内容达到 12 万+浏览、4000+点赞，并持续根据浏览、收藏与评论反馈优化表达。",
    links: [{ label: "查看运营作品", href: "#works" }],
  },
  {
    keywords: ["经历", "实习", "项目经验", "校园大使", "夸克", "学生会", "工作经验"],
    answer:
      "她的新媒体运营实习整理了 30+条用户反馈，跟进 2 个活动项目并提出 5 条优化建议；担任夸克校园大使期间通过 20+个渠道触达 500+名学生、收集 40+条反馈；学生会外联工作推动 8 家商户合作，获得 3.2 万元赞助。",
    links: [{ label: "查看经历", href: "#profile" }],
  },
  {
    keywords: ["获奖", "奖项", "荣誉", "成绩", "一等奖", "第一名", "top100"],
    answer:
      "主要荣誉包括 AIGC 短剧路演项目第一名、全国大学生广告艺术大赛微电影赛道省级一等奖、雀巢 CEO 挑战杯全国 Top100，以及挑战杯河源专项赛省级立项。",
    links: [
      { label: "视频作品", href: "#motion" },
      { label: "完整简历", href: "assets/docs/01-item.pdf", external: true },
    ],
  },
  {
    keywords: ["能力", "擅长", "会什么", "技能", "工具", "软件", "优势"],
    answer:
      "她的能力可以概括为项目拆解与推进、AI Coding 与多模态内容生产、内容运营与增长、脚本分镜、视频剪辑、视觉设计和用户反馈分析。常用工具包括 Codex、Coding Agent、ChatGPT、Midjourney、即梦、可灵、Premiere Pro、After Effects、Photoshop、Illustrator、Figma 和 Canva。",
    links: [{ label: "查看能力结构", href: "#focusTitle" }],
  },
  {
    keywords: ["视觉", "设计", "海报", "物料", "摄影", "平面", "包装"],
    answer:
      "视觉作品包括海报、活动物料、IP 形象、包装设计、商赛 UI、人像摄影和自然风景摄影。她能使用 Photoshop、Illustrator、Figma 与 Canva 完成视觉设计，并结合内容目标调整信息层级和表达方式。",
    links: [
      { label: "分类浏览作品", href: "#works" },
      { label: "打开完整图集", href: "#workDetails" },
    ],
  },
  {
    keywords: ["教育", "学校", "专业", "毕业", "课程", "到岗", "实习时间", "线下实习", "什么时候"],
    answer:
      "她自 2024 年起就读于深圳大学网络与新媒体专业、人机传播微专业，预计 2028 年毕业。一周内可到岗，每周可线下实习 5 天，可连续实习 3-6 个月以上。",
    links: [{ label: "查看完整简历", href: "assets/docs/01-item.pdf", external: true }],
  },
  {
    keywords: ["联系", "邮箱", "电话", "沟通", "面试", "简历"],
    answer: "可以发送邮件至 chenjia_ren888@163.com 联系任晨佳，也可以打开最新简历查看完整信息。",
    links: [
      { label: "发送邮件", href: "mailto:chenjia_ren888@163.com" },
      { label: "打开简历", href: "assets/docs/01-item.pdf", external: true },
    ],
  },
];

const assistantApiUrl = document.querySelector('meta[name="assistant-api"]')?.content.trim() || "";
const assistantApiEnabled = assistantApiUrl.startsWith("https://") && !assistantApiUrl.includes("REPLACE_ME");

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

function renderWorkCarousels(images) {
  const categoryGroups = orderedGroups(images, "category", categoryOrder);

  selectors.workCarousels.innerHTML = categoryGroups
    .map(([category, items], rowIndex) => renderWorkCarousel(category, carouselImageOrder(items), rowIndex))
    .join("");
}

function renderWorkCarousel(category, items, rowIndex) {
  const canLoop = items.length > 1;
  const repeatedItems = canLoop
    ? [0, 1, 2].flatMap((copy) => items.map((item, index) => ({ item, index, copy })))
    : items.map((item, index) => ({ item, index, copy: 1 }));

  return `
    <section class="work-carousel reveal ${canLoop ? "" : "is-static"}" data-carousel-category="${escapeHtml(category)}" data-carousel-count="${items.length}" data-carousel-flow="${rowIndex % 2 === 0 ? 1 : -1}" aria-label="${escapeHtml(category)}横向轮播">
    <div class="work-carousel-head">
      <div>
        <h3>${escapeHtml(category)}</h3>
        <p>${escapeHtml(categoryNotes[category] || "按作品来源文件夹分组展示。")}</p>
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
    </section>
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
  selectors.videoGrid.innerHTML = [...videos]
    .sort((a, b) => {
      const aIndex = videoOrder.indexOf(a.title);
      const bIndex = videoOrder.indexOf(b.title);
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    })
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
  bindLightboxTarget(selectors.workCarousels);

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
  selectors.progress.style.width = "0%";
}

function normalizeQuestion(value) {
  return value.toLowerCase().replace(/[\s，。！？、,.!?：:；;“”"'（）()\-]/g, "");
}

function findAssistantAnswer(question) {
  const normalized = normalizeQuestion(question);
  let bestMatch = null;
  let bestScore = 0;

  assistantKnowledge.forEach((entry) => {
    const score = entry.keywords.reduce((total, keyword) => {
      const normalizedKeyword = normalizeQuestion(keyword);
      return normalized.includes(normalizedKeyword) ? total + Math.max(1, normalizedKeyword.length) : total;
    }, 0);

    if (score > bestScore) {
      bestMatch = entry;
      bestScore = score;
    }
  });

  return (
    bestMatch || {
      answer: "我暂时没有匹配到明确内容。可以继续问代表作品、项目经历、运营成果、视频能力、AI 工具、获奖情况或联系方式。",
      links: [],
    }
  );
}

async function requestAssistantAnswer(question, history) {
  if (!assistantApiEnabled) throw new Error("Assistant API is not configured.");

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(assistantApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.answer) {
      throw new Error(payload?.error || `Assistant request failed with ${response.status}.`);
    }

    return String(payload.answer).trim();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function appendAssistantMessage(role, content, links = []) {
  const article = document.createElement("article");
  article.className = `assistant-message assistant-message-${role}`;

  if (role === "bot") {
    const mark = document.createElement("span");
    mark.textContent = "AI";
    article.append(mark);
  }

  const bubble = document.createElement("div");
  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  bubble.append(paragraph);

  if (links.length) {
    const actions = document.createElement("div");
    actions.className = "assistant-answer-links";
    links.forEach((link) => {
      const anchor = document.createElement("a");
      anchor.href = link.href;
      anchor.textContent = link.label;
      if (link.external) {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      actions.append(anchor);
    });
    bubble.append(actions);
  }

  article.append(bubble);
  selectors.assistantMessages.append(article);
  selectors.assistantMessages.scrollTop = selectors.assistantMessages.scrollHeight;
  return article;
}

function bindAssistant() {
  if (!selectors.assistantDialog || !selectors.assistantLauncher) return;

  let isAnswering = false;
  const conversation = [];
  const submitButton = selectors.assistantForm.querySelector('button[type="submit"]');

  if (selectors.assistantSource && assistantApiEnabled) {
    selectors.assistantSource.textContent = "基于作品与简历资料 · DeepSeek 智能回答";
  }

  const open = () => {
    selectors.assistantDialog.showModal();
    window.setTimeout(() => selectors.assistantInput.focus(), 80);
  };
  const close = () => selectors.assistantDialog.close();
  const ask = async (question) => {
    const trimmed = question.trim();
    if (!trimmed || isAnswering) return;

    isAnswering = true;
    selectors.assistantInput.value = "";
    selectors.assistantForm.setAttribute("aria-busy", "true");
    submitButton.disabled = true;
    appendAssistantMessage("user", trimmed);

    const loading = appendAssistantMessage(
      "loading",
      assistantApiEnabled ? "正在结合简历与作品生成回答..." : "正在从简历和作品中查找相关信息...",
    );

    try {
      const localResult = findAssistantAnswer(trimmed);
      let answer = localResult.answer;

      if (assistantApiEnabled) {
        try {
          answer = await requestAssistantAnswer(trimmed, conversation.slice(-6));
        } catch (error) {
          console.warn("DeepSeek assistant unavailable; using local answer.", error);
          answer = `当前智能回答暂时不可用，以下是作品集中的相关信息：${localResult.answer}`;
        }
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 360));
      }

      loading.remove();
      appendAssistantMessage("bot", answer, localResult.links);
      conversation.push(
        { role: "user", content: trimmed },
        { role: "assistant", content: answer },
      );
      if (conversation.length > 8) conversation.splice(0, conversation.length - 8);
    } finally {
      selectors.assistantForm.removeAttribute("aria-busy");
      submitButton.disabled = false;
      isAnswering = false;
      selectors.assistantInput.focus();
    }
  };

  selectors.assistantLauncher.addEventListener("click", open);
  selectors.assistantClose.addEventListener("click", close);
  selectors.assistantDialog.addEventListener("click", (event) => {
    if (event.target === selectors.assistantDialog) close();
  });
  selectors.assistantDialog.querySelector(".assistant-suggestions").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-assistant-question]");
    if (button) ask(button.dataset.assistantQuestion);
  });
  selectors.assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(selectors.assistantInput.value);
  });
  selectors.assistantMessages.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="#"]')) close();
  });
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

function setupWorkCarousels(gsap) {
  if (!selectors.workCarousels || !gsap) return;
  workCarouselControllers.forEach((controller) => controller.destroy());
  workCarouselControllers = [...selectors.workCarousels.querySelectorAll(".work-carousel")]
    .map((root) => setupWorkCarousel(root, gsap))
    .filter(Boolean);
}

function setupWorkCarousel(root, gsap) {
  const viewport = root.querySelector(".work-carousel-viewport");
  const track = root.querySelector(".work-carousel-track");
  const controls = root.querySelectorAll("[data-carousel-direction]");
  const rail = root.querySelector(".carousel-rail span");
  const originalCount = Number(root.dataset.carouselCount) || 0;
  const cards = [...root.querySelectorAll(".carousel-card")];
  const Draggable = gsap.core.globals().Draggable;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const autoplayFlow = Number(root.dataset.carouselFlow) || 1;

  if (!track || !cards.length || originalCount < 2 || cards.length < originalCount * 3) return null;

  let segmentWidth = 0;
  let snapPoints = [];
  let step = 0;
  let tween = null;
  let draggable = null;
  let isPaused = false;
  let resizeTimer = 0;
  let pointerResetTimer = 0;
  const eventController = new AbortController();

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
    setTrackX(currentX() - (deltaTime / 1000) * 18 * autoplayFlow);
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
    button.addEventListener("click", () => moveBy(Number(button.dataset.carouselDirection)), {
      signal: eventController.signal,
    });
  });
  root.addEventListener("pointerenter", () => {
    isPaused = true;
  }, { signal: eventController.signal });
  root.addEventListener("pointerleave", () => {
    if (root.dataset.pointerMoved !== "true") isPaused = false;
  }, { signal: eventController.signal });
  window.addEventListener("resize", onResize, { signal: eventController.signal });
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

  return {
    destroy() {
      if (tween) tween.kill();
      draggable?.kill();
      gsap.ticker.remove(tick);
      eventController.abort();
      window.clearTimeout(resizeTimer);
      window.clearTimeout(pointerResetTimer);
    },
  };
}

async function init() {
  const response = await fetch(manifestUrl);
  manifest = await response.json();
  renderWorkCarousels(manifest.images);
  renderFilters(manifest.images);
  renderWorks(manifest.images);
  renderVideos(manifest.videos);
  renderDocs(manifest.docs);
  renderAudio(manifest.audio);
  bindLightbox();
  bindProgress();
  bindAssistant();
  observeReveals();
  registerGsapPlugins().then((gsap) => {
    if (!gsap) return;
    setupWorkCarousels(gsap);
    gsap.to(selectors.progress, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.2,
      },
    });
  });
}

init().catch((error) => {
  console.error(error);
  selectors.workGrid.innerHTML = "<p>作品数据加载失败，请刷新页面。</p>";
});
