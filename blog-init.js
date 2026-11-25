/* Chạy sớm trong <head>: nếu mở thẳng một bài (blog.html#/ten-bai) thì ẩn sẵn phần
   danh sách ngay từ đầu, để trang không bị nhảy bố cục khi bài hiện ra. */
if (/^#\/[a-z0-9-]+$/.test(location.hash)) {
  document.documentElement.classList.add("is-post");
}
