import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles/ReviewOrderForm.css";
import { ReviewOrder } from "../../../../router/types/orderResponse";
import { reviewOrder } from "../../../../router/orderApi";

export default function ReviewOrderForm({ orderId }: { orderId: string }) {
  const [searchParams] = useSearchParams();
  const [serviceRating, setServiceRating] = useState(0);
  const [productRating, setProductRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!serviceRating || !productRating || !content.trim()) {
      setError("Vui lòng điền đầy đủ thông tin đánh giá.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: ReviewOrder = {
        orderId,
        serviceQualityRating: serviceRating,
        productQualityRating: productRating,
        content,
      };

      const response = await reviewOrder(payload);
      console.log("Review saved:", response);
      setSuccess(true);
    } catch (err: any) {
      console.error("Review submission failed:", err);
      setError(err.message || "Gửi đánh giá thất bại.");
    } finally {
      setLoading(false);
    }
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

      <div className="profile-form-show">
        <div className="profile-row">
          <div className="avatar"></div>
          <button className="d-btn d-btn-font">
            <span>Tải ảnh lên</span>
          </button>
        </div>

        <div className="form-fields">
          <div className="order-review-layout">
            {/* Service Rating */}
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

            {/* Product Rating */}
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

            {/* Review content */}
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

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Gửi đánh giá thành công!</p>}

      <div className="profile-form-actions">
        <button
          className="d-btn d-btn-font"
          onClick={handleSave}
          disabled={loading}
        >
          <span>{loading ? "Đang gửi..." : "Lưu"}</span>
        </button>
        <button className="d-btn d-btn-font" onClick={handleCancel}>
          <span>Hủy</span>
        </button>
      </div>
    </div>
  );
}
