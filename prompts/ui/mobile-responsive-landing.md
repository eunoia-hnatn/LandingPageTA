# Stitch prompt — Giao diện Mobile Responsive cho toàn bộ Landing Page

> Nguồn: `docs/design export/code.html` (giao diện desktop hiện có, nguồn sự thật —
> xem `docs/DECISIONS.md`) + `DESIGN.md` (hệ thống "The Open Door") + `docs/requirements/
> 01…13-*.docx`. Dùng để sinh/tinh chỉnh giao diện **điện thoại (≤428px, và kiểm tra thêm ở
> ~375px/390px)** cho toàn bộ landing page HuyWay English — không đổi bản desktop đã duyệt.

---

## PROMPT

Thiết kế giao diện **phiên bản điện thoại (mobile, khung hình 375–428px)** cho một trang landing
page tiếng Việt của trung tâm luyện thi IELTS **"HuyWay English"**. Trang desktop đã có sẵn và
được duyệt — nhiệm vụ là sinh ra bản mobile **nhất quán 100% về màu sắc/typography/tinh thần thiết
kế** với bản desktop, chỉ thay đổi bố cục/kích thước cho phù hợp màn hình nhỏ, **không đổi nội
dung, không đổi văn phong, không thêm section mới**.

### 1. Design system bắt buộc tuân thủ (không tự sáng tạo)

- Font: **Montserrat** duy nhất. Tiêu đề weight `600`, thân bài weight `400`.
- Màu: chỉ 2 màu thương hiệu — Scholar's Indigo `#2C3481` (điều hướng, tiêu đề nhấn, badge, nút
  thương hiệu) và Wayfinder Orange `#F68C1F` (**đúng 1** nút CTA cam mỗi khung hình đang xem —
  Wayfinder Rule áp dụng **cả trên mobile**, không nới lỏng). Ink `#000`/`#717174`/`#8A8A8D`;
  Surface `#FFFFFF`/Surface Slate `#F1F5F9`/Indigo Wash `#F1F2FC`; viền Hairline `#E2E8F0`.
- Typography mobile theo đúng token đã định nghĩa: `display-mobile` 30px/600 (nếu section dùng
  cấp display), `headline-mobile` 20px/600 (H2 mỗi section), `body-md` 16px/400 (đoạn văn),
  `label-lg` 14px/600 (nhãn nút/menu).
- Khoảng cách mobile: lề ngang container `16–24px` (không dùng 80px như desktop); khoảng cách dọc
  giữa các section `32–48px` (không dùng 64px như desktop); gap phần tử đồng cấp giữ `16–24px`.
- Bo góc/elevation/shape giữ nguyên tỉ lệ như desktop (8/16/20px, pill cho badge) — chỉ giảm
  padding bên trong card, không đổi bo góc.
- Vùng chạm (touch target) tối thiểu **44×44px** cho mọi nút/link/icon bấm được — tăng padding nếu
  cần, không thu nhỏ icon dưới ngưỡng này dù thiết kế desktop nhỏ hơn.
- Chuyển động: giữ nguyên tịnh tiến 1 chiều, biên độ nhỏ hơn desktop nếu cần (tránh giật trên máy
  yếu), tôn trọng `prefers-reduced-motion`.

### 2. Điều hướng (Header) — **thiếu hoàn toàn trên mobile hiện tại, cần thiết kế mới**

Bản desktop hiện ẩn toàn bộ menu điều hướng dưới breakpoint `xl` mà **không có thay thế nào** —
đây là phần quan trọng nhất cần Stitch thiết kế:
- Thanh header mobile cao khoảng `64–72px` (thu gọn từ `90px` desktop): logo bên trái, 1 icon
  hamburger (3 gạch ngang, màu Indigo `#2C3481`) bên phải, có thể giữ 1 nút nhỏ "Đăng ký" dạng icon
  hoặc ẩn hẳn nút CTA to trong thanh (đưa CTA chính xuống FloatingCTA đã có sẵn).
