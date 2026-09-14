import { Routes, Route } from "react-router-dom";
import LandingPage from "@user/pages/LandingPage";
import PrivacyPolicyPage from "@user/pages/PrivacyPolicyPage";

/**
 * Khu vực người dùng (public). Nhóm 2 sẽ bổ sung catch-all 404.
 */
export default function UserApp() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicyPage />} />
    </Routes>
  );
}
