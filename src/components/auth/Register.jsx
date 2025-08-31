import {useState} from 'react';
import {Link} from 'react-router-dom'
import '../../css/Common.css';
import '../../css/Register.css';
import mascotImage from '../../assets/images/mascot-normal-mouth.png';

const Register = () => {
    const [formData, setFormData ] = useState({
        fullName: '',
        phoneNunmber: '',
        email:'',
        password:'',
        passwordConfirm:'', 
        coupon:''
    });

    const handleChange = (e) => {
        const { name, value, type} = e.target;
        setFormData({
            ...formData
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className = "register-page">
            <div className = "register-left-section">
                <div className = "register-left-card">
                    <div className = "register-left-header">
                        <h3> Đăng ký</h3>
                    </div>
                    <form onSubmit= {handleSubmit} className="register-form">
                        <div className = "form-group">
                            <input 
                                type = "text"
                                name =  "fullName"
                                value = {formData.fullName}
                                onchange = {handleChange}
                                placeholder=" Họ, tên"
                                required
                            />
                        </div>

                        <div className = "form-group">
                            <input
                                type = "text"
                                name = "phoneNumber"
                                value = {formData.phoneNunmber}
                                onchange = {handleChange}
                                placeholder="Số điện thoại"
                                required
                            />
                        </div>

                        <div className = "form-group">
                            <input
                                type = "text"
                                name = "address"
                                value = {formData.address}
                                onchange = {handleChange}
                                placeholder="Địa chỉ"
                                required
                            />
                        </div>
                       
                        <div className = "form-group">
                            <input
                                type = "text"
                                name = "email"
                                value = {formData.email}
                                onchange = {handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className = "form-group">
                            <input
                                type = "password"
                                name = "password"
                                value = {formData.password}
                                onchange = {handleChange}
                                placeholder="Mật khẩu"
                                required
                            />
                        </div>

                        <div className = "coupon-form-group">
                            <input
                                type = "text"
                                name = "coupon"
                                value = {formData.coupon}
                                onchange = {handleChange}
                                placeholder="Nhập mã"
                            />
                        </div>

                        <button type ="submit" className = "button-group">
                            Tiếp tục
                        </button>
                    </form>
                </div>
            </div>

            <div className = "register-right-section">
                <div className ="register-right-card">
                    <div className="veggie-logo">
                        <h1>Vegie</h1>
                        <div className="mascot-container">
                        <p className="mascot-text">Bạn Đã Có Tài Khoản?</p>
                        <Link to="/dang-nhap" className="d-btn register-link-btn d-btn-font">
                        <span>Đăng nhập</span></Link>
                        </div>
                        <div className="register-logo">
                        <img 
                        src={mascotImage}
                        alt="Mascot image"
                        className ="logo-c"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;