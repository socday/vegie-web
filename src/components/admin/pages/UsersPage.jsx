import React, { useEffect, useMemo, useState } from 'react'
import { getUsers, getAllOrders, getUser } from '../../../router/adminApi'
import { getOrderById } from '../../../router/orderApi'
import '../styles/users.css'

function getStatusText(status) {
  const statusMap = {
    'Pending': 'Đang chờ',
    'Confirmed': 'Đã xác nhận',
    'Processing': 'Đang xử lý',
    'Shipping': 'Đang giao',
    'Delivered': 'Đã giao',
    'Cancelled': 'Đã hủy',
    'Returned': 'Đã trả',
    'Completed': 'Hoàn thành',
    'Cart': 'Giỏ hàng'
  }
  return statusMap[status] || status
}

function getPaymentStatusText(paymentStatus) {
  const paymentMap = {
    'Pending': 'Chờ thanh toán',
    'Paid': 'Đã thanh toán',
    'Failed': 'Thanh toán thất bại',
    'Refunded': 'Đã hoàn tiền'
  }
  return paymentMap[paymentStatus] || paymentStatus
}

function getPaymentMethodText(method) {
  const methodMap = {
    'Cash': 'Tiền mặt',
    'Card': 'Thẻ',
    'Transfer': 'Chuyển khoản',
    'PayOS': 'PayOS',
    'CashOnDelivery': 'Thanh toán khi nhận hàng'
  }
  return methodMap[method] || method
}

function getOrderDate(order) {
  if (order.orderDate) {
    return new Date(order.orderDate)
  }
  return new Date()
}

