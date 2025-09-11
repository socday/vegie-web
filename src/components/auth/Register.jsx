import {useState} from 'react';
import {Link} from 'react-router-dom'
import '../../css/Register.css';
import '../../index.css';
import mascotImage from '../../assets/images/mascot-normal-mouth.png';
import LoginRegisterForm from './LoginRegisterForm';

const Register = () => {
    const [formData, setFormData ] = useState({
        fullName: '',
        phoneNumber: '',
        address:'',
        email:'',
        password:'',
        passwordConfirm:'', 
        coupon:''
    });

    const handleChange = (e) => {
        const { name, value, type} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className = "register-page">
            <div className = "register-left-section">
                <div className = "register-left-card">
                    <h2 className = "head2"> Đăng ký</h2>
                    <form onSubmit= {handleSubmit} className="register-form">
                        <div className = "form-group">
                            <div className = "form-group__item">
                                <input 
                                    type = "text"
                                    name =  "fullName"
                                    value = {formData.fullName}
                                    onChange = {handleChange}
                                    placeholder=" Họ, tên"
                                    required
                                    className = "inputName"
                                />
                                <input
                                    type = "text"
                                    name = "phoneNumber"
                                    value = {formData.phoneNumber}
                                    onChange = {handleChange}
                                    placeholder="Số điện thoại"
                                    required
                                    className="inputPhonenumber"
                                />
                            </div>
                        </div>

                        <div className = "form-group">
                            <input
                                type = "text"
                                name = "address"
                                value = {formData.address}
                                onChange = {handleChange}
                                placeholder="Địa chỉ"
                                required
                            />
                        </div>
                       
                        <div className = "form-group">
                            <input
                                type = "text"
                                name = "email"
                                value = {formData.email}
                                onChange = {handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                        <div className = "form-group">
                            <input
                                type = "password"
                                name = "password"
                                value = {formData.password}
                                onChange = {handleChange}
                                placeholder="Mật khẩu"
                                required
                            />
                        </div>

                        <div className = "form-group">
                            <input
                                type = "password"
                                name = "passwordConfirm"
                                value = {formData.passwordConfirm}
                                onChange = {handleChange}
                                placeholder="Xác nhận mật khẩu"
                                required
                            />
                        </div>
                        <div className = "coupon-form-group">
                            <input
                                type = "text"
                                name = "coupon"
                                value = {formData.coupon}
                                onChange = {handleChange}
                                placeholder="Nhập mã"
                                className = "inputCoupon"
                            />
                        </div>

                        <button type ="submit" className = "d-btn d-btn-font">
                            <span>Tiếp tục
                            </span>
                        </button>
                    </form>
                </div>
            </div>

            <LoginRegisterForm mode="register"/>
        </div>
    );
}

export default Register;