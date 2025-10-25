import React, { useEffect, useState } from "react";
import "./styles/PaymentNow.css";
import { getCustomer } from "../../../../router/authApi";
import { validateDiscountCode } from "../../../../router/cartApi";
import { GetCustomerResponse } from "../../../../router/types/authResponse";
import { CartCheckOut } from "../../../../router/types/cartResponse";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PaymentNow() {
  const [selectedMethod, setSelectedMethod] = useState<number>(2);
  const [customer, setCustomer] = useState<GetCustomerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(false);

  const [deliveryTo, setDeliveryTo] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [isPercentage, setIsPercentage] = useState<boolean>(false);


  // ✅ Fetch customer info
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomer();
        setCustomer(res);

        const name = `${res.data?.firstName ?? ""} ${res.data?.lastName ?? ""}`.trim();
        setDeliveryTo(name);
        setAddress(res.data?.address ?? "");
        setPhoneNumber(res.data?.phone ?? "");
      } catch (err) {
        console.error("Failed to fetch customer info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, []);

  // ✅ Discount logic
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      alert("Vui lòng nhập mã giảm giá.");
      return;
    }

    try {
      const res = await validateDiscountCode(discountCode.trim());
      setDiscountMessage(res.message);

      if (res.isSuccess && res.data.isActive) {
        const discount = res.data;
        setDiscountValue(discount.discountValue);
        setIsPercentage(discount.isPercentage);


      } else {
        setDiscountValue(0);
      }
    } catch (error) {
      console.error(error);
      setDiscountMessage("Có lỗi xảy ra khi áp dụng mã giảm giá.");
    }
  };

  const handlePaymentChange = (method: number) => {
    setSelectedMethod(method);
  };

  const toggleEdit = () => setEditable(!editable);

  const handleSave = () => {
    setEditable(false);
  };

  if (loading) return <div>Đang tải thông tin khách hàng...</div>;
  if (!customer) return <div>Không thể tải thông tin khách hàng.</div>;

  return (
    <div className="order-payment-layout">
      {/* LEFT SIDE */}
      <div className="order-left">
        <h3>Xác nhận đơn hàng</h3>

        <div className="order-confirmation__address">
          {editable ? (
            <div className="edit-section">
              <label>
                Người nhận:
                <input
                  type="text"
                  value={deliveryTo}
                  onChange={(e) => setDeliveryTo(e.target.value)}
                />
              </label>
              <label>
                Địa chỉ:
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </label>
              <label>
                Số điện thoại:
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  Lưu
                </button>
                <button className="cancel-btn" onClick={() => setEditable(false)}>
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <>
              <span>
                <strong>{deliveryTo}:</strong> {address}
              </span>
              <span>{phoneNumber}</span>
              <button className="edit-btn" onClick={toggleEdit}>
                ✎
              </button>
            </>
          )}
        </div>

        <h4>Phương thức giao hàng</h4>
        <div className="order-confirmation__shipping">
          <label>
            <input type="radio" name="shipping" defaultChecked />
            Bình thường <span>Miễn phí</span>
          </label>
        </div>

        <h4>Phương thức thanh toán</h4>
        <div className="order-confirmation__payment">
          <label>
            <input
              type="radio"
              name="payment"
              checked={selectedMethod === 1}
              onChange={() => handlePaymentChange(1)}
            />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              checked={selectedMethod === 2}
              onChange={() => handlePaymentChange(2)}
            />
            PayOS
          </label>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="order-right">
        <h3>Tóm tắt đơn hàng</h3>

     

        <div className="cart-summary__row cart-summary__total">
          <span>Tổng</span>
        </div>

        {discountMessage && (
          <div className="cart-summary__discount-message">
            <span>{discountMessage}</span>
          </div>
        )}

          <div className="cart-summary__row cart-summary__total">
            <span>Sau giảm giá</span>
          </div>

        <div className="cart-summary__discount">
          <input
            type="text"
            placeholder="Mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={handleApplyDiscount} className="d-btn d-btn-font">
            <span>Áp dụng</span>
          </button>
        </div>

        <button className="d-btn d-btn-font">
          <span>Tiếp tục thanh toán</span>
        </button>
      </div>
    </div>
  );
}