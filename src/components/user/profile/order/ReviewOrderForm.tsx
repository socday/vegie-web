import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles/ReviewOrderForm.css";

export default function ReviewOrderForm({orderId}: {orderId: string}) {
  const [searchParams] = useSearchParams();
    const [serviceRating, setServiceRating] = useState(0);
    const [productRating, setProductRating] = useState(0);
    const [content, setContent] = useState("");
  
    const handleSave = () => {
      console.log({
        orderId,
        serviceRating,
        productRating,
        content,
      });
    };
  
    const handleCancel = () => {
      setServiceRating(0);
      setProductRating(0);
      setContent("");
    };
  if (!orderId) {
    return <p>Không tìm thấy đơn hàng cần đánh giá.</p>;
  }

  return (
    <div className="profile-form">
      <h2>Đánh giá sản phẩm</h2>
      {/* <p>Mã đơn hàng: <strong>{orderId}</strong></p> */}

      <div className="profile-form-show">
        <div className="profile-row">
          <div className="avatar"></div>
          <button className="d-btn d-btn-font"><span>Tải ảnh lên</span></button>
        </div>

        <div className="form-fields">
          <div className="order-review-layout">
            <div className="review-row">
              <span>Chất lượng dịch vụ</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`star ${n <= serviceRating ? "active" : ""}`}
                    onClick={() => setServiceRating(n)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-row">
              <span>Chất lượng sản phẩm</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`star ${n <= productRating ? "active" : ""}`}
                    onClick={() => setProductRating(n)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="review-row review-content-input">
              <span>Đánh giá chi tiết</span>
              <input
                placeholder="Nội dung"
                className="review-input"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
                </div>
              </div>
            </div>

        <div className="profile-form-actions">
          <button className="d-btn d-btn-font"><span>Lưu</span></button>
          <button className="d-btn d-btn-font"><span>Hủy</span></button>
        </div>
      </div>
    );
  }

