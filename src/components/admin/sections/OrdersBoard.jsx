import React, { useState, useMemo, useEffect } from 'react'
import { updateOrdersStatus } from '../../../router/orderApi'

export default function OrdersBoard({ orders = [], boxNameById, onRefresh }) {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [codeQuery, setCodeQuery] = useState('')
  const [nameQuery, setNameQuery] = useState('')
  const [dateQuery, setDateQuery] = useState('')
  const [newStatus, setNewStatus] = useState('Pending')
  const [updating, setUpdating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState({}) // Track expanded detail indices

  const pageSize = 11

  // Update newStatus when selected order changes
  useEffect(() => {
    if (selected) {
      setNewStatus(selected.status)
    }
  }, [selected])

  // Vietnamese translations
  const viOrderStatus = (status) => {
    const map = {
      'Pending': 'Đang chờ',
      'Processing': 'Đang xử lý', 
      'Completed': 'Hoàn thành',
      'Cancelled': 'Đã hủy',
      'Cart': 'Giỏ hàng'
    }
    return map[status] || status
  }

  const viPaymentMethod = (method) => {
    const map = {
      'VNPay': 'VNPay',
      'PayOS': 'PayOS',
      'CashOnDelivery': 'Thanh toán khi nhận hàng'
    }
    return map[method] || method
  }

  const viPaymentStatus = (status) => {
    const map = {
      'Pending': 'Chờ thanh toán',
      'Paid': 'Đã thanh toán',
      'Failed': 'Thanh toán thất bại'
    }
    return map[status] || status
  }

  const statusToNumber = (status) => {
    const map = {
      'Pending': 1,
      'Processing': 2,
      'Completed': 3,
      'Cancelled': 4,
      'Cart': 0
    }
    return map[status] || 1
  }

  const getOrderDate = (order) => {
    if (order.orderDate) {
      return new Date(order.orderDate)
    }
    return new Date()
  }

  const handleUpdateStatus = async () => {
    if (!selected || updating) return
    
    try {
      setUpdating(true)
      const statusNumber = statusToNumber(newStatus)
      await updateOrdersStatus({
        orderIds: [selected.id],
        status: statusNumber
      })
      
      // Update local state optimistically
      // const updatedOrders = orders.map(o => 
      //   o.id === selected.id ? { ...o, status: newStatus } : o
      // )
      
      // Update selected order
      setSelected({ ...selected, status: newStatus })
      
      // Trigger a refresh by dispatching an event
      window.dispatchEvent(new CustomEvent('orders-updated'))
      
    } catch (error) {
      console.error('Update status failed', error)
      alert('Cập nhật trạng thái thất bại')
    } finally {
      setUpdating(false)
    }
  }

  const handleRefresh = async () => {
    if (!onRefresh || refreshing) return
    
    try {
      setRefreshing(true)
      await onRefresh()
    } catch (error) {
      console.error('Refresh failed', error)
      alert('Làm mới dữ liệu thất bại')
    } finally {
      setRefreshing(false)
    }
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

  return (
    <section className="board orders-board">
      <div className="filter-row">
        <div className="input-group">
          <input placeholder="Mã đơn hàng" value={codeQuery} onChange={(e)=>{ setPage(1); setCodeQuery(e.target.value) }} />
          <input placeholder="Tên sản phẩm" value={nameQuery} onChange={(e)=>{ setPage(1); setNameQuery(e.target.value) }} />
          <div style={{ display: 'flex', gap: 4 }}>
            <input placeholder="DD/MM/YY" value={dateQuery} onChange={(e)=>{ setPage(1); setDateQuery(e.target.value) }} />
          </div>
          <button 
            className="btn sm primary" 
            onClick={handleRefresh}
            disabled={refreshing || !onRefresh}
            style={{ padding: '8px 16px' }}
          >
            {refreshing ? 'Đang tải...' : 'Làm mới đơn hàng'}
          </button>
        </div>
      </div>
      <div className="status-filter" style={{ display: 'flex', gap: 8, margin: '8px 0 4px' }}>
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
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gridTemplateRows: '1fr', gap: 16, alignItems: 'start' }}>
         <div className="orders-table">
           <div className="orders-header">
             <div>Mã đơn</div>
             <div>Tên</div>
             <div>Số lượng</div>
             <div>Ngày đặt hàng</div>
             <div>Giá</div>
             <div>Trạng thái</div>
           </div>
           <div className="orders-body">
             {pagedOrders.map((o) => {
               const qty = o.details?.reduce((s, d) => s + d.quantity, 0) || 0
               const names = o.details?.map((d) => boxNameById(d.boxTypeId)).join(', ')
               return (
                 <div className={`orders-row ${selected?.id === o.id ? 'active' : ''}`} key={o.id} onClick={() => setSelected(o)}>
                   <div>{`#${o.id.slice(0, 6)}`}</div>
                   <div>{names}</div>
                   <div className="quantity-cell">{qty}</div>
                   <div>{getOrderDate(o).toLocaleString('vi-VN')}</div>
                   <div>{(o.finalPrice ?? o.totalPrice).toLocaleString('vi-VN')} VND</div>
                   <div>{viOrderStatus(o.status)}</div>
                 </div>
               )
             })}
           </div>
           <div className="pagination">
             <button className="btn sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Trước</button>
             <span style={{ alignSelf: 'center' }}>
               {page} / {totalPages}
             </span>
             <button className="btn sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Sau</button>
           </div>
         </div>

         <aside className="order-detail">
           {!selected && (
             <div className="no-selection">Chọn một đơn để xem chi tiết</div>
           )}
           {selected && (
             <div className="detail-body">
               <div className="order-title">{`#${selected.id.slice(0,6)}`} · {viOrderStatus(selected.status)}</div>
               <div className="detail-item"><b>Ngày:</b> {getOrderDate(selected).toLocaleString('vi-VN')}</div>
               <div className="detail-item"><b>Thanh toán:</b> {viPaymentMethod(selected.paymentMethod) ?? '-'} ({viPaymentStatus(selected.paymentStatus) ?? '-'})</div>
               <div className="detail-item"><b>Giảm giá:</b> {selected.discountCode || '-'}</div>
               <div className="detail-item"><b>Tổng giá:</b> {(selected.totalPrice || 0).toLocaleString('vi-VN')} VND</div>
               <div className="detail-item"><b>Tổng thanh toán:</b> {(selected.finalPrice || selected.totalPrice || 0).toLocaleString('vi-VN')} VND</div>
               
               {/* Delivery Information */}
               {(selected.address || selected.deliveryTo || selected.phoneNumber || selected.allergyNote || selected.preferenceNote) && (
                 <div className="delivery-section">
                   <div className="detail-section-title">Thông tin giao hàng</div>
                   <div className="detail-item"><b>Địa chỉ:</b> {selected.address || '-'}</div>
                   <div className="detail-item"><b>Người nhận:</b> {selected.deliveryTo || '-'}</div>
                   <div className="detail-item"><b>Số điện thoại:</b> {selected.phoneNumber || '-'}</div>
                   {selected.allergyNote && (
                     <div className="detail-item"><b>Dị ứng:</b> {selected.allergyNote}</div>
                   )}
                   {selected.preferenceNote && (
                     <div className="detail-item"><b>Sở thích:</b> {selected.preferenceNote}</div>
                   )}
                 </div>
               )}
               
               {/* Payment Information */}
               {selected.payOSPaymentUrl && (
                 <div className="payment-section">
                   <div className="detail-section-title">Thông tin thanh toán</div>
                   <div className="detail-item"><b>PayOS URL:</b> <a href={selected.payOSPaymentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7cc043', textDecoration: 'underline' }}>Xem link thanh toán</a></div>
                   {selected.payOSOrderCode && (
                     <div className="detail-item"><b>PayOS Code:</b> {selected.payOSOrderCode}</div>
                   )}
                 </div>
               )}
               
               <div className="products-title">Sản phẩm</div>
               <div className="products-table">
                 <div className="products-header">
                   <div>Tên</div>
                   <div>SL</div>
                   <div>Đơn giá</div>
                 </div>
                 {(selected.details || []).map((d, idx) => {
                  const hasExtraInfo = d.vegetables?.length > 0 || d.greetingMessage || d.boxDescription || d.letterScription || d.giftBoxOrderId
                  const isExpanded = expandedDetails[idx]
                  
                  return (
                    <React.Fragment key={idx}>
                      <div className="products-row">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <div>{boxNameById(d.boxTypeId)}</div>
                          {hasExtraInfo && (
                            <button
                              onClick={() => setExpandedDetails(prev => ({ ...prev, [idx]: !prev[idx] }))}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                color: '#7cc043',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {isExpanded ? '▲ Thu gọn' : '▼ Chi tiết'}
                            </button>
                          )}
                        </div>
                        <div>{d.quantity}</div>
                        <div>{(d.unitPrice||0).toLocaleString('vi-VN')} VND</div>
                      </div>
                      {isExpanded && hasExtraInfo && (
                        <div style={{ paddingLeft: '20px', paddingTop: '4px', paddingBottom: '4px', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                          {d.vegetables && d.vegetables.length > 0 && (
                            <div className="detail-item" style={{ marginTop: '2px' }}>
                              <b>Nguyên liệu:</b> {d.vegetables.join(', ')}
                            </div>
                          )}
                          {d.greetingMessage && (
                            <div className="detail-item" style={{ marginTop: '2px' }}>
                              <b>Lời chúc:</b> {d.greetingMessage}
                            </div>
                          )}
                          {d.boxDescription && (
                            <div className="detail-item" style={{ marginTop: '2px' }}>
                              <b>Chi tiết hộp:</b> {d.boxDescription}
                            </div>
                          )}
                          {d.letterScription && (
                            <div className="detail-item" style={{ marginTop: '2px' }}>
                              <b>Chi tiết thư:</b> {d.letterScription}
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
               </div>
               {selected.status !== 'Completed' && selected.status !== 'Cancelled' && (
                 <div className="status-update">
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
    </section>
  )
}
