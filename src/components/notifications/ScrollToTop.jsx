// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll lên đầu mỗi khi pathname thay đổi
  }, [pathname]);

  return null; // component này không render gì
}