export default function UsersPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailedUser, setDetailedUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)
  const [orderCurrentPage, setOrderCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [expandedDetails, setExpandedDetails] = useState({})
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false)
  const pageSize = 11
  const orderPageSize = 10

  const selectedUser = useMemo(() => users.find(x => x.id === selectedUserId) || null, [users, selectedUserId])

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize))
  const pageItems = users.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const orderTotalPages = Math.max(1, Math.ceil(userOrders.length / orderPageSize))
  const orderPageItems = userOrders.slice((orderCurrentPage - 1) * orderPageSize, orderCurrentPage * orderPageSize)

  const handleOrderClick = async (order) => {
    setShowOrderDetail(true)
    setLoadingOrderDetail(true)
    setExpandedDetails({})
    
    try {
      const response = await getOrderById(order.id)
      if (response.isSuccess && response.data) {
        setSelectedOrder(response.data)
      } else {
        console.error('Failed to load order details:', response.message)
        setSelectedOrder(order) // Fallback to basic order data
      }
    } catch (error) {
      console.error('Error loading order details:', error)
      setSelectedOrder(order) // Fallback to basic order data
    } finally {
      setLoadingOrderDetail(false)
    }
  }

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false)
    setSelectedOrder(null)
    setExpandedDetails({})
    setLoadingOrderDetail(false)
  }

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    getUsers()
      .then((data) => {
        if (!ignore) setUsers(data)
      })
      .catch((error) => {
        if (!ignore) {
          console.error('Error loading users:', error)
          setError('Không thể tải danh sách người dùng')
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => { ignore = true }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUserId(null)
    setUserOrders([])
    setDetailedUser(null)
    setOrderCurrentPage(1)
    setSelectedOrder(null)
    setShowOrderDetail(false)
    setExpandedDetails({})
    setLoadingOrderDetail(false)
  }

  const handleUserClick = (userId) => {
    setSelectedUserId(userId)
    setShowModal(true)
    setOrderCurrentPage(1)
    
    setLoadingOrders(true)
    setLoadingDetails(true)
    
    Promise.all([
      getAllOrders()
        .then((orders) => {
          const userOrders = orders.filter(o => o.userId === userId)
          setUserOrders(userOrders)
        })
        .catch((error) => {
          console.error('Error loading orders:', error)
          setUserOrders([])
        }),
      getUser(userId)
        .then((user) => {
          if (user) setDetailedUser(user)
        })
        .catch((error) => {
          console.error('Error loading user details:', error)
          setDetailedUser(null)
        })
    ]).finally(() => {
      setLoadingOrders(false)
      setLoadingDetails(false)
    })
  }

  return (
    <div className="users-page">
      <div className="users-header-section">
        <div className="chart-title users-title">Danh sách người dùng</div>
      </div>
      
      <div className="users-table-section">
        <div className="users-table">
          <div className="header users-row">
            <div>Tên</div>
            <div>Email</div>
            <div>Số điện thoại</div>
            <div>Vai trò</div>
            <div>Trạng thái</div>
          </div>
          <div className="users-body">
            {loading && (
              <div className="users-row">
                <div>Đang tải...</div>
              </div>
            )}
            {error && (
              <div className="users-row">
                <div style={{ color: '#dc3545' }}>{error}</div>
              </div>
            )}
            {!loading && !error && pageItems.map((user) => (
              <div
                key={user.id}
                className={`users-row ${selectedUserId === user.id ? 'active' : ''}`}
                onClick={() => handleUserClick(user.id)}
              >
                <div>{user.fullName}</div>
                <div>{user.email}</div>
                <div>{user.phoneNumber || '-'}</div>
                <div>{user.roles.join(', ')}</div>
                <div>{user.isLockedOut ? 'Bị khóa' : 'Hoạt động'}</div>
              </div>
            ))}
          </div>
          {!loading && !error && (
            <div className="users-pagination">
              <button 
                className="btn sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`btn sm ${p === currentPage ? 'primary' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button 
                className="btn sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="users-editor modal-content">
            <div className="users-editor-header">
              <div className="users-editor-title">
                {selectedUser ? selectedUser.fullName : 'Chọn người dùng'}
              </div>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            {selectedUser && (
              <div className="users-editor-body">
                <div className="users-section">
                  <div className="users-section-title">Thông tin người dùng</div>
                  {loadingDetails ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>
                  ) : detailedUser ? (
                    <div className="users-fields-grid">
                      <div className="users-field">
                        <label className="users-label">ID</label>
                        <div className="users-value">{detailedUser.id}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Họ</label>
                        <div className="users-value">{detailedUser.firstName}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Tên</label>
                        <div className="users-value">{detailedUser.lastName}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Email</label>
                        <div className="users-value">{detailedUser.email}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Số điện thoại</label>
                        <div className="users-value">{detailedUser.phoneNumbers || '-'}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Giới tính</label>
                        <div className="users-value">{detailedUser.gender || '-'}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Vai trò</label>
                        <div className="users-value">{detailedUser.roles.join(', ')}</div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Trạng thái</label>
                        <div className="users-value">
                          {detailedUser.isLockedOut ? 'Bị khóa' : 'Hoạt động'}
                        </div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Ngày tạo</label>
                        <div className="users-value">
                          {new Date(detailedUser.createAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className="users-field">
                        <label className="users-label">Ngày cập nhật</label>
                        <div className="users-value">
                          {new Date(detailedUser.updateAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      {detailedUser.lockoutEnd && (
                        <div className="users-field">
                          <label className="users-label">Ngày mở khóa</label>
                          <div className="users-value">
                            {new Date(detailedUser.lockoutEnd).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545' }}>
                      Không thể tải thông tin người dùng
                    </div>
                  )}
                </div>

                <div className="users-divider" />

                <div className="users-section orders-section">
                  <div className="users-section-title">Đơn hàng của khách hàng</div>
                  <div className="users-orders-table">
                    <div className="row header">
                      <div>Ngày đặt</div>
                      <div>Tổng tiền</div>
                      <div>Trạng thái</div>
                      <div>Thanh toán</div>
                    </div>
                    <div className="users-orders-table-body">
                      {loadingOrders && (
                        <div className="row">
                          <div>Đang tải...</div>
                        </div>
                      )}
                      {!loadingOrders && userOrders.length === 0 && (
                        <div className="row">
                          <div>Không có đơn hàng</div>
                        </div>
                      )}
                      {!loadingOrders && orderPageItems.map((order) => (
                        <div 
                          key={order.id} 
                          className="row"
                          onClick={() => handleOrderClick(order)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                          <div>{order.finalPrice.toLocaleString('vi-VN')} VND</div>
                          <div>{getStatusText(order.status)}</div>
                          <div>{getPaymentStatusText(order.paymentStatus)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {!loadingOrders && userOrders.length > 0 && (
                    <div className="users-pagination" style={{ marginTop: '12px' }}>
                      <button 
                        className="btn sm" 
                        onClick={() => setOrderCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={orderCurrentPage === 1}
                      >
                        «
                      </button>
                      {Array.from({ length: orderTotalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          className={`btn sm ${p === orderCurrentPage ? 'primary' : ''}`}
                          onClick={() => setOrderCurrentPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                      <button 
                        className="btn sm" 
                        onClick={() => setOrderCurrentPage(p => Math.min(orderTotalPages, p + 1))} 
                        disabled={orderCurrentPage === orderTotalPages}
                      >
                        »
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* {showOrderDetail && (
        <>
          <div className="modal-overlay" onClick={handleCloseOrderDetail} style={{ zIndex: 1100 }}></div>
          <div className="order-detail-modal modal-content" style={{ zIndex: 1101, width: '600px', left: 'auto', right: '5%' }}>
            <div className="users-editor-header">
              <div className="users-editor-title">
                {loadingOrderDetail ? 'Đang tải...' : `Chi tiết đơn hàng ${selectedOrder ? '#' + selectedOrder.id.slice(0,6) : ''}`}
              </div>
              <button className="modal-close" onClick={handleCloseOrderDetail}>×</button>
            </div>
            {loadingOrderDetail ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div>Đang tải chi tiết đơn hàng...</div>
              </div>
            ) : selectedOrder ? (
              <div className="detail-body" style={{ padding: '16px' }}>
                <div className="order-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#2d3a4a' }}>
                #{selectedOrder.id.slice(0,6)} · {getStatusText(selectedOrder.status)}
                </div>
                <div className="detail-item" style={{ marginBottom: '8px', fontSize: '14px' }}>
                <b>Ngày:</b> {getOrderDate(selectedOrder).toLocaleString('vi-VN')}
                </div>
                <div className="detail-item" style={{ marginBottom: '8px', fontSize: '14px' }}>
                <b>Thanh toán:</b> {getPaymentMethodText(selectedOrder.paymentMethod) || '-'} ({getPaymentStatusText(selectedOrder.paymentStatus) || '-'})
                </div>
                <div className="detail-item" style={{ marginBottom: '8px', fontSize: '14px' }}>
                <b>Giảm giá:</b> {selectedOrder.discountCode || '-'}
                </div>
                <div className="detail-item" style={{ marginBottom: '8px', fontSize: '14px' }}>
                <b>Tổng giá:</b> {(selectedOrder.totalPrice || 0).toLocaleString('vi-VN')} VND
                </div>
                <div className="detail-item" style={{ marginBottom: '16px', fontSize: '14px' }}>
                  <b>Tổng thanh toán:</b> {(selectedOrder.finalPrice || selectedOrder.totalPrice || 0).toLocaleString('vi-VN')} VND
                </div>

                {(selectedOrder.address || selectedOrder.deliveryTo || selectedOrder.phoneNumber || selectedOrder.allergyNote || selectedOrder.preferenceNote) && (
                <div className="delivery-section" style={{ marginBottom: '16px' }}>
                  <div className="detail-section-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2d3a4a' }}>
                    Thông tin giao hàng
                  </div>
                  <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <b>Địa chỉ:</b> {selectedOrder.address || '-'}
                  </div>
                  <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <b>Người nhận:</b> {selectedOrder.deliveryTo || '-'}
                  </div>
                  <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <b>Số điện thoại:</b> {selectedOrder.phoneNumber || '-'}
                  </div>
                  {selectedOrder.allergyNote && (
                    <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                      <b>Dị ứng:</b> {selectedOrder.allergyNote}
                    </div>
                  )}
                  {selectedOrder.preferenceNote && (
                    <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                      <b>Sở thích:</b> {selectedOrder.preferenceNote}
                    </div>
                  )}
                </div>
                )}
                {selectedOrder.payOSPaymentUrl && (
                <div className="payment-section" style={{ marginBottom: '16px' }}>
                  <div className="detail-section-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#2d3a4a' }}>
                    Thông tin thanh toán
                  </div>
                  <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <b>PayOS URL:</b> <a href={selectedOrder.payOSPaymentUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7cc043', textDecoration: 'underline' }}>Xem link thanh toán</a>
                  </div>
                  {selectedOrder.payOSOrderCode && (
                    <div className="detail-item" style={{ marginBottom: '6px', fontSize: '14px' }}>
                      <b>PayOS Code:</b> {selectedOrder.payOSOrderCode}
                    </div>
                  )}
                </div>
                )}
                <div className="products-title" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', marginTop: '16px', color: '#2d3a4a' }}>
                Sản phẩm
                </div>
                <div className="products-table" style={{ border: '1px solid #cde5ff', borderRadius: '8px', overflow: 'hidden' }}>
                <div className="products-header" style={{ display: 'flex', padding: '8px 12px', background: '#e9f5ff', fontWeight: '600', fontSize: '14px', borderBottom: '1px solid #cde5ff' }}>
                  <div style={{ flex: 2 }}>Tên</div>
                  <div style={{ flex: 0.5 }}>SL</div>
                  <div style={{ flex: 1 }}>Đơn giá</div>
                </div>
                {(selectedOrder.details || []).map((d, idx) => {
                  const hasExtraInfo = d.vegetables?.length > 0 || d.greetingMessage || d.boxDescription || d.letterScription || d.giftBoxOrderId
                  const isExpanded = expandedDetails[idx]
                  
                  return (
                    <React.Fragment key={idx}>
                      <div className="products-row" style={{ display: 'flex', padding: '8px 12px', fontSize: '14px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ flex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>{d.boxTypeName || `Box #${d.boxTypeId}`}</div>
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
                        <div style={{ flex: 0.5 }}>{d.quantity}</div>
                        <div style={{ flex: 1 }}>{(d.unitPrice||0).toLocaleString('vi-VN')} VND</div>
                      </div>
                      {isExpanded && hasExtraInfo && (
                        <div style={{ padding: '8px 12px 8px 32px', fontSize: '13px', borderBottom: '1px solid #f0f0f0', background: '#f9f9f9' }}>
                          {d.vegetables && d.vegetables.length > 0 && (
                            <div style={{ marginBottom: '4px' }}>
                              <b>Nguyên liệu:</b> {d.vegetables.join(', ')}
                            </div>
                          )}
                          {d.greetingMessage && (
                            <div style={{ marginBottom: '4px' }}>
                              <b>Lời chúc:</b> {d.greetingMessage}
                            </div>
                          )}
                          {d.boxDescription && (
                            <div style={{ marginBottom: '4px' }}>
                              <b>Chi tiết hộp:</b> {d.boxDescription}
                            </div>
                          )}
                          {d.letterScription && (
                            <div style={{ marginBottom: '4px' }}>
                              <b>Chi tiết thư:</b> {d.letterScription}
                            </div>
                          )}
                          {d.giftBoxOrderId && (
                            <div style={{ marginBottom: '4px' }}>
                              <b>Gift Box Order ID:</b> {d.giftBoxOrderId}
                            </div>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  )
                })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
                Không thể tải thông tin đơn hàng
              </div>
            )}
          </div>
        </>
      )}  */}
    </div>
  )
}