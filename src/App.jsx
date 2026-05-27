import React from 'react'
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
import BlindBox from './components/home/box/BlindBox'
import ScrollToTop from "./components/notifications/ScrollToTop"
import Payment from './components/user/order/payment/Payment'
import Profile from './components/user/profile/Profile'
import AdminShell from './components/admin/AdminShell'
import DashboardPage from './components/admin/pages/DashboardPage'
import OrdersPage from './components/admin/pages/OrdersPage'
import ProductsPage from './components/admin/pages/ProductsPage'
import AIRecipesPage from './components/admin/pages/AIRecipesPage'
import DiscountsPage from './components/admin/pages/DiscountsPage'
import UsersPage from './components/admin/pages/UsersPage'
import Box3D from './components/3d/Box3D'
import AiMenu from './components/home/AiMenu'
import WeeklyPackage from './components/home/subcription/WeeklyPackage'
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
import RetailPackage from './components/home/subcription/retailpackage.tsx'
import PasswordRecoveryForm from './components/auth/PasswordRecoveryForm'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  return (
    <>
      <div className='app-layout'> 
      {isAdminRoute ? null : <NavBar />}
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

          <Route path='/khoi-phuc' element={<PasswordRecoveryForm/>} />
          <Route path='/san-pham' element={<BoxSelector />} />
          <Route path='/custom-box' element={<GiftDetoxBox />} />
          <Route path='/retail-package' element={<RetailPackage />} />
          <Route path='/weekly-package' element={<WeeklyPackage />} />
          <Route path='/blind-box' element={<BlindBox />} />

          <Route path='/box-3d' element={
              <Box3D />
          } />

          <Route path='/profile-test' element={<Profile />} />

          <Route path='/ai-menu' element={<AiMenu />} />

          <Route path='/ai-menu-test' element={<AiMenu />} />

          <Route path='/fruit-selection' element={<FruitSelection />} />

          <Route path='/today-menu' element={<TodayMenu />} />

          <Route path='/finish-giftbox' element={<FinishGiftBox />} />
          <Route path='/letters' element={<Letters />} />
          <Route path='/gift-preview' element={<GiftPreview />} />
          <Route path="/combo/:type" element={<ViewComboSectionWrapper />} />

          {/* Bổ sung từ main */}
          <Route path="/noti/:type" element={<StageNotificationWrapper />} />
          <Route path="/:type" element={<StageNotificationWrapper />} />

          <Route path="/thong-bao" element={<UserNotification />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/gio-hang" element={<Cart />} />

          <Route path="/thanh-toan" element={<Payment />} />

          <Route path="/review-order/:orderId" element={<ReviewOrderForm />} />

          {/* Khu vực admin */}
              <Route path='/admin' element={<AdminShell />} >
                <Route index element={<DashboardPage />} />
                <Route path='orders' element={<OrdersPage />} />
                <Route path='products' element={<ProductsPage />} />
                <Route path='customers' element={<UsersPage />} />
                <Route path='coupons' element={<DiscountsPage />} />
                <Route path='blog' element={<div />} />
                <Route path='payments' element={<div />} />
                <Route path='ai-recipes' element={<AIRecipesPage />} />
              </Route>
        </Routes>
      </OrderProvider>
    </div>      
      {isAdminRoute ? null : <Footer />}

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