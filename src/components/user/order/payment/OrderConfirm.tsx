import React, { useEffect, useState } from "react";
import "./styles/OrderConfirm.css";
import { getCustomer } from "../../../../router/authApi";
import { GetCustomerResponse } from "../../../../router/types/authResponse";
import { CartCheckOut } from "../../../../router/types/cartResponse";

type OrderConfirmationProps = {
  onPaymentChange: (method: number) => void;
  onCheckoutDataChange: (checkoutData: Partial<CartCheckOut>) => void;
};

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  onPaymentChange,
  onCheckoutDataChange,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<number>(2);
  const [customer, setCustomer] = useState<GetCustomerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(false);

  // 🧩 Các state có thể thay đổi nếu người dùng chỉnh sửa địa chỉ
  const [deliveryTo, setDeliveryTo] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePaymentChange = (method: number) => {
    setSelectedMethod(method);
    onPaymentChange(method);
    onCheckoutDataChange({ paymentMethod: method });
  };

  // 🟢 Gọi API lấy thông tin khách hàng
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomer();
        setCustomer(res);

        const name = `${res.data?.firstName ?? ""} ${res.data?.lastName ?? ""}`.trim();
        setDeliveryTo(name);
        setAddress(res.data?.address ?? "");
        setPhoneNumber(res.data?.phone ?? "");

        // Cập nhật dữ liệu checkout mặc định
        onCheckoutDataChange({
          deliveryTo: name,
          address: res.data?.address ?? "",
          phoneNumber: res.data?.phone ?? "",
        });
      } catch (err) {
        console.error("Failed to fetch customer info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const toggleEdit = () => {
    setEditable(!editable);
  };

  const handleSave = () => {
    setEditable(false);
    onCheckoutDataChange({
      deliveryTo,
      address,
      phoneNumber,
    });
  };

  if (loading) {
    return <div>Đang tải thông tin khách hàng...</div>;
  }

  if (!customer) {
    return <div>Không thể tải thông tin khách hàng.</div>;
  }

  return (
    <div className="order-confirmation">
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
          <input
            type="radio"
            name="shipping"
            defaultChecked
            onChange={() => onCheckoutDataChange({ deliveryMethod: 1 })}
          />
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
  );
};

export default OrderConfirmation;
