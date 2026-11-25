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

/* Mã giảm giá: chỉ để tiện cho khách; việc chặn đơn sai giá do firestore.rules đảm nhiệm.
   COUPON_CODE và COUPON_PCT PHẢI khớp hằng số tương ứng trong firestore.rules. */
const COUPON_CODE = "SIB10";
const COUPON_PCT = 10;
let coupon = "";   // "" hoặc COUPON_CODE; chỉ giữ trong bộ nhớ, không lưu localStorage

function calcTotals() {
  let subtotal = 0;
  for (const id in cart) subtotal += findProduct(id).price * cart[id];
  const discount = coupon === COUPON_CODE ? Math.floor(subtotal * COUPON_PCT / 100) : 0;
  // Phí giao hàng tính trên tạm tính trước giảm giá (khớp firestore.rules).
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_FROM ? 0 : SHIP_FEE;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
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
  const totalQty = ids.reduce((sum, id) => sum + cart[id], 0);
  $("#cartCount").textContent = totalQty;
  $("#openCart").setAttribute("aria-label", "Giỏ hàng " + totalQty + " sản phẩm");

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
  $("#rowDiscount").hidden = t.discount === 0;
  $("#sDiscount").textContent = "-" + formatPrice(t.discount);
  $("#sShip").textContent = t.subtotal === 0 ? "0đ" : (t.shipping === 0 ? "Miễn phí" : formatPrice(t.shipping));
  $("#sTotal").textContent = formatPrice(t.total);
  $("#shipNote").textContent = t.subtotal > 0 && t.subtotal < FREE_SHIP_FROM
    ? "Mua thêm " + formatPrice(FREE_SHIP_FROM - t.subtotal) + " để được miễn phí giao hàng."
    : "";
  $("#checkoutBtn").disabled = ids.length === 0;
}

$("#couponBtn").addEventListener("click", () => {
  const entered = $("#couponInput").value.trim().toUpperCase();
  if (entered === COUPON_CODE) {
    coupon = COUPON_CODE;
    $("#couponMsg").textContent = "Đã áp dụng mã " + COUPON_CODE + " (giảm " + COUPON_PCT + "%).";
  } else {
    coupon = "";
    $("#couponMsg").textContent = entered === "" ? "" : "Mã giảm giá không hợp lệ.";
  }
  renderCart();
});

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

/* Mã đơn dạng SIB-XXXXXXXX (8 ký tự A–Z, 0–9 ngẫu nhiên) – khớp quy tắc trong firestore.rules */
function newOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let code = "SIB-";
  bytes.forEach((b) => { code += chars[b % chars.length]; });
  return code;
}

/* ---------- Firebase Firestore (nạp SDK từ CDN khi khách bấm đặt hàng) ---------- */
// firebaseConfig là thông tin công khai của ứng dụng web, không phải mật khẩu.
// Việc bảo vệ dữ liệu do firestore.rules đảm nhiệm (chỉ cho tạo đơn trong "donhang").
const FIREBASE_VERSION = "12.6.0";
const firebaseConfig = {
  apiKey: "AIzaSyDMmepflj0zYdzTCRWUL9uDZC1aRRpY_Js",
  authDomain: "sib-coffee-tea-231155414.firebaseapp.com",
  projectId: "sib-coffee-tea-231155414",
  appId: "1:324336824554:web:c65b6418d9f544cda22793"
};
const SEND_TIMEOUT_MS = 15000;

let firebasePromise = null;
function loadFirebase() {
  if (!firebasePromise) {
    const base = "https://www.gstatic.com/firebasejs/" + FIREBASE_VERSION + "/";
    firebasePromise = Promise.all([
      import(base + "firebase-app.js"),
      import(base + "firebase-firestore.js")
    ]).then(([appMod, fsMod]) => {
      const app = appMod.initializeApp(firebaseConfig);
      return { fs: fsMod, db: fsMod.getFirestore(app) };
    });
    firebasePromise.catch(() => { firebasePromise = null; });
  }
  return firebasePromise;
}

