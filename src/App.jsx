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

import BoxSelector from './components/home/box/Boxselector'
import GiftDetoxBox from './components/home/box/GiftDetoxBox'
import RetailPackage from './components/home/subcription/retailpackage'
import WeeklyPackage from './components/home/subcription/weeklypackage'
import BlindBox from './components/home/box/BlindBox'
import ScrollToTop from "./components/notifications/ScrollToTop";

import Payment from './components/user/order/payment/Payment'
import Profile from './components/user/profile/Profile'
import PrivateRoute from './router/PrivateRoute'
import Box3D from './components/3d/Box3D'
import MyWeeklyPackage from './components/home/WeeklyPackage'
import AiMenu from './components/home/AiMenu'


function App() {
  return (
    <>
      <main>
        <Router>
          <NavBar/>
          <ScrollToTop/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/vegie-care' element={<Home/>} />
            <Route path='/gioi-thieu' element={<Home/>} />
            <Route path='/dang-nhap' element={<Login/>} />
            <Route path='/khoi-phuc-mat-khau' element={<PasswordRecovery/>} />
            <Route path='/stage-notification' element={<StageNotification/>} />
            <Route path='/dang-ky' element={<Register/>}/>
            <Route path='/san-pham' element={<BoxSelector/>}/>
            <Route path='/custom-box' element={<GiftDetoxBox/>}/>
            <Route path='/retail-package' element={<RetailPackage/>}/>
            <Route path='/weekly-package' element={<WeeklyPackage/>}/>
            <Route path='/blind-box' element={<BlindBox/>}/>
            <Route path='/box-3d' element={<Box3D/>}/>
            <Route path='/profile-test' element={<Profile/>}/>
            <Route path='/my-weekly-package' element = {<MyWeeklyPackage/>}/>
            <Route path='/ai-menu' element = {<AiMenu/>}/>
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/gio-hang"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />

      <Route
        path="/thanh-toan"
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        }
      />

          </Routes>
          <Footer/>
        </Router>
      </main>
    </>
  )
}

export default App