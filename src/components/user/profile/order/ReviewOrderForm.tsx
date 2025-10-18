export default function ReviewOrderForm() {
    return (
        <div className="profile-form">
            <h2>Đánh giá sản phẩm</h2>
        <div className="profile-form-show">

        <div className="profile-row">
          <div className="avatar"></div>
          <button className="d-btn d-btn-font"><span>Tải ảnh lên </span></button>
        </div>

        <div className="form-fields">
          <div className="profile-layout">
            <span>Chất lượng dịch vụ</span>

            <span>Chất lượng sản phẩm</span>
            <span>Đánh giá chi tiết: </span>
            <input placeholder="Nội dung" className="full-width" />
          </div>

        </div>
      </div>
      <div className="profile-form-actions">
        <button className="d-btn d-btn-font"><span>Lưu</span></button>
        <button className="d-btn d-btn-font"><span>Hủy</span></button>
      </div>
    </div>
    )

}