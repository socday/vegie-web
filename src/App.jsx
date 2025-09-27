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
import BoxSelector from './components/user/order/box/boxselector'
import GiftDetoxBox from './components/user/order/box/GiftDetoxBox'
import RetailPackage from './components/user/order/subcription/retailpackage'
import WeeklyPackage from './components/user/order/subcription/weeklypackage'
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
            <Route path='/san-pham' element={<BoxSelector/>}/>
            <Route path='/custom-box' element={<GiftDetoxBox/>}/>
            <Route path='/retail-package' element={<RetailPackage/>}/>
            <Route path='/weekly-package' element={<WeeklyPackage/>}/>
          </Routes>
          <Footer/>
        </Router>
      </main>
    </>
  )
}

export default App
