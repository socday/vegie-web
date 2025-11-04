import React, { useEffect, useState } from "react";
import "./styles/OrderConfirm.css";
import { getCustomer } from "../../../../router/authApi";
import { GetCustomerResponse } from "../../../../router/types/authResponse";
import { CartCheckOut } from "../../../../router/types/cartResponse";
import { useMediaQuery } from "react-responsive";

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

  const [deliveryTo, setDeliveryTo] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });
  const handlePaymentChange = (method: number) => {
    setSelectedMethod(method);
    onPaymentChange(method);
    onCheckoutDataChange({ paymentMethod: method });
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomer();
        setCustomer(res);

        const name = `${res.data?.fullName ?? ""} ${res.data?.fullName ?? ""}`.trim();
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
      {isMobile &&  
      <>
      <div className="order-line"> </div>
      </>}
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
            {isMobile && <>
              <span><strong> Địa chỉ nhận hàng </strong> </span>
              <div className="just-to-have-a-pencil">
                <div className="not-pencil">
                <span>
                  <strong>{deliveryTo}:</strong> {phoneNumber}
                </span>
                <span>{address}</span>
                </div>
                <button className="mobile-edit-btn" onClick={toggleEdit}>
                  ✎
                </button>
              </div>
            </>} 
            {isDesktop && <>
            <span>
              <strong>{deliveryTo}:</strong> {address}
            </span>
            <span>{phoneNumber}</span>
            <button className="edit-btn" onClick={toggleEdit}>
              ✎
            </button>
            </>}
          </>
        )}
      </div>

      {isDesktop && <h4>Phương thức giao hàng</h4>}
      {isMobile && <h4> <strong>Phương thức giao hàng</strong> </h4>}
      <div className="order-confirmation__shipping">
        <label>
          <input
            type="radio"
            name="shipping"
            defaultChecked
            onChange={() => onCheckoutDataChange({ deliveryMethod: 1 })}
          />
          Bình thường <span>{isDesktop && "Miễn phí"}</span>
        </label>
      </div>

      {isMobile && <h4> <strong>Phương thức thanh toán</strong> </h4>} 
      {isDesktop && <h4>Phương thức thanh toán</h4>}  
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