- Bấm hamburger → **drawer/menu trượt** từ phải hoặc từ trên xuống, nền trắng, phủ toàn màn hình
  hoặc ~85% chiều rộng: liệt kê đủ các mục nav (Về chúng tôi, Công nghệ ứng dụng*, Lộ trình học,
  Quy trình 3 bước, Đội ngũ giáo viên, Cảm nhận học viên**, Cam kết đầu ra, FAQ), mỗi mục dạng hàng
  ngang cao ≥48px, viền hairline phân cách; có nút đóng (X) góc trên; bấm 1 mục → cuộn tới đúng
  section + tự đóng drawer. Cuối drawer có 1 nút cam "Đăng ký tư vấn" (CTA chính) + dòng hotline.
  *(*) "Công nghệ ứng dụng" chỉ hiện khi section tương ứng đã publish. (**) "Cảm nhận học viên" tự
  ẩn khi chưa có testimonial thật.*
- Trạng thái: drawer đóng mặc định; khi mở, khoá scroll nền; đóng bằng nút X/backdrop/phím Back
  (Android)/vuốt; overlay tối nhẹ phía sau drawer.

### 3. Bố cục từng section trên mobile

- **Hero**: ảnh minh hoạ xuống **dưới** khối chữ (đã đúng hướng port hiện tại — giữ nguyên thứ tự
  đọc: eyebrow → H1 (`display-mobile`) → mô tả → card form → ảnh). Card form full-width, bo góc
  20px giữ nguyên, các trường input cao `48px` xếp dọc 1 cột.
- **Trust Bar**: lưới số liệu **2×2** (không phải 1 cột), mỗi ô đủ chỗ cho số lớn + label + note,
  không bị cắt chữ.
- **Vì sao chọn Huyway (Về chúng tôi)**: khối Sứ mệnh/Tầm nhìn xếp dọc; 3 card giá trị cốt lõi xếp
  dọc 1 cột, giữ equal-height theo nội dung tự nhiên của từng card (không ép chiều cao cố định).
- **Công nghệ ứng dụng** *(nếu đã publish)*: xem prompt riêng `prompts/ui/18-cong-nghe-ung-dung.md`
  mục Responsive — tab cuộn ngang, 2 cột nội dung/ảnh xếp dọc.
- **Pain Points**: lưới 1 cột, mỗi card giữ đủ icon + tiêu đề + mô tả + tag, không cắt dòng.
- **Quy trình 3 bước**: 3 bước xếp dọc theo thứ tự 1→2→3 (có thể thêm đường nối dọc mảnh giữa các
  số thứ tự để giữ cảm giác "quy trình"); dải CTA cuối chuyển `flex-col`, nút full-width.
- **Lộ trình khóa học**: 3 card xếp dọc; card "Phổ biến nhất" **giữ badge nổi bật** nhưng bỏ hiệu
  ứng nâng lên (`-translate-y`) vốn chỉ hợp lý ở lưới ngang desktop — trên mobile card này chỉ cần
  viền dày 2px Indigo + badge để nổi bật, xếp đúng vị trí trong luồng dọc (không đẩy lên đầu).
- **Đội ngũ giáo viên**: theo yêu cầu 8.2, đây **phải là carousel** trên mọi kích thước màn hình
  (không phải lưới dọc) — 1 thẻ giáo viên full-width mỗi lần, vuốt ngang (swipe) để xem thẻ kế
  tiếp, dots định vị bên dưới, nút Trước/Sau có thể ẩn trên mobile nếu vuốt đã đủ dùng nhưng dots
  vẫn phải hiện.
- **Cảm nhận học viên**: lưới 1 cột, mỗi card giữ đủ badge kết quả + 5 sao + trích dẫn + avatar.
- **Cam kết đầu ra**: panel lớn giữ padding co lại `20–24px`; modal "Điều kiện áp dụng" khi mở
  trên mobile chiếm tối đa `90vh` chiều cao, có thể cuộn nội bộ, nút đóng đủ lớn (≥44px) ở góc dễ
  bấm bằng ngón cái.
- **FAQ**: giữ nguyên dạng accordion 1 cột (đã hợp lý ở mọi kích thước), đảm bảo vùng bấm cả dòng
  câu hỏi (không chỉ icon mũi tên) đủ lớn để chạm.
