import React, { useMemo, useState, useEffect, useRef } from 'react'
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
  const [rangeDays] = useState(7)
  const [revenueFilter, setRevenueFilter] = useState('current-month')

  const boxNameById = useMemo(() => {
    const map = new Map()
    boxTypes.forEach((b) => map.set(b.id, b.name))
    return (id) => map.get(id) || 'Unknown'
  }, [boxTypes])

  function getOrderDate(o){
    return new Date(o.createdAt ?? o.createAt ?? o.updateAt ?? Date.now())
  }

  function getOrderTotal(o){
    if (typeof o.finalPrice === 'number' && o.finalPrice > 0) return o.finalPrice
    if (typeof o.totalPrice === 'number' && o.totalPrice > 0) return o.totalPrice
    if (Array.isArray(o.details)){
      return o.details.reduce((s,d)=> s + (d.quantity||0) * (d.unitPrice||0), 0)
    }
    return 0
  }

  const revenueModel = useMemo(() => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(start.getDate() - (rangeDays - 1))

    const prevStart = new Date(start)
    prevStart.setDate(prevStart.getDate() - rangeDays)
    const prevEnd = new Date(start)
    prevEnd.setDate(prevEnd.getDate() - 1)

    const buckets = []
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const key = d.toISOString().slice(0,10)
      buckets.push({ key, date: d, total: 0 })
    }

    const inRange = orders.filter(o => {
      const d = getOrderDate(o)
      return d >= start && d <= now
    })
    const inPrevRange = orders.filter(o => {
      const d = getOrderDate(o)
      return d >= prevStart && d <= prevEnd
    })

    let total = 0
    inRange.forEach(o => {
      const d = getOrderDate(o)
      const key = d.toISOString().slice(0,10)
      const b = buckets.find(x => x.key === key)
      const t = getOrderTotal(o)
      total += t
      if (b) b.total += t
    })

    const prevTotal = inPrevRange.reduce((s,o)=> s + getOrderTotal(o), 0)
    const delta = prevTotal === 0 ? 100 : ((total - prevTotal) / prevTotal) * 100

    const boxMap = new Map()
    inRange.forEach(o => {
      (o.details||[]).forEach(d => {
        const name = boxNameById(d.boxTypeId)
        const add = (d.quantity||0) * (d.unitPrice||0)
        boxMap.set(name, (boxMap.get(name)||0) + add)
      })
    })
    const boxRows = Array.from(boxMap.entries()).sort((a,b)=> b[1]-a[1])
    const max = Math.max(1, ...buckets.map(b => b.total))
    return { buckets, total, delta, max, boxRows }
  }, [orders, boxNameById, rangeDays])

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
            <div className="btn-group">
              <button className="btn sm primary">Đơn lẻ</button>
              <button className="btn sm">Đơn nhóm</button>
            </div>
            <div className="input-group">
              <input placeholder="Mã đơn hàng" />
              <input placeholder="Tên khách hàng" />
              <input placeholder="DD/MM/YY" />
              <select>
                <option>Loại đơn hàng</option>
                <option>Đơn lẻ</option>
                <option>Đơn nhóm</option>
              </select>
            </div>
          </div>
          <div className="table">
            <div className="row header">
              <div>Mã đơn</div>
              <div>Tên</div>
              <div>Loại đơn</div>
              <div>Ngày</div>
              <div>Giá</div>
              <div>Trạng thái</div>
            </div>
            {orders.map((o) => {
              const qty = o.details?.reduce((s, d) => s + d.quantity, 0) || 0
              const names = o.details?.map((d) => boxNameById(d.boxTypeId)).join(', ')
              return (
                <div className="row" key={o.id}>
                  <div>{`#${o.id.slice(0, 6)}`}</div>
                  <div>{names}</div>
                  <div>{qty}</div>
                  <div>{(o.finalPrice ?? o.totalPrice).toLocaleString('vi-VN')} VND</div>
                  <div>{o.discountCode ?? '-'}</div>
                  <div>{o.status}</div>
                </div>
              )
            })}
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
                 
                 // Sort data by date
                 const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
                 
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
                
                // Sort data by date
                const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))
                
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


