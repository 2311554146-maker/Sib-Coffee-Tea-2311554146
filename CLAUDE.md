# Sib Coffee and Tea – ghi chú cho Claude

Website bán cà phê hạt và dụng cụ pha chế. **Đây là website thực hành, không bán hàng thật.**
Mọi chữ hiển thị cho khách và mọi giải thích cho người dùng phải bằng **tiếng Việt**.

## Ràng buộc kỹ thuật
- Chỉ HTML, CSS, JavaScript thuần. **Không framework, không bước build.**
- Không tải ảnh từ Internet: dùng khối màu và emoji. Giá hiển thị dạng `120.000đ`.
- Dòng "Website thực hành – không bán hàng thật" phải luôn hiển thị.
- Thêm dịch vụ bên thứ ba nào thì phải cập nhật `Content-Security-Policy` trong `vercel.json`
  rồi thử lại việc đặt đơn và Analytics, nếu không trình duyệt sẽ chặn âm thầm.

## Cấu trúc
| File | Vai trò |
|---|---|
| `index.html`, `style.css` | Trang cửa hàng và giao diện chung |
| `products.js`, `script.js` | Danh sách 8 sản phẩm; lọc, giỏ hàng (localStorage), đặt hàng COD, ghi đơn vào Firestore |
| `blog.html`, `blog.js`, `blog-init.js`, `posts.js` | Blog, địa chỉ bài dạng `blog.html#/ten-bai` |
| `analytics.js` | Biểu ngữ cookie; chỉ nạp Google Analytics sau khi khách bấm "Đồng ý" |
| `firestore.rules`, `firebase.json` | Quy tắc Firestore (asia-southeast1) |
| `vercel.json` | Header bảo mật |
| `sitemap.xml`, `robots.txt`, `google*.html` | SEO và xác minh Search Console |

## Nơi triển khai
- Trang: https://sib-coffee-and-tea.vercel.app (Vercel, nối GitHub `2311554146-maker/Sib-Coffee-Tea-2311554146`).
- **Đẩy lên nhánh `main` là Vercel tự deploy production.** Không cần chạy `vercel deploy` tay.
- Firebase: dự án `sib-coffee-tea-231155414`. Đơn hàng nằm ở collection `donhang`.
  Triển khai Rules: `firebase deploy --only firestore --project sib-coffee-tea-231155414`.

## Quy tắc an toàn (quan trọng)
- **Không bao giờ commit** `.env*`, `.vercel/`, token hay khóa riêng. Quét bí mật trước mỗi commit.
- Khóa `apiKey` Firebase trong `script.js` là công khai theo thiết kế, nhưng bảo vệ dữ liệu
  **chỉ dựa vào `firestore.rules`**. Không nới Rules để thử nghiệm; chỉ thử các thao tác phải bị từ chối.
- Rules hiện tại: chỉ cho TẠO đơn hợp lệ trong `donhang`; cấm đọc, sửa, xóa từ trình duyệt.
  Tiền phải là số nguyên, mã đơn đúng 8 ký tự (`SIB-XXXXXXXX`), phí giao chỉ nhận 0 hoặc 25.000đ.
- **Hằng số phí giao nằm ở HAI nơi và phải luôn khớp:** `FREE_SHIP_FROM = 300000`, `SHIP_FEE = 25000`
  trong `script.js`, và hai con số 300000 và 25000 trong `firestore.rules`. Đổi một bên mà quên bên kia
  thì mọi đơn sẽ bị từ chối. Sau khi đổi Rules: `firebase deploy --only firestore:rules --dry-run` rồi thử một đơn dưới và một đơn trên 300.000đ.
- Rules do skill `firebase:firestore-rules-creation` hướng dẫn viết (tác tử `firestore-rules-author` không chạy được ở môi trường này).
- Mỗi lần đặt thử đơn là ghi một tài liệu giả vào Firestore thật: chỉ làm khi cần và nói rõ cho người dùng.
- Xóa dự án, đổi quyền, cấp quyền OAuth, bấm "Start free trial" hay gắn thanh toán: luôn hỏi trước.
- Gói Firebase phải giữ ở Spark, không bật Gemini hay dịch vụ trả phí.
- Tên dự án Firebase hiển thị `sib-coffee-tea-2311554146` giống ID của một dự án Google Cloud thừa
  (đuôi `...554146`). Dự án đang dùng có ID đuôi `...231155414` và số `324336824554`: **đừng nhầm khi xóa**.

## Cách làm việc
1. Chạy thử bằng máy chủ tĩnh (`npx serve .`), không mở thẳng bằng `file://`.
2. Trước khi commit: thử hành trình mua (lọc, giỏ, phí giao 25.000đ, miễn phí từ 300.000đ, form lỗi tiếng Việt),
   xem Console không có lỗi, chạy Lighthouse (mục tiêu 100/100/100/100).
3. Commit bằng tiếng Việt, thông điệp rõ ràng; kết thúc bằng dòng `Co-Authored-By` theo hướng dẫn của phiên.
4. Sau khi push, kiểm tra bản thật bằng lệnh `Invoke-WebRequest`; `README.md`, `vercel.json`,
   `firestore.rules`, `firebase.json`, `CLAUDE.md` không được công khai (phải trả về 404).
