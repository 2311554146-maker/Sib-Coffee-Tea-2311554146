/* Sib Coffee and Tea – logic giỏ hàng và đặt hàng (JavaScript thuần) */
const FREE_SHIP_FROM = 300000;   // đơn từ mức này được miễn phí giao hàng
const SHIP_FEE = 25000;
const CART_KEY = "sib-cart";

const $ = (sel) => document.querySelector(sel);

/* Định dạng giá: 120000 -> "120.000đ" */
function formatPrice(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

/* ---------- Giỏ hàng + localStorage ---------- */
let cart = loadCart();   // dạng { "1": 2, "5": 1 }  (mã sản phẩm -> số lượng)

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    const clean = {};
    for (const id in raw) {
      const qty = Math.floor(Number(raw[id]));
      if (findProduct(id) && qty > 0) clean[id] = Math.min(qty, 99);
    }
    return clean;
  } catch (e) {
    return {};
  }
}

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* bỏ qua */ }
}

function addToCart(id) {
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart();
  renderCart();
}

function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = Math.min(qty, 99);
  saveCart();
  renderCart();
}

function calcTotals() {
  let subtotal = 0;
  for (const id in cart) subtotal += findProduct(id).price * cart[id];
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_FROM ? 0 : SHIP_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

/* ---------- Danh sách sản phẩm ---------- */
function renderProducts(filter) {
  const grid = $("#grid");
  grid.textContent = "";
  PRODUCTS.filter((p) => filter === "all" || p.cat === filter).forEach((p) => {
    const card = document.createElement("article");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.style.background = p.bg;
    thumb.setAttribute("aria-hidden", "true");
    thumb.textContent = p.emoji;
    if (p.old) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "-" + Math.round((1 - p.price / p.old) * 100) + "%";
      thumb.appendChild(badge);
    }

    const body = document.createElement("div");
    body.className = "card-body";
    const name = document.createElement("h3");
    name.textContent = p.name;
    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = p.desc;
    const price = document.createElement("div");
    price.className = "price";
    const now = document.createElement("b");
    now.textContent = formatPrice(p.price);
    price.appendChild(now);
    if (p.old) {
      const old = document.createElement("s");
      old.textContent = formatPrice(p.old);
      price.appendChild(old);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "add";
    btn.textContent = "Thêm vào giỏ";
    btn.addEventListener("click", () => {
      addToCart(p.id);
      showToast("Đã thêm vào giỏ: " + p.name);
    });

    body.append(name, desc, price, btn);
    card.append(thumb, body);
    grid.appendChild(card);
  });
}

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    renderProducts(chip.dataset.filter);
  });
});

/* ---------- Hiển thị giỏ hàng ---------- */
function renderCart() {
  const body = $("#cartBody");
  body.textContent = "";
  const ids = Object.keys(cart);
  $("#cartCount").textContent = ids.reduce((sum, id) => sum + cart[id], 0);

  if (ids.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Giỏ hàng đang trống. Hãy chọn vài sản phẩm nhé ☕";
    body.appendChild(empty);
  }

  ids.forEach((id) => {
    const p = findProduct(id);
    const qty = cart[id];

    const row = document.createElement("div");
    row.className = "line";

    const thumb = document.createElement("div");
    thumb.className = "t";
    thumb.style.background = p.bg;
    thumb.setAttribute("aria-hidden", "true");
    thumb.textContent = p.emoji;

    const info = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = p.name;
    const unit = document.createElement("small");
    unit.textContent = formatPrice(p.price);
    const box = document.createElement("div");
    box.className = "qty";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Giảm số lượng " + p.name);
    minus.addEventListener("click", () => setQty(id, qty - 1));
    const num = document.createElement("span");
    num.textContent = qty;
    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Tăng số lượng " + p.name);
    plus.addEventListener("click", () => setQty(id, qty + 1));
    box.append(minus, num, plus);
    info.append(title, unit, box);

    const side = document.createElement("div");
    side.style.textAlign = "right";
    const line = document.createElement("b");
    line.textContent = formatPrice(p.price * qty);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "rm";
    remove.textContent = "Xóa";
    remove.setAttribute("aria-label", "Xóa " + p.name + " khỏi giỏ");
    remove.addEventListener("click", () => setQty(id, 0));
    side.append(line, document.createElement("br"), remove);

    row.append(thumb, info, side);
    body.appendChild(row);
  });

  const t = calcTotals();
  $("#sSub").textContent = formatPrice(t.subtotal);
  $("#sShip").textContent = t.subtotal === 0 ? "0đ" : (t.shipping === 0 ? "Miễn phí" : formatPrice(t.shipping));
  $("#sTotal").textContent = formatPrice(t.total);
  $("#shipNote").textContent = t.subtotal > 0 && t.subtotal < FREE_SHIP_FROM
    ? "Mua thêm " + formatPrice(FREE_SHIP_FROM - t.subtotal) + " để được miễn phí giao hàng."
    : "";
  $("#checkoutBtn").disabled = ids.length === 0;
}

/* ---------- Mở / đóng giỏ hàng ---------- */
let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#closeCart").focus();
}
function closeCart() {
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  if (lastFocus) lastFocus.focus();
}
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("#drawer").classList.contains("open")) closeCart();
});

/* ---------- Đặt hàng (COD) ---------- */
const checkoutDialog = $("#checkout");
const doneDialog = $("#done");
const PHONE_RE = /^(0|\+84)(3|5|7|8|9)\d{8}$/;   // số di động Việt Nam

$("#checkoutBtn").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;
  $("#coTotal").textContent = formatPrice(calcTotals().total);
  closeCart();
  checkoutDialog.showModal();
});
$("#coCancel").addEventListener("click", () => checkoutDialog.close());
$("#doneClose").addEventListener("click", () => doneDialog.close());

function setError(inputId, errorId, message) {
  $("#" + errorId).textContent = message;
  $("#" + inputId).setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

function newOrderCode() {
  return "SIB-" + Date.now().toString(36).toUpperCase().slice(-6);
}

$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#fName").value.trim();
  const phone = $("#fPhone").value.replace(/[\s.\-]/g, "");
  const address = $("#fAddr").value.trim();

  const results = [
    setError("fName", "eName", name.length < 2 ? "Vui lòng nhập họ và tên." : ""),
    setError("fPhone", "ePhone", PHONE_RE.test(phone) ? "" : "Số điện thoại chưa hợp lệ (ví dụ: 0900000000)."),
    setError("fAddr", "eAddr", address.length < 8 ? "Vui lòng nhập địa chỉ giao hàng đầy đủ." : ""),
    setError("fConsent", "eConsent", $("#fConsent").checked ? "" : "Bạn cần đồng ý để tiếp tục đặt hàng.")
  ];
  if (!results.every(Boolean)) return;

  // Chưa gửi đơn đi đâu: chỉ hiện mã đơn, lời cảm ơn và xóa giỏ.
  $("#orderId").textContent = newOrderCode();
  cart = {};
  saveCart();
  renderCart();
  $("#form").reset();
  checkoutDialog.close();
  doneDialog.showModal();
});

/* ---------- Thông báo nhỏ ---------- */
let toastTimer;
function showToast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

renderProducts("all");
renderCart();
