# Sib Coffee and Tea

Website bán cà phê hạt và dụng cụ pha chế. **Đây là website thực hành, không bán hàng thật.**

- Trang web: https://sib-coffee-and-tea.vercel.app
- Chỉ dùng HTML, CSS và JavaScript thuần: không framework, không bước build.

## Tính năng

- Danh mục 8 sản phẩm chia 2 nhóm (Cà phê hạt, Dụng cụ pha chế), có bộ lọc.
- Giỏ hàng lưu bằng `localStorage`: tăng, giảm, xóa món; tự tính tạm tính, phí giao hàng
  25.000đ (miễn phí từ 300.000đ) và tổng tiền.
- Đặt hàng chỉ thanh toán khi nhận hàng (COD). Đơn được ghi vào Cloud Firestore.
- Blog với 5 bài viết mẫu (`blog.html`).
- Google Analytics 4, chỉ nạp sau khi khách bấm "Đồng ý" trên biểu ngữ cookie.

## Cấu trúc thư mục

| File | Vai trò |
|---|---|
| `index.html`, `style.css` | Trang cửa hàng và giao diện chung |
| `products.js` | Danh sách sản phẩm |
| `script.js` | Lọc, giỏ hàng, đặt hàng và ghi đơn vào Firestore |
| `blog.html`, `blog.js`, `blog-init.js`, `posts.js` | Trang blog và nội dung bài viết |
| `analytics.js` | Biểu ngữ cookie và nạp Google Analytics |
| `firestore.rules`, `firebase.json` | Quy tắc bảo mật và cấu hình Firestore |
| `vercel.json` | Header bảo mật khi chạy trên Vercel |
| `sitemap.xml`, `robots.txt`, `google*.html` | SEO và xác minh Search Console |

## Chạy thử trên máy

Mở thư mục bằng một máy chủ tĩnh bất kỳ, ví dụ:

```powershell
npx serve .
```

Không mở thẳng file `index.html` bằng `file://`, vì một số trình duyệt chặn các tính năng cần địa chỉ `http`.

## Bảo mật dữ liệu đơn hàng

Cấu hình Firebase trong `script.js` (`firebaseConfig`) là thông tin công khai của ứng dụng web,
không phải mật khẩu. Dữ liệu được bảo vệ bằng `firestore.rules`:

- Chỉ cho **tạo** tài liệu mới trong collection `donhang`, với dữ liệu đúng dạng.
- **Cấm đọc, sửa, xóa** từ trình duyệt. Chủ trang xem đơn trong Firebase Console.

Triển khai lại quy tắc sau khi sửa:

```powershell
firebase deploy --only firestore --project <mã-dự-án>
```

Lưu ý: trang không có đăng nhập, nên ai cũng gửi được đơn. Vì vậy chỉ nhập dữ liệu giả.

## Triển khai

Mỗi lần đẩy lên nhánh `main`, Vercel tự động triển khai bản production.
