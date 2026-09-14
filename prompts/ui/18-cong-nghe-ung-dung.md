# Stitch prompt — Section "Công nghệ ứng dụng" (Module 18)

> Nguồn: `docs/requirements/18-cong-nghe-ung-dung-module.docx` + `DESIGN.md` (hệ thống "The Open
> Door"). Dùng để đưa vào Google Stitch nhằm sinh/sửa lại giao diện 1 section mới chèn vào landing
> page hiện có (không phải trang mới). Dán nguyên khối "PROMPT" bên dưới vào Stitch.

---

## PROMPT

Thiết kế lại 1 section (khối nội dung) mới có tên **"Công nghệ ứng dụng"** để chèn vào giữa 2
section đã có sẵn của một trang landing page tiếng Việt cho trung tâm luyện thi IELTS tên
**"HuyWay English"**: ngay sau section "Vì sao chọn Huyway English" (2 khối Sứ mệnh/Tầm nhìn + 3
card giá trị cốt lõi) và ngay trước section "Những rào cản thường gặp khi tự học IELTS" (lưới 4
card pain-point). Đây là **teaser tiếp thị tĩnh** giới thiệu định hướng công nghệ số hoá tương lai
(một ứng dụng học tập sẽ ra mắt sau — Phase 2), **không phải** mô tả tính năng sản phẩm thật đang
vận hành — tuyệt đối không thêm số liệu/cam kết cụ thể nào về tính năng.

### 1. Bối cảnh design system — bắt buộc tuân thủ tuyệt đối, không tự sáng tạo màu/font mới

- Font chữ: **Montserrat** duy nhất toàn trang. Tiêu đề dùng weight `600` (SemiBold), phần thân
  dùng weight `400` (Regular). Không dùng bold 700+.
- Bảng màu chỉ gồm 2 màu thương hiệu + hệ mực/nền trung tính, không thêm màu nào khác:
  - Scholar's Indigo `#2C3481` (primary-container) — tiêu đề nhấn, badge, viền nhấn, icon.
  - Wayfinder Orange `#F68C1F` (secondary-container) — **CHỈ 1** nút/điểm nhấn cam trong toàn bộ
    khung nhìn (Wayfinder Rule) — dùng cho đúng 1 nút CTA nếu section có CTA riêng.
  - Ink `#000000` (tiêu đề), Ink Body `#717174` (đoạn văn), Ink Muted `#8A8A8D` (chú thích phụ).
  - Surface `#FFFFFF` (nền card/nền chính), Surface Slate `#F1F5F9` (nền section xen kẽ), Indigo
    Wash `#F1F2FC` (nền badge/eyebrow), Hairline `#E2E8F0` (viền 1px xuyên suốt).
- Bo góc: card lớn/panel dùng 20px; card thẻ thường 16px; nút 8px; badge/pill dạng viên nang
  9999px (bo tròn hoàn toàn).
- Độ sâu (elevation): **không dùng bóng đổ nặng, không viền màu tối** — ưu tiên viền hairline 1px
  `#E2E8F0`. Card có thể nâng nhẹ khi hover: `translateY(-4px)` + bóng rất nhẹ
  `0 12px 24px -8px rgba(15,23,42,0.08)`. Không dùng bóng tím/xanh/đen đậm ở bất kỳ đâu.
- Khoảng cách: khung nội dung tối đa `1200px`, căn giữa; padding ngang desktop `80px` (mobile
  16–24px); khoảng cách giữa các section lớn `64px`; gap giữa phần tử đồng cấp `24px`.
- Chuyển động: chỉ hiệu ứng tịnh tiến nhẹ 1 chiều khi hover/focus, không bounce, không xoay.

### 2. Bố cục section (desktop, ưu tiên mô tả trước, mobile ở mục 4)

- **Eyebrow badge** phía trên tiêu đề: pill nhỏ nền Indigo Wash `#F1F2FC`, chữ Indigo `#2C3481`,
  weight 600, ví dụ nội dung "Định hướng công nghệ".
- **Tiêu đề H2** căn giữa, đúng nguyên văn: **"Trải nghiệm không gian học thuật số"**. Dưới tiêu đề
  có 1 dòng mô tả ngắn 1 câu (Ink Body), ví dụ: "Huyway đang xây dựng nền tảng học tập số hoá đồng
  hành cùng học viên ngoài giờ lên lớp." (placeholder, Marketing sẽ sửa lại qua CMS).
- **Thanh 4 tab ngang**, căn giữa, ngay dưới phần mô tả — mỗi tab là 1 label ngắn dạng placeholder
  rõ ràng sẽ được thay sau, ví dụ: "Tính năng 1", "Tính năng 2", "Tính năng 3", "Tính năng 4" (có
  thể gợi ý thêm icon Material Symbols nhỏ cạnh mỗi label để dễ phân biệt, nhưng KHÔNG đặt tên tính
  năng cụ thể/số liệu như các ảnh tham khảo dưới đây — vì sản phẩm thật chưa tồn tại).
  - Tab đang chọn: chữ Indigo `#2C3481` weight 600, có gạch chân/underline mảnh màu Indigo hoặc
    nền pill Indigo Wash phía sau label.
  - Tab chưa chọn: chữ Ink Body `#717174`, không nền, hover chuyển nhẹ sang chữ Indigo.
- **Khối nội dung 2 cột bên dưới thanh tab**, bọc trong 1 card lớn bo góc 20px, viền hairline
  1px `#E2E8F0`, nền trắng, padding rộng rãi (32–48px):
  - **Cột trái (~45%)**: tiêu đề phụ (title-lg, Ink, weight 600) của tab đang chọn + đoạn mô tả
    2–3 câu (body-md, Ink Body) + (tuỳ chọn) 1 nút dạng Ghost/Outline viền Indigo nhỏ "Tìm hiểu
    thêm" (không phải nút cam — giữ đúng Wayfinder Rule, nút cam chính của trang vẫn là nút đăng ký
    tư vấn ở Hero/CTA band khác).
  - **Cột phải (~55%)**: khung ảnh/video minh hoạ tỉ lệ 16:9 hoặc 4:3, bo góc 16px, nền Surface
    Slate `#F1F5F9`, viền hairline. **Vì chưa có ảnh/video thật**, hiển thị trạng thái placeholder
    rõ ràng bên trong khung (xem mục 3 — trạng thái "Chưa có ảnh"), không để trống trắng, không
    dùng ảnh giả lập/ảnh chụp màn hình của sản phẩm khác.

