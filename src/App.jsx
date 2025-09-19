import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/home/Home'
import Login from './components/auth/Login'
import NavBar from './components/layout/NavBar'
import Footer from './components/layout/Footer'
import StageNotification from './components/notifications/StageNotification'
import PasswordRecovery from './components/auth/PasswordRecovery'
import Register from './components/auth/Register'
import Cart from './components/user/order/cart/Cart'
import Payment from './components/user/order/payment/Payment'

function App() {

  return(
    <>
      <main>
        <Router>
          <NavBar/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/vegie-care' element={<Home/>} />
            <Route path='/gioi-thieu' element={<Home/>} />
            <Route path='/dang-nhap' element={<Login/>} />
            <Route path='/khoi-phuc-mat-khau' element={<PasswordRecovery/>} />
            <Route path='/stage-notification' element={<StageNotification/>} />
            <Route path='/dang-ky' element={<Register/>}/>
            <Route path='/gio-hang' element={<Cart/>}/>
            <Route path='/thanh-toan' element={<Payment/>}/>

          </Routes>
          <Footer/>
        </Router>
      </main>
    </>
  )
}

export default App
