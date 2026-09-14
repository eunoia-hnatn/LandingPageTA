-- =============================================================================
-- 0002_site_content.sql — Nhóm 2: lớp nội dung động cho landing
-- Áp dụng sau 0001b_leads_policy.sql. Không bảng phụ thuộc mới ngoài profiles.
-- =============================================================================

create table if not exists public.site_content (
  block        text primary key,
  data         jsonb not null,
  is_published boolean not null default true,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles (id) on delete set null
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

-- anon + authenticated: đọc block đã publish
drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content
  for select to anon, authenticated
  using (is_published);

-- super_admin / marketing: toàn quyền (UI sửa ở Nhóm 4)
drop policy if exists site_content_write on public.site_content;
create policy site_content_write on public.site_content
  for all to authenticated
  using ((select public.current_app_role()) in ('super_admin', 'marketing'))
  with check ((select public.current_app_role()) in ('super_admin', 'marketing'));

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

-- ---------------------------------------------------------------------------
-- Seed 5 block Nhóm 2 quản (khớp contentDefaults.ts). ON CONFLICT: giữ nội dung khách đã sửa.
-- ---------------------------------------------------------------------------
insert into public.site_content (block, data) values
(
  'hero',
  jsonb_build_object(
    'headline', 'Học để dùng. Học để đi xa.',
    'subheadline', 'Lộ trình IELTS cá nhân hoá theo trình độ và mục tiêu của bạn — cam kết đầu ra bằng văn bản.',
    'proof_line', 'Đồng hành cùng hàng nghìn học viên chinh phục IELTS',
    'benefits', jsonb_build_array(
      'Đánh giá trình độ & lộ trình miễn phí trong 24 giờ',
      'Giáo viên IELTS 7.5+ kèm sát từng buổi',
      'Cam kết đầu ra bằng văn bản'
    )
  )
),
(
  'trust_bar',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('value','10.000+','label','Học viên đã đồng hành','note','Luỹ kế từ khi thành lập','verified',false),
    jsonb_build_object('value','95%','label','Đạt band mục tiêu','note','Trên học viên hoàn thành lộ trình','verified',false),
    jsonb_build_object('value','+1.5','label','Band cải thiện trung bình','note','Sau 3 tháng','verified',false),
    jsonb_build_object('value','7.5+','label','Trình độ giáo viên','note','IELTS Academic','verified',true)
  ))
),
(
  'footer',
  jsonb_build_object(
    'description', 'HUYWAY English — trung tâm luyện thi IELTS với lộ trình cá nhân hoá và cam kết đầu ra bằng văn bản.',
    'programs', jsonb_build_array(
      jsonb_build_object('label','Lộ trình học','sectionId','lo-trinh-hoc'),
      jsonb_build_object('label','Đội ngũ giáo viên','sectionId','giang-vien'),
      jsonb_build_object('label','Cảm nhận học viên','sectionId','hoc-vien')
    ),
    'contact', jsonb_build_object(
      'hotline','0963 073 488','zalo','0963 073 488',
      'facebook','https://facebook.com/huywayenglish','tiktok','',
      'email','contact@huywayenglish.edu.vn','address','Hà Nội, Việt Nam'
    ),
    'copyright_name', 'HUYWAY English'
  )
),
(
  'map',
  jsonb_build_object(
    'embed_url','https://www.google.com/maps?q=Ha+Noi,+Viet+Nam&output=embed',
    'address','Hà Nội, Việt Nam',
    'maps_link','https://www.google.com/maps?q=Ha+Noi,+Viet+Nam'
  )
),
(
  'seo',
  jsonb_build_object(
    'title','HUYWAY English — Học để dùng. Học để đi xa.',
    'description','Trung tâm tiếng Anh HUYWAY: lộ trình IELTS cá nhân hoá, cam kết đầu ra bằng văn bản. Nhận đánh giá trình độ & lộ trình học miễn phí trong 24 giờ.',
    'og_image','/og-default.png'
  )
)
on conflict (block) do nothing;
