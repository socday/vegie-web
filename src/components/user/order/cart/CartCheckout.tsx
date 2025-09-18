import "../cart/styles/CartSummary.css"
export const CartCheckout = () => {
    return (
    <div className="cart-summary">
        <div className="cart-summary__row">
            <span>Rau siêu ngon</span>
            <span>Giá tiền</span>
        </div>

        <div className="cart-summary__row cart-summary__total">
            <span>Tổng</span>
            <span>Giá tiền</span>
        </div>

        <div className="cart-summary__discount">
            <input type="text" placeholder="Mã giảm giá" />
            <button className="d-btn d-btn-font"> 
                <span>Áp dụng</span>
            </button>
        </div>
            
        <a href="/thanh-toan" className="d-btn d-btn-font">
            <span>Tiếp tục</span>
        </a>
        <div className="cart-summary__or">hoặc</div>
        <a href="/vegie-care" className="d-btn d-btn-font">
            <span>Quay lại</span>
        </a>
    </div>
    )
} 