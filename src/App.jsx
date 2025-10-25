import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
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
import WeeklyPackage from './components/home/subcription/weeklypackage'
import BlindBox from './components/home/box/BlindBox'
import ScrollToTop from "./components/notifications/ScrollToTop"
import Payment from './components/user/order/payment/Payment'
import Profile from './components/user/profile/Profile'
import PrivateRoute from './router/PrivateRoute'
import AdminShell from './components/admin/AdminShell'
import DashboardPage from './components/admin/pages/DashboardPage'
import OrdersPage from './components/admin/pages/OrdersPage'
import AIRecipesPage from './components/admin/pages/AIRecipesPage'
import DiscountsPage from './components/admin/pages/DiscountsPage'
import Box3D from './components/3d/Box3D'
import AiMenu from './components/home/AiMenu'
import FruitSelection from './components/3d/FruitSelection'
import Letters from './components/3d/Letters'
import GiftPreview from './components/3d/GiftPreview'
import TodayMenu from './components/home/TodayMenu'
import FinishGiftBox from './components/3d/FinishGiftBox'
import ViewComboSectionWrapper from './components/home/ViewComboSectionWrapper'
import UserNotification from './components/notifications/UserNotification.tsx'
import FooterMobile from './components/layout/FooterMobile.tsx'
import StageNotificationWrapper from './components/notifications/StageNotificationWrapper.tsx'
import ReviewOrderForm from './components/user/profile/order/ReviewOrderForm.tsx'
import { OrderProvider } from './context/OrderContext.tsx'
import PaymentNow from './components/user/order/payment/PaymentNow'
import RetailPackage from './components/home/subcription/RetailPackage'

function AppContent() {
  const location = useLocation()
  const [authTick, setAuthTick] = useState(0)
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        setAuthTick((t) => t + 1)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Trigger rerender when tokens change in same tab
  useEffect(() => {
    const onAuthEvent = () => setAuthTick((t) => t + 1)
    window.addEventListener('auth-change', onAuthEvent)
    return () => window.removeEventListener('auth-change', onAuthEvent)
  }, [])

  return (
    <>
      {isAdminRoute ? null : <NavBar key={`nav-${authTick}`} />}
      <ScrollToTop />
      <OrderProvider>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trang-chu' element={<Home />} />
          <Route path='/vegie-care' element={<Home />} />
          <Route path='/gioi-thieu' element={<Home />} />
          <Route path='/dang-nhap' element={<Login />} />
          <Route path='/khoi-phuc-mat-khau' element={<PasswordRecovery />} />
          <Route path='/stage-notification' element={<StageNotification />} />
          <Route path='/dang-ky' element={<Register />} />
          <Route path='/san-pham' element={<BoxSelector />} />
          <Route path='/custom-box' element={<GiftDetoxBox />} />
          <Route path='/thanh-toan-ngay' element={<PaymentNow />} />
          <Route path='/retail-package' element={<RetailPackage/>} />
          <Route path='/weekly-package' element={<WeeklyPackage />} />
          <Route path='/blind-box' element={<BlindBox />} />
          <Route path='/box-3d' element={
              <Box3D />
          } />
          <Route path='/profile-test' element={<Profile />} />
          <Route path='/today-menu' element={
            <PrivateRoute>
              <TodayMenu />
            </PrivateRoute>
          } />
          <Route path='/fruit-selection' element={<FruitSelection />} />
          <Route path='/ai-menu' element={<AiMenu />} />
          <Route path='/finish-giftbox' element={<FinishGiftBox />} />
          <Route path='/letters' element={<Letters />} />
          <Route path='/gift-preview' element={<GiftPreview />} />
          <Route path="/combo/:type" element={<ViewComboSectionWrapper />} />
          <Route path="/noti/:type" element={<StageNotificationWrapper />} />
          <Route path="/:type" element={<StageNotificationWrapper />} />
          <Route path="/thong-bao" element={
            <PrivateRoute>
              <UserNotification />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/gio-hang" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path="/thanh-toan" element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          } />
          <Route path="/review-order/:orderId" element={
            <PrivateRoute>
              <ReviewOrderForm/>
            </PrivateRoute>
          } />
          <Route path='/admin' element={<AdminShell />} >
            <Route index element={<DashboardPage />} />
            <Route path='orders' element={<OrdersPage />} />
            <Route path='products' element={<div />} />
            <Route path='customers' element={<div />} />
            <Route path='coupons' element={<DiscountsPage />} />
            <Route path='blog' element={<div />} />
            <Route path='payments' element={<div />} />
                      <Route path='ai-recipes' element={<AIRecipesPage />} />
          </Route>
        </Routes>
      </OrderProvider>
      {isAdminRoute ? null : <Footer key={`footer-${authTick}`} />}
      <FooterMobile />
    </>
  )
}

function App() {
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const threshold = 160
  //     if (
  //       window.outerWidth - window.innerWidth > threshold ||
  //       window.outerHeight - window.innerHeight > threshold
  //     ) {
  //       alert("DevTools detected. Action not allowed.")
  //     }
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <>
      <main>
        <Router>
          <AppContent />
        </Router>
      </main>
    </>
  )
}

export default App