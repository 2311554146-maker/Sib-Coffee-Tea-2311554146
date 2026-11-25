/* Danh sách sản phẩm – dữ liệu mẫu cho website thực hành.
   cat: "hat" = Cà phê hạt, "dungcu" = Dụng cụ pha chế.
   price: giá bán (đồng); old: giá cũ (không bắt buộc); bg: màu nền khối ảnh. */
const PRODUCTS = [
  { id: 1, cat: "hat", name: "Arabica Cầu Đất rang vừa 250g", desc: "Hương hoa, hậu vị ngọt dịu", price: 135000, old: 159000, emoji: "🫘", bg: "#f1dcc2" },
  { id: 2, cat: "hat", name: "Robusta Buôn Ma Thuột 500g", desc: "Đậm, đắng, hậu socola", price: 120000, emoji: "🫘", bg: "#e2c3a1" },
  { id: 3, cat: "hat", name: "Blend Sib đặc biệt 500g", desc: "70% Robusta – 30% Arabica", price: 150000, old: 179000, emoji: "☕", bg: "#d9b48b" },
  { id: 4, cat: "hat", name: "Culi nguyên chất 250g", desc: "Vị mạnh, hương nồng", price: 98000, emoji: "🫘", bg: "#ecd2b3" },
  { id: 5, cat: "dungcu", name: "Phin inox 304 (size 8)", desc: "Bền, không gỉ, dễ vệ sinh", price: 65000, emoji: "🫖", bg: "#dfe5e8" },
  { id: 6, cat: "dungcu", name: "Phễu pha V60 sứ", desc: "Dùng cho cà phê pour-over", price: 180000, old: 210000, emoji: "⏳", bg: "#e8e1d8" },
  { id: 7, cat: "dungcu", name: "Máy xay cà phê cầm tay", desc: "Lưỡi thép, chỉnh được độ mịn", price: 450000, emoji: "⚙️", bg: "#d8dde3" },
  { id: 8, cat: "dungcu", name: "Bình Moka Pot 300ml", desc: "Pha espresso kiểu Ý tại nhà", price: 320000, emoji: "♨️", bg: "#e5ddd2" }
];