**Tham khảo bố cục** (không copy nội dung/màu sắc): 2 ảnh mockup dạng "Trải nghiệm tính năng độc
quyền" của đối thủ (tab ngang phía trên, trái là nội dung/badge, phải là ảnh mockup có 3 chấm tròn
trình duyệt) — chỉ lấy Ý TƯỞNG bố cục tab-trên + 2-cột-dưới, **không** dùng bảng màu xanh dương/
vàng, không dùng biểu tượng vương miện "PRO", không dùng số liệu/tên tính năng cụ thể của họ.

### 3. Trạng thái cần thiết kế đầy đủ

- **Mặc định (loaded)**: tab đầu tiên active khi vào trang, nội dung + khung ảnh hiển thị bình
  thường như mô tả ở mục 2.
- **Chuyển tab (hover/active/focus)**: tab hover đổi màu chữ nhẹ; tab được chọn có chỉ báo active
  rõ ràng (underline hoặc nền pill); có `focus-visible` viền 2px Indigo `#2C3481` cách lề 2px cho
  điều hướng bàn phím (Tab/Enter/Space đổi tab, mũi tên trái/phải khi tab đang được focus).
- **Trạng thái "Chưa có ảnh"** (bắt buộc thiết kế, vì đây là trạng thái mặc định thực tế lúc go-live):
  khung ảnh cột phải hiển thị nền Surface Slate nhạt + icon Material Symbols dạng khung ảnh
  (`image` hoặc `photo_camera`, màu Ink Muted `#8A8A8D`) ở giữa + dòng chữ nhỏ "Chưa có ảnh" (label-sm,
  Ink Muted) bên dưới icon — kích thước khung **cố định theo tỉ lệ**, không co lại thành 0, để
  không gây lệch layout khi sau này thay bằng ảnh/video thật.
