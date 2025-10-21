import React, { useMemo, useState, useEffect, useRef } from 'react'
import { updateOrdersStatus } from '../../../router/orderApi'
import { useOutletContext } from 'react-router-dom'
import { getAllOrders, getAllBoxTypes, getStatistics } from '../../../router/adminApi'

export default function DashboardPage(){
  const contextData = useOutletContext() || {}
  const { orders: contextOrders = [], boxTypes: contextBoxTypes = [], currentMonthStats: contextCurrentStats, previousMonthStats: contextPrevStats } = contextData
  
  // Fallback: Load data directly if context is empty
  const [orders, setOrders] = useState(contextOrders)
  const [boxTypes, setBoxTypes] = useState(contextBoxTypes)
  const [currentMonthStats, setCurrentMonthStats] = useState(contextCurrentStats)
  const [previousMonthStats, setPreviousMonthStats] = useState(contextPrevStats)
  const didLoadData = useRef(false)
  
  useEffect(() => {
    // If context data is available, use it
    if (contextOrders.length > 0 || contextBoxTypes.length > 0 || contextCurrentStats) {
      setOrders(contextOrders)
      setBoxTypes(contextBoxTypes)
      setCurrentMonthStats(contextCurrentStats)
      setPreviousMonthStats(contextPrevStats)
      return
    }
    
    // Fallback: Load data directly
    if (didLoadData.current) return
    didLoadData.current = true
    
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    const currentMonthStart = new Date(currentYear, currentMonth, 1)
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0)
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
        setOrders(o)
        setBoxTypes(b)
        setCurrentMonthStats(currentStats)
        setPreviousMonthStats(prevStats)
      })
      .catch((error) => {
        console.error("DashboardPage API error:", error)
      })
  }, [contextOrders, contextBoxTypes, contextCurrentStats, contextPrevStats])

  const [activeBoard, setActiveBoard] = useState('orders')
  // const [rangeDays] = useState(7)
  const [revenueFilter, setRevenueFilter] = useState('current-month')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selected, setSelected] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [codeQuery, setCodeQuery] = useState('')
  const [nameQuery, setNameQuery] = useState('')
  const [dateQuery, setDateQuery] = useState('')
  const [newStatus, setNewStatus] = useState('Pending')
  const [updating, setUpdating] = useState(false)

  const boxNameById = useMemo(() => {
    const map = new Map()
    boxTypes.forEach((b) => map.set(b.id, b.name))
    return (id) => map.get(id) || 'Unknown'
  }, [boxTypes])

  // Vietnamese translations for statuses/methods
  const viOrderStatus = (s = '') => ({
    Cart: 'Giỏ hàng',
    Pending: 'Đang chờ',
    Processing: 'Đang xử lý',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
  })[s] || s
  const viPaymentMethod = (s = '') => ({
    VNPay: 'VNPay',
    CashOnDelivery: 'Thanh toán khi nhận hàng',
    PayOS: 'PayOS',
  })[s] || s
  const viPaymentStatus = (s = '') => ({
    Pending: 'Chờ thanh toán',
    Paid: 'Đã thanh toán',
    Failed: 'Thất bại',
  })[s] || s

  // Map order status text to backend enum number
  const statusToNumber = (s = '') => {
    const x = String(s)
    switch (x) {
      case 'Cart': return 0
      case 'Pending': return 1
      case 'Processing': return 2
      case 'Completed': return 3
      case 'Cancelled': return 4
      default: return 1
    }
  }

  useEffect(() => {
    if (selected?.status) {
      setNewStatus(selected.status)
    }
  }, [selected])

  async function handleUpdateStatus() {
    if (!selected) return
    if (newStatus === selected.status) return
    try {
      setUpdating(true)
      await updateOrdersStatus({ orderIds: [selected.id], status: statusToNumber(newStatus) })
      // update local state
      setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, status: newStatus } : o))
      setSelected(prev => prev ? { ...prev, status: newStatus } : prev)
    } catch (e) {
      console.error('Update status failed', e)
    } finally {
      setUpdating(false)
    }
  }

  function getOrderDate(o){
    return new Date(o.orderDate ?? o.createdAt ?? o.createAt ?? o.updateAt ?? Date.now())
  }

  

  const sortedOrders = useMemo(() => {
    let arr = Array.isArray(orders) ? [...orders] : []
    // Filter by status
    if (statusFilter !== 'all') {
      arr = arr.filter(o => String(o.status) === statusFilter)
    }
    // Filter by code (order id contains)
    if (codeQuery.trim()) {
      const q = codeQuery.trim().toLowerCase()
      arr = arr.filter(o => String(o.id).toLowerCase().includes(q))
    }
    // Filter by name (any box name contains)
    if (nameQuery.trim()) {
      const q = nameQuery.trim().toLowerCase()
      arr = arr.filter(o => (o.details||[]).some(d => boxNameById(d.boxTypeId).toLowerCase().includes(q)))
    }
    // Filter by date (DD/MM/YY)
    if (dateQuery.trim()) {
      const [dd, mm, yy] = dateQuery.split(/[-./]/)
      if (dd && mm && yy) {
        const year = Number(yy.length === 2 ? `20${yy}` : yy)
        const month = Number(mm) - 1
        const day = Number(dd)
        const start = new Date(year, month, day)
        const end = new Date(year, month, day, 23, 59, 59, 999)
        arr = arr.filter(o => {
          const d = getOrderDate(o)
          return d >= start && d <= end
        })
      }
    }
    return arr
  }, [orders, statusFilter, codeQuery, nameQuery, dateQuery, boxNameById])

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize))
  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedOrders.slice(start, start + pageSize)
  }, [sortedOrders, page])

  // Tính toán phần trăm thay đổi cho KPI
  const calculatePercentageChange = (current, previous) => {
    if (!current || !previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const ordersChange = currentMonthStats && previousMonthStats 
    ? calculatePercentageChange(currentMonthStats.totalOrders, previousMonthStats.totalOrders)
    : 0

  return (
    <>
      <section className="kpi-grid">
        <div
          className={`kpi-card clickable ${activeBoard === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveBoard('revenue')}
        >
          <div className="kpi-title">Tổng doanh thu</div>
          <div className="kpi-value">
            {currentMonthStats ? currentMonthStats.totalRevenue.toLocaleString('vi-VN') : '0'} VND
          </div>
          <div className="kpi-sub">
            {(() => {
              if (!currentMonthStats || !previousMonthStats) return '+0% so với tháng trước'
              const current = currentMonthStats.totalRevenue || 0
              const previous = previousMonthStats.totalRevenue || 0
              const change = previous === 0 ? 100 : ((current - previous) / previous) * 100
              return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% so với tháng trước`
            })()}
          </div>
        </div>
        <div
          className={`kpi-card clickable ${activeBoard === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveBoard('orders')}
        >
          <div className="kpi-title">Tổng đơn hàng</div>
          <div className="kpi-value">
            {currentMonthStats ? currentMonthStats.totalOrders.toLocaleString('vi-VN') : '0'}
          </div>
          <div className="kpi-sub">
            {ordersChange >= 0 ? '+' : ''}{ordersChange.toFixed(1)}% so với tháng trước
          </div>
        </div>
         <div
           className={`kpi-card clickable disabled ${activeBoard === 'traffic' ? 'active' : ''}`}
           onClick={() => {/* Temporarily disabled */}}
           style={{ opacity: 0.5, cursor: 'not-allowed' }}
         >
           <div className="kpi-title">Lượt truy cập</div>
           <div className="kpi-value">-</div>
           <div className="kpi-sub">Tính năng đang phát triển</div>
         </div>
      </section>

      {activeBoard === 'orders' && (
        <section className="board orders-board">
          <div className="filter-row">
            <div className="input-group">
              <input placeholder="Mã đơn hàng" value={codeQuery} onChange={(e)=>{ setPage(1); setCodeQuery(e.target.value) }} />
              <input placeholder="Tên sản phẩm" value={nameQuery} onChange={(e)=>{ setPage(1); setNameQuery(e.target.value) }} />
              <input placeholder="DD/MM/YY" value={dateQuery} onChange={(e)=>{ setPage(1); setDateQuery(e.target.value) }} />
            </div>
          </div>
          <div className="status-filter" style={{ display: 'flex', gap: 8, margin: '8px 0 12px' }}>
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'Pending', label: 'Đang chờ' },
              { key: 'Processing', label: 'Đang xử lý' },
              { key: 'Completed', label: 'Hoàn thành' },
              { key: 'Cancelled', label: 'Đã hủy' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`btn sm ${statusFilter === key ? 'primary' : ''}`}
                onClick={() => { setPage(1); setStatusFilter(key) }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 16 }}>
            <div className="table">
              <div className="row header" style={{ height: 50, minHeight: 50, alignItems: 'center' }}>
                <div>Mã đơn</div>
                <div>Tên</div>
                <div>Số lượng</div>
                <div>Ngày đặt hàng</div>
                <div>Giá</div>
                <div>Trạng thái</div>
              </div>
              <div className="table-body" style={{ height: 550, minHeight: 550}}>
                {pagedOrders.map((o) => {
                  const qty = o.details?.reduce((s, d) => s + d.quantity, 0) || 0
                  const names = o.details?.map((d) => boxNameById(d.boxTypeId)).join(', ')
                  return (
                    <div className={`row ${selected?.id === o.id ? 'active' : ''}`} key={o.id} onClick={() => setSelected(o)} style={{ cursor: 'pointer', height: 50, minHeight: 50, alignItems: 'center' }}>
                      <div>{`#${o.id.slice(0, 6)}`}</div>
                      <div>{names}</div>
                      <div>{qty}</div>
                      <div>{getOrderDate(o).toLocaleString('vi-VN')}</div>
                      <div>{(o.finalPrice ?? o.totalPrice).toLocaleString('vi-VN')} VND</div>
                      <div>{viOrderStatus(o.status)}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <aside className="order-detail" style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              {!selected && (
                <div style={{ color: '#888' }}>Chọn một đơn để xem chi tiết</div>
              )}
              {selected && (
                <div className="detail-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontWeight: 600 }}>{`#${selected.id.slice(0,6)}`} · {viOrderStatus(selected.status)}</div>
                  <div><b>Ngày:</b> {getOrderDate(selected).toLocaleString('vi-VN')}</div>
                  <div><b>Thanh toán:</b> {viPaymentMethod(selected.paymentMethod) ?? '-'} ({viPaymentStatus(selected.paymentStatus) ?? '-'})</div>
                  <div><b>Giảm giá:</b> {selected.discountCode ?? '-'}</div>
                  <div><b>Tổng:</b> {(selected.totalPrice || 0).toLocaleString('vi-VN')} VND</div>
                  <div><b>Thanh toán cuối:</b> {(selected.finalPrice || selected.totalPrice || 0).toLocaleString('vi-VN')} VND</div>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>Sản phẩm</div>
                  <div className="table">
                    <div className="row header">
                      <div>Tên</div>
                      <div>SL</div>
                      <div>Đơn giá</div>
                    </div>
                    {(selected.details || []).map((d, idx) => (
                      <div className="row" key={idx}>
                        <div>{boxNameById(d.boxTypeId)}</div>
                        <div>{d.quantity}</div>
                        <div>{(d.unitPrice||0).toLocaleString('vi-VN')} VND</div>
                      </div>
                    ))}
                  </div>
                  {selected.status !== 'Completed' && selected.status !== 'Cancelled' && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      <select value={newStatus} onChange={(e)=> setNewStatus(e.target.value)}>
                        <option value="Pending">Đang chờ</option>
                        <option value="Processing">Đang xử lý</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Đã hủy</option>
                      </select>
                      <button className={`btn sm ${newStatus !== selected.status ? 'primary' : ''}`} disabled={updating || newStatus === selected.status} onClick={handleUpdateStatus}>
                        {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
          <div className="pagination" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Trước</button>
            <span style={{ alignSelf: 'center' }}>
              {page} / {totalPages}
            </span>
            <button className="btn sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Sau</button>
          </div>
        </section>
      )}

      {activeBoard === 'revenue' && (
        <section className="board revenue-board">
          <div className="chart-card">
             <div className="chart-header">
               <div>
                 <div className="chart-title">
                   {currentMonthStats ? currentMonthStats.totalRevenue.toLocaleString('vi-VN') : '0'} VND
                 </div>
                 <div className="kpi-sub">
                   {(() => {
                     if (!currentMonthStats || !previousMonthStats) return '+0% so với kỳ trước'
                     const current = currentMonthStats.totalRevenue || 0
                     const previous = previousMonthStats.totalRevenue || 0
                     const change = previous === 0 ? 100 : ((current - previous) / previous) * 100
                     return `${change >= 0 ? '+' : ''}${change.toFixed(1)}% so với kỳ trước`
                   })()}
                 </div>
               </div>
               <div className="btn-group">
                 <button 
                   className={`btn sm ${revenueFilter === 'current-month' ? 'primary' : ''}`}
                   onClick={() => setRevenueFilter('current-month')}
                 >
                   Tháng hiện tại
                 </button>
                 <button 
                   className={`btn sm ${revenueFilter === 'previous-month' ? 'primary' : ''}`}
                   onClick={() => setRevenueFilter('previous-month')}
                 >
                   Tháng trước
                 </button>
                 <button 
                   className={`btn sm ${revenueFilter === '30-days' ? 'primary' : ''}`}
                   onClick={() => setRevenueFilter('30-days')}
                 >
                   30 ngày qua
                 </button>
                 <button 
                   className={`btn sm ${revenueFilter === '7-days' ? 'primary' : ''}`}
                   onClick={() => setRevenueFilter('7-days')}
                 >
                   7 ngày qua
                 </button>
               </div>
             </div>
             <div className="line-chart-container" style={{ width: '100%', height: '300px', padding: '20px' }}>
               {(() => {
                 if (!currentMonthStats?.revenueByDate?.length) {
                   return <div>Không có dữ liệu doanh thu theo ngày</div>
                 }
                 
                 // Filter data based on selected filter
                 let data = currentMonthStats.revenueByDate
                 const now = new Date()
                 
                 if (revenueFilter === '7-days') {
                   const sevenDaysAgo = new Date(now)
                   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
                   data = data.filter(item => new Date(item.date) >= sevenDaysAgo)
                 } else if (revenueFilter === '30-days') {
                   const thirtyDaysAgo = new Date(now)
                   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                   data = data.filter(item => new Date(item.date) >= thirtyDaysAgo)
                 } else if (revenueFilter === 'previous-month') {
                   // Use previous month data if available
                   data = previousMonthStats?.revenueByDate || []
                 }
                 
                 if (!data.length) {
                   return <div>Không có dữ liệu cho khoảng thời gian đã chọn</div>
                 }
                 const maxRevenue = Math.max(...data.map(r => r.revenue))
                 const minRevenue = Math.min(...data.map(r => r.revenue))
                 const revenueRange = maxRevenue - minRevenue
                 
                // Keep backend order
                const sortedData = data
                 
                 // Calculate SVG dimensions
                 const width = 600
                 const height = 200
                 const padding = 40
                 const chartWidth = width - padding * 2
                 const chartHeight = height - padding * 2
                 
                 // Calculate points for line
                 const points = sortedData.map((item, index) => {
                   const x = padding + (index / (sortedData.length - 1)) * chartWidth
                   const y = padding + chartHeight - ((item.revenue - minRevenue) / revenueRange) * chartHeight
                   return { x, y, revenue: item.revenue, date: item.date }
                 })
                 
                 // Create path for line
                 const pathData = points.map((point, index) => 
                   `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                 ).join(' ')
                 
                 // Create area path (for gradient fill)
                 const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`
                 
                 return (
                   <svg 
                     viewBox={`0 0 ${width} ${height}`} 
                     style={{ width: '100%', height: '100%' }}
                     onMouseEnter={(e) => {
                       // Show all labels on chart hover
                       const labels = e.currentTarget.querySelectorAll('.data-label')
                       labels.forEach(label => {
                         label.style.opacity = '1'
                       })
                     }}
                     onMouseLeave={(e) => {
                       // Hide all labels when leaving chart
                       const labels = e.currentTarget.querySelectorAll('.data-label')
                       labels.forEach(label => {
                         label.style.opacity = '0'
                       })
                     }}
                   >
                     <defs>
                       <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                         <stop offset="0%" stopColor="#7cc043" stopOpacity="0.8"/>
                         <stop offset="100%" stopColor="#7cc043" stopOpacity="0.1"/>
                       </linearGradient>
                     </defs>
                     
                     {/* Grid lines */}
                     {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                       <g key={i}>
                         <line
                           x1={padding}
                           y1={padding + ratio * chartHeight}
                           x2={padding + chartWidth}
                           y2={padding + ratio * chartHeight}
                           stroke="#e0e0e0"
                           strokeWidth="1"
                         />
                         <text
                           x={padding - 10}
                           y={padding + ratio * chartHeight + 4}
                           fontSize="10"
                           fill="#666"
                           textAnchor="end"
                         >
                           {Math.round(maxRevenue - ratio * revenueRange).toLocaleString('vi-VN')}
                         </text>
                       </g>
                     ))}
                     
                     {/* Area under line */}
                     <path
                       d={areaPath}
                       fill="url(#revenueGradient)"
                     />
                     
                     {/* Line */}
                     <path
                       d={pathData}
                       fill="none"
                       stroke="#7cc043"
                       strokeWidth="3"
                     />
                     
                     {/* Data points */}
                     {points.map((point, index) => (
                       <g key={index}>
                         <circle
                           cx={point.x}
                           cy={point.y}
                           r="6"
                           fill="#7cc043"
                           stroke="white"
                           strokeWidth="2"
                           style={{ cursor: 'pointer' }}
                         />
                         <text
                           x={point.x}
                           y={point.y - 15}
                           fontSize="10"
                           fill="#333"
                           textAnchor="middle"
                           style={{ 
                             opacity: 0,
                             transition: 'opacity 0.2s ease',
                             pointerEvents: 'none'
                           }}
                           className="data-label"
                         >
                           {point.revenue.toLocaleString('vi-VN')}
                         </text>
                       </g>
                     ))}
                     
                     {/* X-axis labels */}
                     {points.map((point, index) => (
                       <text
                         key={index}
                         x={point.x}
                         y={height - 5}
                         fontSize="10"
                         fill="#666"
                         textAnchor="middle"
                       >
                         {new Date(point.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                       </text>
                     ))}
                   </svg>
                 )
               })()}
             </div>
          </div>             
             <div className="table-card">
               <div className="table-title">Sản phẩm đã bán</div>
               <div className="table">
                 <div className="row header">
                   <div>Sản phẩm</div>
                   <div>Số lượng bán</div>
                   <div>Doanh thu</div>
                   <div>% Tổng</div>
                   <div>Giá TB</div>
                 </div>
                 {currentMonthStats?.topProducts?.map((product, index) => (
                   <div className="row" key={index}>
                     <div>{product.boxTypeName}</div>
                     <div>{product.quantitySold}</div>
                     <div>{product.revenue.toLocaleString('vi-VN')} VND</div>
                     <div>
                       {(() => {
                         const totalRevenue = currentMonthStats.topProducts.reduce((sum, p) => sum + p.revenue, 0)
                         return totalRevenue > 0 ? ((product.revenue / totalRevenue) * 100).toFixed(0) : 0
                       })()}%
                     </div>
                     <div>{Math.round(product.revenue / product.quantitySold).toLocaleString('vi-VN')} VND</div>
                   </div>
                 )) || <div className="row"><div>Không có dữ liệu sản phẩm</div></div>}
               </div>
             </div>
        </section>
      )}

      {activeBoard === 'traffic' && (
        <section className="board traffic-board">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Doanh thu theo ngày</div>
              <div className="btn-group">
                <button className="btn sm primary">Tháng hiện tại</button>
                <button className="btn sm">Tháng trước</button>
              </div>
            </div>
            <div className="line-chart-container" style={{ width: '100%', height: '300px', padding: '20px' }}>
              {(() => {
                if (!currentMonthStats?.revenueByDate?.length) {
                  return <div>Không có dữ liệu doanh thu theo ngày</div>
                }
                
                const data = currentMonthStats.revenueByDate
                const maxRevenue = Math.max(...data.map(r => r.revenue))
                const minRevenue = Math.min(...data.map(r => r.revenue))
                const revenueRange = maxRevenue - minRevenue
                
                // Keep backend order
                const sortedData = data
                
                // Calculate SVG dimensions
                const width = 600
                const height = 200
                const padding = 40
                const chartWidth = width - padding * 2
                const chartHeight = height - padding * 2
                
                // Calculate points for line
                const points = sortedData.map((item, index) => {
                  const x = padding + (index / (sortedData.length - 1)) * chartWidth
                  const y = padding + chartHeight - ((item.revenue - minRevenue) / revenueRange) * chartHeight
                  return { x, y, revenue: item.revenue, date: item.date }
                })
                
                // Create path for line
                const pathData = points.map((point, index) => 
                  `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                ).join(' ')
                
                // Create area path (for gradient fill)
                const areaPath = `${pathData} L ${points[points.length - 1].x} ${padding + chartHeight} L ${points[0].x} ${padding + chartHeight} Z`
                
                 return (
                   <svg 
                     viewBox={`0 0 ${width} ${height}`} 
                     style={{ width: '100%', height: '100%' }}
                     onMouseEnter={(e) => {
                       // Show all labels on chart hover
                       const labels = e.currentTarget.querySelectorAll('.data-label')
                       labels.forEach(label => {
                         label.style.opacity = '1'
                       })
                     }}
                     onMouseLeave={(e) => {
                       // Hide all labels when leaving chart
                       const labels = e.currentTarget.querySelectorAll('.data-label')
                       labels.forEach(label => {
                         label.style.opacity = '0'
                       })
                     }}
                   >
                     <defs>
                       <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                         <stop offset="0%" stopColor="#7cc043" stopOpacity="0.8"/>
                         <stop offset="100%" stopColor="#7cc043" stopOpacity="0.1"/>
                       </linearGradient>
                     </defs>
                    
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                      <g key={i}>
                        <line
                          x1={padding}
                          y1={padding + ratio * chartHeight}
                          x2={padding + chartWidth}
                          y2={padding + ratio * chartHeight}
                          stroke="#e0e0e0"
                          strokeWidth="1"
                        />
                        <text
                          x={padding - 10}
                          y={padding + ratio * chartHeight + 4}
                          fontSize="10"
                          fill="#666"
                          textAnchor="end"
                        >
                          {Math.round(maxRevenue - ratio * revenueRange).toLocaleString('vi-VN')}
                        </text>
                      </g>
                    ))}
                    
                    {/* Area under line */}
                    <path
                      d={areaPath}
                      fill="url(#revenueGradient)"
                    />
                    
                    {/* Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#7cc043"
                      strokeWidth="3"
                    />
                    
                     {/* Data points */}
                     {points.map((point, index) => (
                       <g key={index}>
                         <circle
                           cx={point.x}
                           cy={point.y}
                           r="6"
                           fill="#7cc043"
                           stroke="white"
                           strokeWidth="2"
                           style={{ cursor: 'pointer' }}
                         />
                         <text
                           x={point.x}
                           y={point.y - 15}
                           fontSize="10"
                           fill="#333"
                           textAnchor="middle"
                           style={{ 
                             opacity: 0,
                             transition: 'opacity 0.2s ease',
                             pointerEvents: 'none'
                           }}
                           className="data-label"
                         >
                           {point.revenue.toLocaleString('vi-VN')}
                         </text>
                       </g>
                     ))}
                    
                    {/* X-axis labels */}
                    {points.map((point, index) => (
                      <text
                        key={index}
                        x={point.x}
                        y={height - 5}
                        fontSize="10"
                        fill="#666"
                        textAnchor="middle"
                      >
                        {new Date(point.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </text>
                    ))}
                  </svg>
                )
              })()}
            </div>
          </div>
          <div className="board-grid three">
            <div className="table-card">
              <div className="table-title">Sản phẩm bán chạy</div>
              <div className="table">
                <div className="row header"><div>Sản phẩm</div><div>Số lượng</div><div>Doanh thu</div></div>
                {currentMonthStats?.topProducts?.map((product, index) => (
                  <div key={index} className="row">
                    <div>{product.boxTypeName}</div>
                    <div>{product.quantitySold}</div>
                    <div>{product.revenue.toLocaleString('vi-VN')} VND</div>
                  </div>
                )) || <div className="row"><div>Không có dữ liệu</div></div>}
              </div>
            </div>
            <div className="panel-card center">
              <div className="panel-title">Phương thức thanh toán</div>
              <div className="donut">
                <div className="ring" />
                <div className="slice s1" />
                <div className="slice s2" />
              </div>
              <div className="legend">
                {Object.entries(currentMonthStats?.paymentMethodStats || {}).map(([method, count]) => (
                  <div key={method}>
                    <span className="dot g" /> {method}: {count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}


