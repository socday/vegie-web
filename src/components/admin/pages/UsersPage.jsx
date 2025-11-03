import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getUsers, getAllOrders, getUser } from '../../../router/adminApi'
import OrderDetailModal from '../sections/OrderDetailModal'
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

export default function UsersPage() {
  const context = useOutletContext() || {}
  const { boxTypes: contextBoxTypes = [] } = context
  
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
  const [searchQuery, setSearchQuery] = useState('')
  const pageSize = 11
  const orderPageSize = 11

  const selectedUser = useMemo(() => users.find(x => x.id === selectedUserId) || null, [users, selectedUserId])
  
  // Create boxNameById function
  const boxNameById = useMemo(() => {
    const map = new Map()
    contextBoxTypes.forEach((b) => map.set(b.id, b.name))
    return (id) => map.get(id) || 'Unknown'
  }, [contextBoxTypes])

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users
    }
    const query = searchQuery.toLowerCase().trim()
    return users.filter(user => {
      const fullName = (user.fullName || '').toLowerCase()
      const email = (user.email || '').toLowerCase()
      const phoneNumber = (user.phoneNumber || '').toLowerCase()
      return fullName.includes(query) || 
             email.includes(query) || 
             phoneNumber.includes(query)
    })
  }, [users, searchQuery])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const pageItems = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const orderTotalPages = Math.max(1, Math.ceil(userOrders.length / orderPageSize))
  const orderPageItems = userOrders.slice((orderCurrentPage - 1) * orderPageSize, orderCurrentPage * orderPageSize)

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false)
    setSelectedOrder(null)
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
        <div style={{ marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: '10px 16px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#7cc043'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>
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
            {!loading && !error && filteredUsers.length === 0 && searchQuery && (
              <div className="users-row">
                <div style={{ width: '100%', textAlign: 'center', padding: '20px', color: '#666' }}>
                  Không tìm thấy người dùng nào phù hợp với "{searchQuery}"
                </div>
              </div>
            )}
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
                      <div>ID</div>
                      <div>Box</div>
                      <div>Số lượng</div>
                      <div>Ngày đặt</div>
                      <div>Tổng tiền</div>
                      <div>Trạng thái</div>
                      <div>Thanh toán</div>
                    </div>
                    <div className="users-orders-table-body">
                      {loadingOrders && (
                        <div className="row">
                          <div style={{ width: '100%', textAlign: 'center' }}>Đang tải...</div>
                        </div>
                      )}
                      {!loadingOrders && userOrders.length === 0 && (
                        <div className="row">
                          <div style={{ width: '100%', textAlign: 'center' }}>Không có đơn hàng</div>
                        </div>
                      )}
                      {!loadingOrders && orderPageItems.map((order) => {
                        const qty = order.details?.reduce((s, d) => s + d.quantity, 0) || 0
                        const boxNames = order.details?.map((d) => boxNameById(d.boxTypeId)).join(', ') || '-'
                        return (
                          <div 
                            key={order.id} 
                            className="row"
                            onClick={() => handleOrderClick(order)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div>#{order.id.slice(0, 6)}</div>
                            <div>{boxNames}</div>
                            <div className="quantity-cell">{qty}</div>
                            <div>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                            <div>{order.finalPrice.toLocaleString('vi-VN')} VND</div>
                            <div>{getStatusText(order.status)}</div>
                            <div>{getPaymentStatusText(order.paymentStatus)}</div>
                          </div>
                        )
                      })}
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

      <OrderDetailModal
        order={selectedOrder}
        isOpen={showOrderDetail}
        onClose={handleCloseOrderDetail}
      />
    </div>
  )
}