- **Trạng thái loading** (khi nội dung tab đang tải từ hệ thống quản trị nội dung — hiếm khi xảy
  ra vì đây chủ yếu là nội dung tĩnh, nhưng vẫn cần state dự phòng): khung ảnh + 2 dòng text bên
  trái hiển thị dạng skeleton (khối xám nhạt bo góc, hiệu ứng shimmer rất nhẹ, không nhấp nháy
  mạnh), giữ đúng kích thước cuối cùng để tránh nhảy layout.
- **Trạng thái lỗi** (nội dung tab không tải được): thay khối 2 cột bằng 1 dòng thông báo nhẹ nhàng
  giữa card, icon cảnh báo nhỏ (không dùng màu đỏ gắt — dùng Ink Muted), text "Không tải được nội
  dung, vui lòng thử lại" + 1 link/nút Ghost nhỏ "Tải lại" — không phá vỡ khung card tổng thể.
- **Số lượng tab khác 4** (Marketing lỡ xoá/thêm tab qua hệ quản trị nội dung sau này): thiết kế
  linh hoạt, thanh tab co giãn theo số lượng thực tế thay vì cố định cứng đúng 4 vị trí.

### 4. Responsive

- Tablet/Mobile: thanh 4 tab chuyển sang **cuộn ngang** (scroll-x) với chỉ báo mờ dần 2 bên mép
  card cho biết còn nội dung để cuộn, hoặc thu gọn thành dropdown chọn tab — chọn 1 trong 2 cách,
  ưu tiên cuộn ngang nếu 4 label ngắn vẫn đọc được thoải mái.
  Sau khi Stitch xuất mockup, sẽ được lập trình viên chuyển thành component React (Tailwind CSS,
  đúng token của `DESIGN.md`) và đặt `id="cong-nghe"` cho section, gắn vào đúng vị trí giữa 2
  section đã nêu trên trang landing hiện có — vì vậy khi tạo mockup, hãy giữ header/eyebrow-badge/
  spacing nhất quán với các section lân cận thay vì thiết kế như 1 trang độc lập.
- Cột trái/phải ở mục 2 xếp chồng dọc: khung ảnh/video lên trước (hoặc sau — chọn theo thứ tự đọc
  tự nhiên, tiêu đề+mô tả trước, ảnh minh hoạ sau, giữ nhất quán với cách Hero section đang xếp ảnh
  minh hoạ xuống dưới nội dung trên mobile).
- Card tổng thể giảm padding xuống 20–24px, bo góc giữ 20px.

### 5. Ràng buộc — KHÔNG được làm

- Không tự đặt tên/tính năng cụ thể cho 4 tab (vd không tự bịa "Phòng luyện Speaking AI" như ảnh
  tham khảo) — chỉ dùng placeholder trung tính, rõ ràng là nội dung tạm.
- Không thêm huy hiệu "PRO"/vương miện hay bất kỳ hàm ý trả phí nào.
- Không dùng màu ngoài bảng màu đã liệt kê ở mục 1 (không xanh dương, không vàng gold).
- Không để khung ảnh trống trắng hoàn toàn khi chưa có ảnh — luôn có trạng thái "Chưa có ảnh" rõ
  ràng như mục 3.
- Không thêm quá 1 nút màu cam trong section này (nếu có nút CTA, dùng nút Ghost/Outline Indigo).

---

## Cách dùng

1. Dán nguyên khối "PROMPT" ở trên vào Google Stitch.
2. Sau khi có mockup, đối chiếu lại với `DESIGN.md` (đặc biệt bảng màu + typography) trước khi
   giao cho lập trình viên chuyển thành `TechShowcase.tsx` — xem kiến trúc chi tiết ở
   `docs/plan/03b-section-tuongtac-plan.md` (Module 18, mục 2.3 và 2.2 — component `TabPanel.tsx`,
   `RemoteImage.tsx`).