- **Bản đồ & Liên hệ**: cột thông tin liên hệ lên trước, bản đồ xuống dưới, chiều cao bản đồ thu
  còn khoảng `280–320px` (từ `400–460px` desktop) để không chiếm quá nửa màn hình.
- **Footer**: 4 cột gộp về **1 cột** xếp dọc theo thứ tự: logo+giới thiệu+social → liên hệ →
  lộ trình/khóa học → pháp lý → dòng bản quyền; social icon giữ kích thước chạm ≥44px.
- **FloatingCTA** (nút tròn back-to-top + nút cam "Kiểm tra trình độ"): giữ góc dưới-phải, kiểm tra
  không che khuất nút gửi form hay nội dung cuối trang; ẩn nút back-to-top khi ở đầu trang.

### 4. Trạng thái cần thiết kế (loading/error/empty) — áp dụng chung mọi section có dữ liệu động

- **Loading**: khung nội dung (ảnh giáo viên, ảnh minh hoạ, số liệu Trust Bar khi tải từ hệ quản
  trị nội dung) hiển thị **skeleton** — khối xám nhạt `#F1F5F9` bo góc đúng bằng phần tử thật, hiệu
  ứng shimmer nhẹ, giữ nguyên kích thước cuối cùng (không giật layout khi tải xong).
- **Ảnh lỗi/chưa có** (giáo viên, ảnh minh hoạ Công nghệ ứng dụng, ảnh bản đồ): khung nền Surface
  Slate + icon `image`/`person` (Material Symbols, màu Ink Muted `#8A8A8D`) giữa khung + dòng chữ
  nhỏ mô tả tình trạng ("Chưa có ảnh"/"Không tải được ảnh") — không hiện icon vỡ ảnh mặc định của
  trình duyệt.
- **Form Hero lỗi khi gửi** (mất mạng/server lỗi): banner đỏ nhạt (nền `#FFF5F5`-tương tự, viền
  đỏ `#EF4444`) phía trên nút gửi, text ngắn gọn + nút "Thử lại", **không dùng `alert()`** popup.
- **Danh sách rỗng** (chưa có testimonial thật, chưa publish section Công nghệ ứng dụng): toàn bộ
  section tự ẩn — không để lại khoảng trắng hoặc khung rỗng nào trên mobile.
- **Bộ lọc/carousel chỉ có 1 phần tử** (vd chỉ 1 giáo viên): ẩn dots + nút điều hướng, hiện đúng 1
  thẻ full-width, không để control thừa không có tác dụng.

### 5. Ràng buộc — KHÔNG được làm

- Không đổi màu/font ngoài bảng đã liệt kê ở mục 1.
- Không tạo thêm section mới không có trong danh sách ở mục 3.
- Không để bất kỳ vùng chạm nào nhỏ hơn 44×44px.
- Không dùng `alert()`/popup hệ thống cho bất kỳ thông báo lỗi nào.
- Không hiển thị quá 1 nút cam Wayfinder Orange trong cùng 1 khung hình đang xem, kể cả khi
  FloatingCTA + nút trong section cùng hiện trên màn hình.
- Không để layout nhảy (shift) khi ảnh/skeleton chuyển sang nội dung thật.

---

## Cách dùng

1. Dán khối "PROMPT" vào Google Stitch, có thể tách sinh theo từng nhóm section nếu Stitch giới
   hạn độ dài (vd nhóm 1: Header+Hero+TrustBar; nhóm 2: các section nội dung; nhóm 3: FAQ+Map+Footer).
2. Đối chiếu kết quả với `DESIGN.md` trước khi giao lập trình viên — đặc biệt phần Header mobile
   (mục 2), vì đây là phần **hiện chưa tồn tại trong code thật**, cần thêm vào
   `docs/plan/02-khung-dieuhuong-chuyendoi-plan.md` như 1 hạng mục việc còn thiếu (hamburger menu).
3. Phần Đội ngũ giáo viên (mục 3) đã được lên kế hoạch code carousel ở
   `docs/plan/03b-section-tuongtac-plan.md` (Module 8) — dùng mockup Stitch làm tham chiếu hình ảnh
   khi lập trình `ProfileCarousel.tsx`.
