import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/StageNotification.css';
import mascot from '../../assets/images/webp/mascot-smile.webp';

export default function StageNotification({ type }) {
  const navigate = useNavigate();

  // Define boolean flags for each notification type
  const isRestorePassword = type === 'restore-password';
  const isRegisterSuccess = type === 'register-success';
  const isOrderSuccess = type === 'order-success';
  const isOrderFailed = type === 'order-failed';
  const isPaymentSuccess = type === 'payment-success';
  const isSubscriptionSuccess = type === 'subscription-success';
  const isProfileUpdateSuccess = type === 'profile-update-success';
  const isChangePasswordSuccess = type === 'change-password-success';
  const isPaymentFailed = type === 'payment-failed';

  // --- BUTTON HANDLER ---
  const handleButton = () => {
    // Determine where to go depending on type
    if (isRegisterSuccess || isRestorePassword || isChangePasswordSuccess) {
      navigate('/dang-nhap');
    } else if (isOrderSuccess || isPaymentSuccess || isSubscriptionSuccess || isOrderFailed) {
      navigate('/trang-chu');
    } else if (isPaymentFailed) {
      navigate('/thanh-toan');
    } else {
      navigate('/');
    }
  };

  // --- TITLE LOGIC ---
  const getTitle = () => {
    if (isRestorePassword) return 'Khôi phục mật khẩu thành công';
    if (isRegisterSuccess) return 'Đăng ký thành công';
    if (isOrderSuccess) return 'Đặt hàng thành công';
    if (isOrderFailed) return 'Đặt hàng không thành công';
    if (isPaymentSuccess) return 'Thanh toán thành công';
    if (isSubscriptionSuccess) return 'Đăng ký gói thành công';
    if (isProfileUpdateSuccess) return 'Cập nhật hồ sơ thành công';
    if (isChangePasswordSuccess) return 'Đổi mật khẩu thành công';
    if (isPaymentFailed) return 'Thanh toán thất bại';
    return 'Trang không xác định';
  };

  const getParagraph = () => {
    if (isPaymentFailed || isOrderFailed)
      return 'Quý khách vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ để được giúp đỡ.';
    if (isPaymentSuccess)
      return 'Sau khi xác nhận thanh toán, đơn hàng của bạn sẽ được nhận 100 điểm.';
    if (isSubscriptionSuccess)
      return 'Sau khi xác nhận thanh toán, gói của bạn sẽ được nhận 200 điểm.';
    if (isOrderSuccess)
      return 'Sau khi xác nhận thông tin, đơn hàng của bạn sẽ được nhận 100 điểm.';
    if (isRegisterSuccess)
      return 'Tài khoản của bạn đã được tạo thành công';
    if (isRestorePassword)
      return 'Mật khẩu của bạn đã được đặt lại. Hãy đăng nhập với mật khẩu mới.';
    if (isProfileUpdateSuccess)
      return 'Thông tin cá nhân của bạn đã được cập nhật thành công.';
    if (isChangePasswordSuccess)
      return 'Mật khẩu của bạn đã được thay đổi thành công.';
    return 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.';
  };

  // --- BUTTON LABEL ---
  const getButtonLabel = () => {
    if (isPaymentFailed) return 'Thử lại thanh toán';
    if (isOrderSuccess || isPaymentSuccess || isSubscriptionSuccess) return 'Về trang chủ';
    return 'Về trang chủ';
  };

  return (
    <div className="stage-notification-page">
      <div className="stage-notification-container">
        <div className="stage-notification-card">
          <div className="stage-notification-header">
            <h2>{getTitle()}</h2>
          </div>

          <div className="stage-notification-title">
            <p>{getParagraph()}</p>
          </div>

          <div className="stage-button-container">
            <button onClick={handleButton} className="d-btn d-btn-font stage-notification-btn">
              <span>
                {getButtonLabel()}
              </span>
            </button>
          </div>
          <div className='stage-mascot-image-container'>

            <div className="stage-image-display">
              <img src={mascot} alt="Veggie Mascot" className="mascot-image" />
            </div>
          </div>
          <div className="stage-notification-description">
          </div>

        </div>
      </div>
    </div>
  );
}
