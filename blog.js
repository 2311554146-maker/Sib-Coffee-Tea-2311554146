/* Sib Coffee and Tea – trang blog (JavaScript thuần)
   Địa chỉ: blog.html (danh sách) và blog.html#/ten-bai (đọc một bài). */
const $ = (sel) => document.querySelector(sel);
const BLOG_TITLE = "Blog – Sib Coffee and Tea";
const BLOG_DESC = $("meta[name='description']").getAttribute("content");

let activeCat = "all";

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return d + "/" + m + "/" + y;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Số lượng trong giỏ (đọc từ localStorage, cùng khóa với trang cửa hàng) */
function updateCartBadge() {
  let n = 0;
  try {
    const cart = JSON.parse(localStorage.getItem("sib-cart") || "{}");
    for (const id in cart) n += Math.max(0, Math.floor(Number(cart[id]) || 0));
  } catch (e) { n = 0; }
  $("#cartCount").textContent = n;
  $("#cartLink").setAttribute("aria-label", "Giỏ hàng " + n + " sản phẩm");
}

/* ---------- Danh sách bài ---------- */
function renderFilters() {
  const box = $("#catFilters");
  box.textContent = "";
  const cats = ["all"].concat(Array.from(new Set(POSTS.map((p) => p.cat))));
  cats.forEach((c) => {
    const btn = el("button", "chip", c === "all" ? "Tất cả" : c);
    btn.type = "button";
    btn.setAttribute("aria-pressed", String(c === activeCat));
    btn.addEventListener("click", () => { activeCat = c; renderFilters(); renderList(); });
    box.appendChild(btn);
  });
}

function renderList() {
  const grid = $("#postGrid");
  grid.textContent = "";
  const sorted = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  sorted.filter((p) => activeCat === "all" || p.cat === activeCat).forEach((p) => {
    const card = el("article", "card post-card");

    const thumb = el("div", "thumb", p.emoji);
    thumb.style.background = p.bg;
    thumb.setAttribute("aria-hidden", "true");

    const body = el("div", "card-body");
    const meta = el("div", "post-meta", p.cat + " · " + formatDate(p.date) + " · " + p.minutes + " phút đọc");
    const title = el("h2");
    const link = el("a", "post-link", p.title);
    link.href = "#/" + p.slug;
    title.appendChild(link);
    const excerpt = el("p", "desc", p.excerpt);
    const more = el("a", "read-more", "Đọc tiếp →");
    more.href = "#/" + p.slug;
    more.setAttribute("aria-label", "Đọc tiếp: " + p.title);

    body.append(meta, title, excerpt, more);
    card.append(thumb, body);
    grid.appendChild(card);
  });
}

/* ---------- Một bài viết ---------- */
function renderBlock(block) {
  if (block.t === "h2") return el("h2", null, block.x);
  if (block.t === "p") return el("p", null, block.x);
  if (block.t === "note") return el("p", "post-note", "💡 " + block.x);
  if (block.t === "ul" || block.t === "ol") {
    const list = el(block.t);
    block.x.forEach((item) => list.appendChild(el("li", null, item)));
    return list;
  }
  return null;
}

function renderPost(slug) {
  const sorted = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((p) => p.slug === slug);
  const view = $("#postView");
  view.textContent = "";

  const back = el("a", "back-link", "← Tất cả bài viết");
  back.href = "blog.html";
  view.appendChild(back);

  if (idx === -1) {
    view.appendChild(el("h1", null, "Không tìm thấy bài viết"));
    view.appendChild(el("p", null, "Bài viết này không tồn tại hoặc đã bị xóa. Hãy quay lại danh sách để chọn bài khác."));
    document.title = "Không tìm thấy bài viết – Sib Coffee and Tea";
    return;
  }

  const p = sorted[idx];
  document.title = p.title + " – Sib Coffee and Tea";
  $("meta[name='description']").setAttribute("content", p.excerpt);

  view.appendChild(el("div", "post-meta", p.cat + " · " + formatDate(p.date) + " · " + p.minutes + " phút đọc"));
  view.appendChild(el("h1", null, p.title));
  const hero = el("div", "post-hero", p.emoji);
  hero.style.background = p.bg;
  hero.setAttribute("aria-hidden", "true");
  view.appendChild(hero);

  const prose = el("div", "prose");
  p.body.forEach((b) => { const node = renderBlock(b); if (node) prose.appendChild(node); });
  view.appendChild(prose);

  if (p.cta) {
    const cta = el("div", "post-cta");
    cta.appendChild(el("p", null, "Muốn thử ngay tại nhà?"));
    const btn = el("a", "btn", p.cta.label);
    btn.href = "index.html?loc=" + encodeURIComponent(p.cta.loc) + "#san-pham";
    cta.appendChild(btn);
    view.appendChild(cta);
  }

  const nav = el("nav", "post-nav");
  nav.setAttribute("aria-label", "Bài viết khác");
  const newer = sorted[idx - 1], older = sorted[idx + 1];
  [[newer, "← Bài mới hơn"], [older, "Bài cũ hơn →"]].forEach(([post, label]) => {
    if (!post) { nav.appendChild(el("span")); return; }
    const a = el("a", "post-nav-link");
    a.href = "#/" + post.slug;
    a.append(el("small", null, label), el("span", null, post.title));
    nav.appendChild(a);
  });
  view.appendChild(nav);
}

/* ---------- Chuyển trang theo địa chỉ (#/ten-bai) ---------- */
function route() {
  const m = location.hash.match(/^#\/([a-z0-9-]+)$/);
  const list = $("#listView"), post = $("#postView"), intro = document.querySelector(".blog-intro");
  if (m) {
    list.hidden = true;
    post.hidden = false;
    intro.hidden = true;
    renderPost(m[1]);
  } else {
    list.hidden = false;
    post.hidden = true;
    intro.hidden = false;
    document.title = BLOG_TITLE;
    $("meta[name='description']").setAttribute("content", BLOG_DESC);
  }
  // Cuộn tức thì về đầu trang (không dùng cuộn mượt để khỏi bị trễ khi đổi nội dung)
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  $("#top").focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
updateCartBadge();
renderFilters();
renderList();
route();
