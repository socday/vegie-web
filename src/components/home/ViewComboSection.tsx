import React from "react";
import "./styles/ViewComboSection.css";

interface ViewComboSectionProps {
  type: string;
}


  export default function ViewComboSection({ type }: ViewComboSectionProps) {
  const isSingle = type === "single";

  return (
    <div className="view-combo-single">
      <div className="view-combo-single-card">
        <div className="view-combo-single-left">
          {isSingle ? (
            <>
              <h1>Gói mua lẻ</h1>
              <h2>Ăn An Lành</h2>
              <p className="subtitle">
                <strong>Thức Quà Tươi Xanh - Nấu Nhanh Ăn Lành</strong>
              </p>
              <p>
                Mang thực phẩm tươi ngon, lành mạnh về nhà chưa bao giờ dễ dàng
                hơn. Bạn muốn toàn quyền quyết định thực đơn mỗi ngày?
              </p>
            </>
          ) : (
            <>
              <h1>Gói theo tuần</h1>
              <h2>Tuần An Nhàn</h2>
              <p className="subtitle">
                <strong>An tâm trọn tuần - An nhàn trọn vẹn</strong>
              </p>
              <p>Bạn cần một cách tiết kiệm thời gian cho cả tuần?</p>
            </>
          )}
        </div>

        <div className="divider" />

        <div className="view-combo-single-right">
          {isSingle ? (
            <>
              <p className="section-title">
                <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
              </p>
              <ul>
                <li>
                  Cung cấp từ 5 - 6 loại rau củ quả. Phù hợp với khẩu phần ăn ít
                  người từ 3 người đổ lại
                </li>
                <li>Đảm bảo đầy đủ dinh dưỡng</li>
                <li>Rau hàng tận vườn, từ nhà vườn</li>
              </ul>
              <p className="section-title">
                <strong>Tiện ích:</strong>
              </p>
              <ul>
                <li>Giao hàng tận nơi</li>
                <li>Được cung cấp thực đơn AI</li>
                <li>
                  Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ
                  quả
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className="section-title">
                <strong>TUẦN AN NHÀN (Mua lẻ theo tuần)</strong>
              </p>
              <ul>
                <li>Giá ưu đãi hơn</li>
                <li>
                  Bao gồm 2 box được giao 2 lần trong tuần tươi ngon hơn (hoặc có
                  thể điều chỉnh theo mong muốn)
                </li>
                <li>Cung cấp 7-8 loại rau củ quả</li>
                <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
              </ul>
              <p className="section-title">
                <strong>Tiện ích:</strong>
              </p>
              <ul>
                <li>Giao hàng tận nơi</li>
                <li>Được cung cấp gợi ý thực đơn menu AI</li>
                <li>
                  Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ
                  quả
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
