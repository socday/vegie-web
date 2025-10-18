import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { checkAuth } from '../../router/authApi'
import { getAllBoxTypes, getAllOrders, getStatistics } from '../../router/adminApi'
import './styles/admin.css'

export default function AdminShell() {
  const [adminUser, setAdminUser] = useState({ firstName: '', lastName: '', email: '', roles: [] })
  const [orders, setOrders] = useState([])
  const [boxTypes, setBoxTypes] = useState([])
  const [currentMonthStats, setCurrentMonthStats] = useState(null)
  const [previousMonthStats, setPreviousMonthStats] = useState(null)
  const didLoadData = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth().then((res) => {
      const data = res?.user?.data ?? res?.user ?? {}
      setAdminUser({
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        email: data.email ?? '',
        roles: data.roles ?? ['ADMIN'],
      })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (didLoadData.current) return
    didLoadData.current = true
    let ignore = false
    
    // Tính toán ngày tháng hiện tại và tháng trước
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    const currentMonthStart = new Date(currentYear, currentMonth, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0)
    
    // Tháng trước
    const previousMonthStart = new Date(currentYear, currentMonth - 1, 1)
    const previousMonthEnd = new Date(currentYear, currentMonth, 0)
    
    const formatDate = (date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  
    
    Promise.all([
      getAllOrders(), 
      getAllBoxTypes(),
      getStatistics(formatDate(currentMonthStart), formatDate(currentMonthEnd)),
      getStatistics(formatDate(previousMonthStart), formatDate(previousMonthEnd))
    ])
      .then(([o, b, currentStats, prevStats]) => { 
        if (!ignore){
          setOrders(o); 
          setBoxTypes(b)
          setCurrentMonthStats(currentStats)
          setPreviousMonthStats(prevStats)
        }
      })
      .catch((error) => {
        console.error("AdminShell API error:", error)
      })
    return () => { ignore = true }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  const initials = `${(adminUser.firstName||'A')[0] ?? 'A'}${(adminUser.lastName||'D')[0] ?? 'D'}`

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-user">
          <div className="admin-avatar">{initials}</div>
          <div className="admin-user-info">
            <div className="admin-user-name">{`${adminUser.firstName} ${adminUser.lastName}`.trim() || 'Admin'}</div>
            <div className="admin-user-role">{adminUser.email}</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Sản phẩm</NavLink>
          <NavLink to="/admin/customers">Khách hàng</NavLink>
          <NavLink to="/admin/orders">Đơn hàng</NavLink>
          <NavLink to="/admin/coupons">Mã giảm giá</NavLink>
          <NavLink to="/admin/blog">Blog</NavLink>
          <NavLink to="/admin/payments">Thanh toán</NavLink>
        </nav>

        <button onClick={handleLogout} className="btn btn-logout">Đăng xuất</button>
      </aside>

      <div className="admin-main">
        <main className="admin-content">
          <Outlet context={{ orders, boxTypes, adminUser, currentMonthStats, previousMonthStats }} />
        </main>
      </div>
    </div>
  )
}


