/* Danh sách bài viết blog – nội dung mẫu cho website thực hành.
   Mỗi khối trong body: { t: "p" | "h2" | "ul" | "ol" | "note", x: "chữ" hoặc [danh sách] }.
   cta: nút dẫn tới sản phẩm liên quan (loc: "hat" | "dungcu" | "all"). */
const POSTS = [
  {
    slug: "arabica-va-robusta",
    title: "Arabica và Robusta: khác nhau thế nào?",
    date: "2026-11-20",
    cat: "Kiến thức",
    emoji: "🫘",
    bg: "#f1dcc2",
    minutes: 3,
    excerpt: "Hai giống cà phê phổ biến nhất khác nhau về hương vị, lượng caffeine và nơi trồng. Hiểu rõ để chọn đúng loại cho khẩu vị của bạn.",
    body: [
      { t: "p", x: "Khi mua cà phê hạt, bạn sẽ thường gặp hai cái tên: Arabica và Robusta. Đây là hai giống cà phê chính trên thế giới, và mỗi loại cho một trải nghiệm rất khác." },
      { t: "h2", x: "Arabica: thơm, chua thanh" },
      { t: "ul", x: [
        "Thường trồng ở vùng cao, mát như Cầu Đất (Đà Lạt).",
        "Hương thơm phức tạp, gợi hoa và trái cây; vị chua thanh, ít đắng.",
        "Lượng caffeine thấp hơn, khoảng 1–1,5%."
      ] },
      { t: "h2", x: "Robusta: đậm, đắng, mạnh" },
      { t: "ul", x: [
        "Trồng nhiều ở Tây Nguyên, nổi tiếng là Buôn Ma Thuột.",
        "Vị đậm, đắng rõ, hậu gợi socola; ít chua.",
        "Lượng caffeine cao hơn, khoảng 2–2,7%, và cho lớp bọt (crema) dày khi pha espresso."
      ] },
      { t: "h2", x: "Vậy nên chọn loại nào?" },
      { t: "p", x: "Nếu thích vị đậm, đắng kiểu cà phê phin truyền thống, hãy thử Robusta. Nếu thích vị nhẹ, thơm và hơi chua, hãy chọn Arabica. Người mới có thể bắt đầu với blend: ví dụ 70% Robusta pha 30% Arabica sẽ vừa đậm vừa có hương thơm." },
      { t: "note", x: "Mẹo: mua gói nhỏ 250g của từng loại để so sánh trước khi chọn gói lớn." }
    ],
    cta: { label: "Xem các loại cà phê hạt", loc: "hat" }
  },
  {
    slug: "pha-ca-phe-phin-5-buoc",
    title: "Pha cà phê phin chuẩn vị Việt trong 5 bước",
    date: "2026-11-15",
    cat: "Hướng dẫn pha chế",
    emoji: "🫖",
    bg: "#dfe5e8",
    minutes: 3,
    excerpt: "Phin là cách pha quen thuộc nhất của người Việt. Làm đúng năm bước này, ly cà phê của bạn sẽ đậm đà mà không bị gắt.",
    body: [
      { t: "p", x: "Bạn cần: một phin inox, khoảng 20g cà phê xay vừa đến hơi thô, và nước nóng khoảng 90–95°C (nước vừa sôi để nguội một chút)." },
      { t: "ol", x: [
        "Tráng phin và ly bằng nước nóng để giữ nhiệt và làm sạch.",
        "Cho cà phê vào phin, lắc nhẹ cho mặt phẳng rồi đặt nắp gài lên, nhấn vừa phải.",
        "Rót khoảng 20ml nước để ủ cà phê trong 30 giây. Bước này giúp hạt nở và tỏa hương.",
        "Rót nước đầy tới khoảng 100–120ml, đậy nắp phin.",
        "Chờ 4–5 phút cho cà phê nhỏ giọt hết, rồi thưởng thức nóng hoặc cho đá."
      ] },
      { t: "h2", x: "Nếu cà phê chảy quá nhanh hay quá chậm?" },
      { t: "ul", x: [
        "Chảy quá nhanh, vị nhạt: xay mịn hơn một chút hoặc nhấn gài chặt hơn.",
        "Chảy quá chậm, vị gắt: xay thô hơn hoặc nới nhẹ gài."
      ] },
      { t: "note", x: "Một phin inox tốt, dễ vệ sinh sẽ giúp bạn pha ổn định mỗi ngày." }
    ],
    cta: { label: "Xem dụng cụ pha chế", loc: "dungcu" }
  },
  {
    slug: "v60-cho-nguoi-moi",
    title: "Pha V60 cho người mới: công thức tỉ lệ 1:16",
    date: "2026-11-10",
    cat: "Hướng dẫn pha chế",
    emoji: "⏳",
    bg: "#e8e1d8",
    minutes: 4,
    excerpt: "V60 cho ly cà phê sạch và thơm. Chỉ cần nhớ tỉ lệ 1:16 và làm theo các bước dưới đây là bạn pha được ngay.",
    body: [
      { t: "p", x: "V60 là phễu pha pour-over: nước nóng chảy qua lớp cà phê và giấy lọc, cho hương vị trong trẻo. Tỉ lệ khởi đầu dễ nhớ là 1:16, tức 1 phần cà phê cho 16 phần nước." },
      { t: "h2", x: "Chuẩn bị cho một ly" },
      { t: "ul", x: [
        "15g cà phê, xay cỡ vừa mịn (gần giống muối ăn).",
        "240g nước, khoảng 92–94°C.",
        "Phễu V60, giấy lọc, bình rót và cân điện tử (nếu có)."
      ] },
      { t: "h2", x: "Các bước" },
      { t: "ol", x: [
        "Đặt giấy lọc vào phễu, tráng nước nóng rồi đổ bỏ nước tráng.",
        "Cho cà phê vào, làm phẳng mặt cà phê.",
        "Rót khoảng 30g nước để ủ (bloom) trong 30–40 giây.",
        "Rót nước theo vòng tròn nhỏ, chia làm 2–3 lần, đến đủ 240g.",
        "Đợi nước chảy hết. Cả quá trình nên mất khoảng 2 phút 30 giây đến 3 phút."
      ] },
      { t: "note", x: "Nếu ly cà phê chua gắt, hãy xay mịn hơn. Nếu đắng chát, hãy xay thô hơn." }
    ],
    cta: { label: "Xem phễu V60 và dụng cụ", loc: "dungcu" }
  },
  {
    slug: "bao-quan-ca-phe-hat",
    title: "Bảo quản cà phê hạt đúng cách để giữ hương thơm",
    date: "2026-11-05",
    cat: "Mẹo hay",
    emoji: "📦",
    bg: "#ecd2b3",
    minutes: 3,
    excerpt: "Cà phê hạt ngon nhất trong vài tuần sau khi rang. Vài thói quen đơn giản giúp bạn giữ được hương vị lâu hơn.",
    body: [
      { t: "p", x: "Bốn kẻ thù của cà phê hạt là không khí, ánh sáng, nhiệt và hơi ẩm. Nắm được điều này, việc bảo quản trở nên rất dễ." },
      { t: "h2", x: "Những việc nên làm" },
      { t: "ul", x: [
        "Giữ cà phê trong túi có van một chiều hoặc hũ kín, đậy chặt sau mỗi lần dùng.",
        "Để ở nơi mát, khô, tránh ánh nắng và xa bếp nấu.",
        "Dùng hết trong khoảng 2–4 tuần sau ngày rang để có hương vị ngon nhất.",
        "Mua hạt nguyên, chỉ xay lượng đủ dùng cho mỗi lần pha."
      ] },
      { t: "h2", x: "Còn tủ lạnh thì sao?" },
      { t: "p", x: "Không nên để cà phê đang dùng hằng ngày trong tủ lạnh, vì mỗi lần lấy ra hơi ẩm dễ ngưng tụ vào hạt và cà phê hút mùi thức ăn. Nếu cần trữ lâu, hãy chia thành các túi nhỏ, đóng thật kín rồi cấp đông, và chỉ mở từng túi một khi cần dùng." },
      { t: "note", x: "Nhìn vào ngày rang trên bao bì quan trọng hơn hạn sử dụng khi chọn cà phê." }
    ],
    cta: { label: "Chọn cà phê hạt rang mới", loc: "hat" }
  },
  {
    slug: "do-xay-cho-tung-dung-cu",
    title: "Chọn độ xay phù hợp cho từng dụng cụ pha chế",
    date: "2026-11-01",
    cat: "Kiến thức",
    emoji: "⚙️",
    bg: "#d8dde3",
    minutes: 3,
    excerpt: "Cùng một loại cà phê nhưng xay sai độ mịn sẽ cho vị khác hẳn. Bảng gợi ý này giúp bạn chọn đúng cho từng cách pha.",
    body: [
      { t: "p", x: "Độ xay quyết định tốc độ nước lấy hương vị từ cà phê. Xay càng mịn, nước chảy càng chậm và chiết ra càng nhiều vị, dễ bị đắng. Xay càng thô thì ngược lại, dễ bị nhạt và chua." },
      { t: "h2", x: "Gợi ý độ xay" },
      { t: "ul", x: [
        "Moka pot: mịn đến vừa mịn.",
        "Phễu V60 (pour-over): vừa mịn.",
        "Phin Việt Nam: vừa đến hơi thô.",
        "French press: thô."
      ] },
      { t: "h2", x: "Vì sao nên xay tại nhà?" },
      { t: "p", x: "Cà phê đã xay bay hương rất nhanh. Một chiếc máy xay cầm tay giúp bạn xay ngay trước khi pha, cho hương thơm tươi hơn và dễ chỉnh độ mịn theo ý thích." },
      { t: "note", x: "Chỉ chỉnh một thứ mỗi lần pha thử (ví dụ độ xay) để biết thay đổi nào tạo ra khác biệt." }
    ],
    cta: { label: "Xem máy xay và dụng cụ", loc: "dungcu" }
  }
];
