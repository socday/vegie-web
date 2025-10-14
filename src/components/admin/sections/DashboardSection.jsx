import React, { useMemo, useState } from 'react'

export default function DashboardSection({ orders = [], boxTypes = [] }) {
  const [activeBoard, setActiveBoard] = useState('orders')
  const [rangeDays, setRangeDays] = useState(7)

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

  return (
    <>
      <section className="kpi-grid">
        <div
          className={`kpi-card clickable ${activeBoard === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveBoard('revenue')}
        >
          <div className="kpi-title">Tổng doanh thu</div>
          <div className="kpi-value">20.178.00 VND</div>
          <div className="kpi-sub">+2.35% so với tháng trước</div>
        </div>
        <div
          className={`kpi-card clickable ${activeBoard === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveBoard('orders')}
        >
          <div className="kpi-title">Tổng đơn hàng</div>
          <div className="kpi-value">7,563</div>
          <div className="kpi-sub">+12.5% so với tháng trước</div>
        </div>
        <div
          className={`kpi-card clickable ${activeBoard === 'traffic' ? 'active' : ''}`}
          onClick={() => setActiveBoard('traffic')}
        >
          <div className="kpi-title">Lượt truy cập</div>
          <div className="kpi-value">7,563</div>
          <div className="kpi-sub">+5% so với tháng trước</div>
        </div>
      </section>

      {activeBoard === 'orders' && (
        <section className="board orders-board">
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
                <div className="chart-title">{revenueModel.total.toLocaleString('vi-VN')} VND</div>
                <div className="kpi-sub">{revenueModel.delta >= 0 ? '+' : ''}{revenueModel.delta.toFixed(1)}% so với kỳ trước</div>
              </div>
              <div className="btn-group">
                <button className={`btn sm ${rangeDays===7?'primary':''}`} onClick={()=>setRangeDays(7)}>7 ngày</button>
                <button className={`btn sm ${rangeDays===30?'primary':''}`} onClick={()=>setRangeDays(30)}>30 ngày</button>
              </div>
            </div>
            <div className="bar-chart">
              {revenueModel.buckets.map((b) => (
                <div key={b.key} className="bar-col">
                  <div className="bar bar-bg" style={{ height: '80%' }} />
                  <div className="bar bar-fg" style={{ height: `${(b.total / revenueModel.max) * 80}%` }} />
                  <div className="bar-label">{new Date(b.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="table-card">
            <div className="table-title">Sản phẩm bán chạy</div>
            <div className="table">
              <div className="row header">
                <div>Sản phẩm</div>
                <div>%</div>
                <div>Doanh thu</div>
              </div>
              {(() => {
                const total = Math.max(1, revenueModel.boxRows.reduce((s, [,v])=> s+v, 0))
                return revenueModel.boxRows.map(([name, val]) => (
                  <div className="row" key={name}>
                    <div>{name}</div>
                    <div>{((val/total)*100).toFixed(0)}%</div>
                    <div>{val.toLocaleString('vi-VN')} VND</div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </section>
      )}

      {activeBoard === 'traffic' && (
        <section className="board traffic-board">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">Lượt truy cập 7 ngày qua</div>
              <div className="btn-group">
                <button className="btn sm primary">7 ngày</button>
                <button className="btn sm">30 ngày</button>
              </div>
            </div>
            <svg viewBox="0 0 600 220" className="line-chart">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7cc043" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#7cc043" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M20 180 L100 120 L180 140 L260 180 L340 170 L420 130 L500 90" fill="none" stroke="#7cc043" strokeWidth="3"/>
              <path d="M20 180 L100 120 L180 140 L260 180 L340 170 L420 130 L500 90 L580 180" fill="url(#g)" stroke="none"/>
            </svg>
          </div>
        </section>
      )}
    </>
  )
}


