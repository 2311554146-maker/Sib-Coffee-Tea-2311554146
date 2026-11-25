/* Mỗi lần vào hoặc tải lại trang chủ, hiện ngẫu nhiên một ảnh trích dẫn về cà phê.
   - Không lặp lại ảnh của lần trước (nhớ chỉ số trong localStorage; không có cũng không sao).
   - Chỉ tải ảnh SAU khi trang đã tải xong, và chỉ 1 ảnh mỗi lần, nên không làm chậm trang.
   - Đóng bằng nút ×, phím Esc hoặc bấm vào bất kỳ chỗ nào của hộp. */
(function () {
  "use strict";

  var QUOTES = [
    { src: "anh/menendez-pelayo.webp", alt: "\"Thế hệ tạo nên sự đổi mới của Tây Ban Nha được hình thành trong quán cà phê và các tổ chức giáo dục tự do.\" Triết gia Marcelino Menéndez Pelayo (1856 - 1912)" },
    { src: "anh/goldoni.webp", alt: "\"Một khi cà phê thịnh hành, tinh thần được đánh thức, mọi người đều cố gắng trở thành người văn minh hơn.\" Carlo Goldoni (1707 - 1793)" },
    { src: "anh/beethoven.png", alt: "\"Tôi có thói quen lựa chọn đủ 60 hạt cà phê để pha một tách Moka.\" Thiên tài âm nhạc Ludwig Van Beethoven (1770 - 1827)" },
    { src: "anh/polgar.webp", alt: "\"Bạn có thể đến quán cà phê nếu muốn ở một mình nhưng vẫn cần kết nối xã hội.\" Nhà phê bình Alfred Polgar (1873 - 1955)" },
    { src: "anh/balzac.png", alt: "\"Khi tôi uống cà phê, các ý tưởng xuất hiện như đi diễu hành trong quân đội.\" Honoré de Balzac" },
    { src: "anh/verri.webp", alt: "\"Cà phê tái tạo tâm hồn, đánh thức tâm trí và đặc biệt hữu ích cho những nhà tư tưởng và những người nghiên cứu khoa học.\" Triết gia người Ý Pietro Verri (1728 - 1797)" },
    { src: "anh/sydney-smith.webp", alt: "\"Nếu bạn muốn cải thiện sự hiểu biết của mình, hãy uống một ly cà phê.\" Nhà giảng thuyết vĩ đại Sydney Smith (1771 - 1845)" },
    { src: "anh/mackintosh.webp", alt: "\"Tâm trí con người tỷ lệ thuận với lượng cà phê mà ta uống.\" Chính trị gia Sir James Mackintosh (1765 - 1832)" }
  ];
  var KEY = "sib-quote-last";

  var dlg = document.getElementById("quoteDlg");
  var img = document.getElementById("quoteImg");
  if (!dlg || !img || typeof dlg.showModal !== "function") return;
  // Khách bấm từ blog sang để mở thẳng giỏ hàng thì không chen ảnh vào.
  if (location.hash === "#gio-hang") return;

  function lastIndex() {
    try {
      var v = parseInt(localStorage.getItem(KEY), 10);
      return isNaN(v) ? -1 : v;
    } catch (e) { return -1; }
  }

  // Chọn ngẫu nhiên, nhưng khác ảnh của lần trước để mỗi lần làm mới đều thấy ảnh mới.
  function pick() {
    var last = lastIndex();
    var i;
    do { i = Math.floor(Math.random() * QUOTES.length); } while (i === last && QUOTES.length > 1);
    try { localStorage.setItem(KEY, String(i)); } catch (e) { /* bỏ qua */ }
    return i;
  }

  function show() {
    var q = QUOTES[pick()];
    img.onload = function () { if (!dlg.open) dlg.showModal(); };   // chỉ hiện khi ảnh đã tải xong
    img.alt = q.alt;
    img.src = q.src;
  }

  document.getElementById("quoteClose").addEventListener("click", function () { dlg.close(); });
  dlg.addEventListener("click", function () { dlg.close(); });

  if (document.readyState === "complete") show();
  else window.addEventListener("load", show);
})();
