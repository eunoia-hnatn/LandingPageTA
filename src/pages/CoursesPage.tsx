import { useMemo, useState, useEffect } from "react";
import { GraduationCap, Plus, TrendingUp, Users2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "../lib/supabase";

function formatVnd(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

export function CoursesPage() {
  const [query, setQuery] = useState("");
  const [dbCourses, setDbCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('*').order('order_index');
      if (data) setDbCourses(data);
    };
    fetchCourses();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Hàm xử lý khi bấm Lưu khóa học mới
  const handleAddCourse = async (newCourseData: any) => {
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('courses')
      .insert([newCourseData])
      .select();

    if (error) {
      alert("Lỗi khi thêm khóa học: " + error.message);
    } else if (data) {
      alert("Thêm khóa học thành công!");
      // Nạp lại danh sách mới nhất
      setDbCourses([...dbCourses, data[0]]);
      // TODO: Đóng Modal/Form ở đây
      setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  // Hàm xoá khóa học
  const handleDeleteCourse = async (id: number) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này? Hành động này không thể hoàn tác.")) return;
  
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (!error) {
    // Xóa thành công, loại bỏ khóa học khỏi danh sách hiển thị
    setDbCourses(dbCourses.filter(c => c.id !== id));
  } else {
    alert("Lỗi khi xóa: " + error.message);
  }
};

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dbCourses;
    return dbCourses.filter((c) => 
      c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q)
    );
  }, [query, dbCourses]);

  const totalStudents = dbCourses.reduce((sum, c) => sum + (c.students || 0), 0);
  const revenue = dbCourses.reduce((sum, c) => sum + ((c.students || 0) * (c.price || 0)), 0);
  const openCourses = dbCourses.filter((c) => c.status === "open").length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <PageHeader
        title="Quản lý khóa học"
        subtitle="Theo dõi số lượng học viên, học phí và tình trạng tuyển sinh từng khóa học."
        actions={
          <Button onClick={() => {
            setEditingCourse(null);
            setIsModalOpen(true);
          }} size="sm">
            <Plus className="h-3.5 w-3.5" />
            Thêm khóa học
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard kpi={{ id: "total", title: "Tổng khóa học", value: String(dbCourses.length), description: "Trong hệ thống", icon: GraduationCap, tone: "default" }} />
        <KpiCard kpi={{ id: "open", title: "Đang mở tuyển sinh", value: String(openCourses), description: "Có thể đăng ký ngay", icon: GraduationCap, tone: "default" }} />
        <KpiCard kpi={{ id: "students", title: "Tổng học viên", value: totalStudents.toLocaleString("vi-VN"), description: "Đang theo học", icon: Users2, tone: "default" }} />
        <KpiCard kpi={{ id: "revenue", title: "Doanh thu ước tính", value: (revenue / 1_000_000).toFixed(0) + " triệu", description: "Từ học phí hiện tại", icon: TrendingUp, tone: "default" }} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">Danh sách khóa học</h3>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm khóa học..."
          className="w-56"
          aria-label="Tìm khóa học"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => {
          const fillRate = Math.round((course.students / course.capacity) * 100);
          return (
            <Card key={course.id} className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">{course.category}</p>
                  <h4 className="mt-1 text-[15px] font-semibold leading-snug text-[var(--color-text)]">{course.title}</h4>
                </div>
                <Badge tone={course.status === "open" ? "success" : "neutral"}>
                  {course.status === "open" ? "Đang mở" : "Tạm đóng"}
                </Badge>
              </div>

              <p className="text-[18px] font-bold text-[var(--color-text)]">{formatVnd(course.price)}</p>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-[12px]">
                  <span className="text-[var(--color-text-secondary)]">
                    {course.students}/{course.capacity} học viên
                  </span>
                  <span className="font-semibold text-[var(--color-text)]">{fillRate}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500"
                    style={{ width: `${Math.min(fillRate, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-auto flex gap-2 pt-1">
                
                <Button 
  variant="outline" 
  size="sm" 
  className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
  onClick={() => handleDeleteCourse(course.id)}
>
  Xóa
</Button>

                <Button 
  variant="outline" 
  size="sm" 
  className="flex-1"
  onClick={() => window.open('/#lo-trinh-hoc', '_blank')}
>
  Chi tiết
</Button>

                <Button className="flex-1" onClick={() => {
                  setEditingCourse(course);
                  setIsModalOpen(true);
                }} size="sm" variant="ghost">
                  Chỉnh sửa
                </Button>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-[13px] text-[var(--color-text-secondary)]">
            Không tìm thấy khóa học phù hợp.
          </p>
        )}
      </div>
      {/* Giao diện Modal Thêm khóa học */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingCourse ? "Cập nhật khóa học" : "Thêm khóa học mới"}</h2>
            
            <form 
  className="flex flex-col gap-4"
  onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const students = Number(formData.get("students"));
    const capacity = Number(formData.get("capacity"));

    if (students > capacity) {
      alert("Số học viên không được lớn hơn sức chứa tối đa.");
      return;
    }
    
    // Đóng gói dữ liệu từ form
    const courseData = {
      title: formData.get("title"),
      category: formData.get("category"),
      target_band: formData.get("target_band"),
      students,
      price: Number(formData.get("price")),
      capacity,
    };

    if (editingCourse) {
      // 1. LUỒNG CHỈNH SỬA (UPDATE)
      setIsSubmitting(true);
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', editingCourse.id);
        
      if (!error) {
        alert("Cập nhật khóa học thành công!");
        // Cập nhật lại giao diện ngay lập tức
        setDbCourses(dbCourses.map(c => c.id === editingCourse.id ? { ...c, ...courseData } : c));
        setIsModalOpen(false);
      } else {
        alert("Lỗi khi cập nhật: " + error.message);
      }
      setIsSubmitting(false);

    } else {
      // 2. LUỒNG THÊM MỚI (INSERT)
      const newCourse = {
        ...courseData,
        status: "open",
        order_index: dbCourses.length + 1
      };
      handleAddCourse(newCourse); // Gọi lại hàm bạn đã viết ở trên
    }
  }}
>
              <div>
                <label className="block text-sm font-medium mb-1">Tên khóa học</label>
                <input name="title" defaultValue={editingCourse?.title || ""} required className="w-full border border-gray-300 p-2 rounded-md" placeholder="VD: IELTS Intensive" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phân loại</label>
                  <input name="category" defaultValue={editingCourse?.category || ""} required className="w-full border border-gray-300 p-2 rounded-md" placeholder="VD: IELTS" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Band</label>
                  <input name="target_band" defaultValue={editingCourse?.target_band || ""} className="w-full border border-gray-300 p-2 rounded-md" placeholder="VD: 6.5 - 7.0" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Số học viên</label>
                <input
                  type="number"
                  name="students"
                  min="0"
                  max={editingCourse?.capacity ?? undefined}
                  defaultValue={editingCourse?.students ?? 0}
                  required
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Học phí (VNĐ)</label>
                  <input type="number" name="price" defaultValue={editingCourse?.price || ""} required className="w-full border border-gray-300 p-2 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sức chứa tối đa</label>
                  <input type="number" name="capacity" min={editingCourse?.students ?? 0} defaultValue={editingCourse?.capacity || ""} required className="w-full border border-gray-300 p-2 rounded-md" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu khóa học"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