/* Ghi đơn vào collection "donhang"; mã tài liệu = mã đơn (không thể ghi đè đơn cũ). */
async function saveOrder(order) {
  const { fs, db } = await loadFirebase();
  const ref = fs.doc(db, "donhang", order.maDon);
  const data = Object.assign({}, order, { thoiGian: fs.serverTimestamp() });
  const write = fs.setDoc(ref, data);
  write.catch(() => { /* lỗi được xử lý ở Promise.race bên dưới; tránh báo lỗi trùng nếu ghi hỏng sau khi hết giờ */ });
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject({ code: "timeout" }), SEND_TIMEOUT_MS);
  });
  try {
    await Promise.race([write, timeout]);
  } catch (err) {
    resetFirebase(fs, db);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/* Hủy kết nối để lần ghi còn treo không tự gửi lại về sau.
   Không chờ kết quả (terminate có thể treo khi mất mạng), lần đặt hàng sau sẽ nạp kết nối mới. */
function resetFirebase(fs, db) {
  firebasePromise = null;
  try { fs.terminate(db).catch(() => {}); } catch (e) { /* bỏ qua */ }
}

function buildOrder(code, name, phone, address, note) {
  const t = calcTotals();
  return {
    maDon: code,
    khachHang: { hoTen: name, soDienThoai: phone, diaChi: address, ghiChu: note },
    sanPham: Object.keys(cart).map((id) => {
      const p = findProduct(id);
      return { ma: String(p.id), ten: p.name, gia: p.price, soLuong: cart[id] };
    }),
    tamTinh: t.subtotal,
    maGiamGia: coupon,
    giamGia: t.discount,
    phiGiao: t.shipping,
    tongTien: t.total,
    thanhToan: "COD",
    trangThai: "moi"
  };
}

function sendErrorMessage(err) {
  const code = err && err.code ? String(err.code) : "";
  if (code.includes("permission-denied")) {
    return "Đơn hàng chưa được chấp nhận vì dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại thông tin rồi thử lại.";
  }
  if (code === "timeout" || code.includes("unavailable") || code.includes("deadline")) {
    return "Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng rồi bấm đặt hàng lại.";
  }
  if (!code) {
    return "Không tải được thành phần lưu đơn hàng. Vui lòng kiểm tra mạng rồi thử lại.";
  }
  return "Có lỗi khi gửi đơn hàng. Giỏ hàng của bạn vẫn còn, vui lòng thử lại sau.";
}

let sending = false;   // chặn bấm đặt hàng nhiều lần khi đang gửi

$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (sending) return;
  const name = $("#fName").value.trim();
  const phone = $("#fPhone").value.replace(/[\s.\-]/g, "");
  const address = $("#fAddr").value.trim();
  const note = $("#fNote").value.trim();
  $("#eSubmit").textContent = "";
  $("#fNote").setAttribute("aria-invalid", "false");

  const results = [
    setError("fName", "eName", name.length < 2 ? "Vui lòng nhập họ và tên." : (name.length > 100 ? "Họ và tên tối đa 100 ký tự." : "")),
    setError("fPhone", "ePhone", PHONE_RE.test(phone) ? "" : "Số điện thoại chưa hợp lệ (ví dụ: 0900000000)."),
    setError("fAddr", "eAddr", address.length < 8 ? "Vui lòng nhập địa chỉ giao hàng đầy đủ." : (address.length > 300 ? "Địa chỉ tối đa 300 ký tự." : "")),
    setError("fConsent", "eConsent", $("#fConsent").checked ? "" : "Bạn cần đồng ý để tiếp tục đặt hàng.")
  ];
  if (!results.every(Boolean)) {
    // Đưa con trỏ tới ô lỗi đầu tiên để người dùng thấy ngay (nhất là trên điện thoại)
    const firstBad = $("#form").querySelector('[aria-invalid="true"]');
    if (firstBad) firstBad.focus();
    return;
  }

  if (note.length > 500) {
    setError("fNote", "eSubmit", "Ghi chú tối đa 500 ký tự.");
    $("#fNote").focus();
    return;
  }

  // Ghi đơn vào Firestore. Chỉ khi ghi thành công mới hiện mã đơn và xóa giỏ.
  const code = newOrderCode();
  const order = buildOrder(code, name, phone, address, note);
  const submitBtn = $("#submitOrder");
  sending = true;
  submitBtn.disabled = true;
  submitBtn.textContent = "Đang gửi đơn...";
  try {
    await saveOrder(order);
  } catch (err) {
    $("#eSubmit").textContent = sendErrorMessage(err);
    return;
  } finally {
    sending = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Xác nhận đặt hàng";
  }

  $("#orderId").textContent = code;
  cart = {};
  coupon = "";
  $("#couponInput").value = "";
  $("#couponMsg").textContent = "";
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

/* Từ blog sang: ?loc=hat|dungcu để lọc sẵn nhóm, #gio-hang để mở sẵn giỏ hàng */
const startFilter = new URLSearchParams(location.search).get("loc");
const validFilter = ["hat", "dungcu"].includes(startFilter) ? startFilter : "all";
renderProducts(validFilter);
document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === validFilter)));
renderCart();
if (location.hash === "#gio-hang") openCart();
