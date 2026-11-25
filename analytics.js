/* Google Analytics 4 – chỉ được nạp SAU KHI khách bấm "Đồng ý".
   Chưa chọn hoặc "Từ chối": không tải script, không đặt cookie, không gửi dữ liệu.
   Mã đo (G-...) là thông tin công khai của luồng dữ liệu web, không phải mật khẩu. */
(function () {
  "use strict";
  var GA_ID = "G-BPLG9HQ450";
  var KEY = "sib-analytics";   // "granted" hoặc "denied"

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* bỏ qua */ }
  }

  function loadAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function removeBanner() {
    var old = document.getElementById("cookieBanner");
    if (old) old.remove();
  }

  function showBanner() {
    removeBanner();
    var box = document.createElement("div");
    box.id = "cookieBanner";
    box.className = "cookie-banner";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Cài đặt cookie");

    var text = document.createElement("p");
    text.textContent = "Chúng tôi dùng Google Analytics để thống kê lượt truy cập trang thực hành này. " +
      "Dữ liệu chỉ được gửi đi khi bạn bấm \"Đồng ý\".";

    var actions = document.createElement("div");
    actions.className = "cookie-actions";
    var no = document.createElement("button");
    no.type = "button";
    no.className = "btn ghost";
    no.textContent = "Từ chối";
    no.addEventListener("click", function () {
      setChoice("denied");
      window["ga-disable-" + GA_ID] = true;   // dừng gửi ngay nếu đã nạp trong lần truy cập này
      removeBanner();
    });
    var yes = document.createElement("button");
    yes.type = "button";
    yes.className = "btn";
    yes.textContent = "Đồng ý";
    yes.addEventListener("click", function () {
      setChoice("granted");
      window["ga-disable-" + GA_ID] = false;
      removeBanner();
      loadAnalytics();
    });
    actions.append(no, yes);

    box.append(text, actions);
    document.body.appendChild(box);
  }

  var choice = getChoice();
  if (choice === "granted") loadAnalytics();
  else if (choice !== "denied") showBanner();

  // Nút "Cài đặt cookie" ở chân trang cho phép đổi lựa chọn
  var settings = document.getElementById("cookieSettings");
  if (settings) {
    settings.addEventListener("click", function () {
      showBanner();
      var first = document.querySelector("#cookieBanner button");
      if (first) first.focus();
    });
  }
})();
