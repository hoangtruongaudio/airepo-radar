AI REPO RADAR V2.5 – GEMINI BACKEND BẢO MẬT

1) Tạo Cloudflare Worker tên ai-repo-radar-api, dùng mẫu Hello World JavaScript.
2) Vào Edit code và thay bằng nội dung worker.js, Deploy.
3) Trong Worker > Settings > Variables and Secrets, thêm hai SECRET (không dùng plaintext):
   GEMINI_API_KEY = Gemini API key hiện tại trên Google AI Studio
   RADAR_ACCESS_TOKEN = mã ngẫu nhiên riêng ít nhất 32 ký tự (không phải Gemini API key).
   Tạo mã ngẫu nhiên bằng tiện ích mật khẩu trên máy hoặc một trình quản lý mật khẩu tin cậy.
4) Mở URL Worker dạng https://ai-repo-radar-api.<tài-khoản>.workers.dev; đường dẫn /analyze xử lý POST.
5) Thay index.html trong repository hoangtruongaudio/ai-repo-radar, commit và để GitHub Pages cập nhật.
6) Trong trang web > Cài đặt & Màu sắc, nhập URL Worker, RADAR_ACCESS_TOKEN, bấm Lưu kết nối.
7) Mở popup Phân tích repo > AI phân tích > Phân tích chuyên sâu.
8) Trên iPhone thiết lập URL và token riêng một lần; không dán Gemini key vào app.

BẢO MẬT: Token lưu trong localStorage mỗi thiết bị, không phù hợp thiết bị dùng chung.
Worker chỉ chấp nhận origin GitHub Pages đã chỉ định và token dài; CORS không phải bảo mật, token là lớp kiểm soát chính. Người biết token có thể dùng API; nếu lộ hãy xoay token trong Cloudflare và cập nhật ở các thiết bị.
Chưa có khóa hạn mức mạnh toàn cầu; với ứng dụng cá nhân dùng Free Tier và kiểm tra Usage thường xuyên.
Cloudflare và Gemini đều có giới hạn miễn phí, không cam kết luôn 0đ nếu nâng cấp gói.
