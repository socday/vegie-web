import React, { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { checkAuth } from '../../router/authApi'
import { getAllBoxTypes, getAllOrders, getStatistics, getUsers } from '../../router/adminApi'
import './styles/admin.css'

export default function AdminShell() {
  const [adminUser, setAdminUser] = useState({ firstName: '', lastName: '', email: '', roles: [] })
  const [orders, setOrders] = useState([])
  const [boxTypes, setBoxTypes] = useState([])
  const [users, setUsers] = useState([])
  const [currentMonthStats, setCurrentMonthStats] = useState(null)
  const [previousMonthStats, setPreviousMonthStats] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true'
  })
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

  const loadData = async () => {
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

    try {
      const [o, b, u, currentStats, prevStats] = await Promise.all([
        getAllOrders(), 
        getAllBoxTypes(),
        getUsers(),
        getStatistics(formatDate(currentMonthStart), formatDate(currentMonthEnd)),
        getStatistics(formatDate(previousMonthStart), formatDate(previousMonthEnd))
      ])
      
      console.log('AdminShell - loaded users:', u.length)
      setOrders(o)
      setBoxTypes(b)
      setUsers(u)
      setCurrentMonthStats(currentStats)
      setPreviousMonthStats(prevStats)
    } catch (error) {
      console.error("AdminShell API error:", error)
    }
  }

  useEffect(() => {
    if (didLoadData.current) return
    didLoadData.current = true
    
    loadData()
  }, [])

  // Listen for refresh events from child components
  useEffect(() => {
    const handleOrdersRefresh = (event) => {
      const newOrders = event.detail
      if (newOrders) {
        setOrders(newOrders)
      }
    }

    const handleBoxTypesRefresh = (event) => {
      const newBoxTypes = event.detail
      if (newBoxTypes) {
        setBoxTypes(newBoxTypes)
      }
    }

    const handleUsersRefresh = (event) => {
      const newUsers = event.detail
      console.log('AdminShell - received users refresh:', newUsers?.length)
      if (newUsers) {
        setUsers(newUsers)
      }
    }

    const handleStatsRefresh = (event) => {
      const { currentMonth, previousMonth } = event.detail
      if (currentMonth) {
        setCurrentMonthStats(currentMonth)
      }
      if (previousMonth) {
        setPreviousMonthStats(previousMonth)
      }
    }

    const handleOrdersUpdate = () => {
      // Refetch all data when orders are updated
      loadData()
    }

    const handleBoxTypesUpdate = () => {
      // Refetch all data when box types are updated
      loadData()
    }

    window.addEventListener('orders-refresh', handleOrdersRefresh)
    window.addEventListener('box-types-refresh', handleBoxTypesRefresh)
    window.addEventListener('stats-refresh', handleStatsRefresh)
    window.addEventListener('orders-updated', handleOrdersUpdate)
    window.addEventListener('box-types-updated', handleBoxTypesUpdate)
    window.addEventListener('users-refresh', handleUsersRefresh)
    
    return () => {
      window.removeEventListener('orders-refresh', handleOrdersRefresh)
      window.removeEventListener('box-types-refresh', handleBoxTypesRefresh)
      window.removeEventListener('stats-refresh', handleStatsRefresh)
      window.removeEventListener('orders-updated', handleOrdersUpdate)
      window.removeEventListener('box-types-updated', handleBoxTypesUpdate)
      window.removeEventListener('users-refresh', handleUsersRefresh)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('adminDarkMode', newMode.toString())
    document.body.classList.toggle('admin-dark-mode', newMode)
  }

  useEffect(() => {
    document.body.classList.toggle('admin-dark-mode', isDarkMode)
  }, [isDarkMode])

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
          <NavLink to="/admin/ai-recipes">AI Recipes</NavLink>
          <NavLink to="/admin/coupons">Mã giảm giá</NavLink>
          <NavLink to="/admin/blog">Blog</NavLink>
        </nav>

        
        <button onClick={handleLogout} className="btn btn-logout">Đăng xuất</button>
        <button onClick={toggleDarkMode} className="btn btn-theme">
          {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Sáng' : 'Tối'}
        </button>
      </aside>

      <div className="admin-main">
        <main className="admin-content">
          <Outlet context={{ orders, boxTypes, users, adminUser, currentMonthStats, previousMonthStats }} />
        </main>
      </div>
    </div>
  )
}




