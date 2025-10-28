import React, { useEffect, useMemo, useState } from 'react'
import { getUsers, getAllOrders, getUser } from '../../../router/adminApi'
import '../styles/users.css'

function getStatusText(status) {
  const statusMap = {
    'Pending': 'Đang chờ',
    'Confirmed': 'Đã xác nhận',
    'Processing': 'Đang xử lý',
    'Shipping': 'Đang giao',
    'Delivered': 'Đã giao',
    'Cancelled': 'Đã hủy',
    'Returned': 'Đã trả'
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
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [userOrders, setUserOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailedUser, setDetailedUser] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const pageSize = 11

  const selectedUser = useMemo(() => users.find(x => x.id === selectedUserId) || null, [users, selectedUserId])

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize))
  const pageItems = users.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    getUsers().then((data) => {
      if (!ignore) setUsers(data)
    }).finally(() => {
      if (!ignore) setLoading(false)
    })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (!selectedUserId) {
      setUserOrders([])
      setDetailedUser(null)
      return
    }

    setLoadingOrders(true)
    setLoadingDetails(true)
    
    Promise.all([
      getAllOrders().then((orders) => {
        const userOrders = orders.filter(o => o.userId === selectedUserId)
        setUserOrders(userOrders)
      }),
      getUser(selectedUserId).then((user) => {
        if (user) setDetailedUser(user)
      })
    ]).finally(() => {
      setLoadingOrders(false)
      setLoadingDetails(false)
    })
  }, [selectedUserId])

  return (
    <div className="users-page">
      <div className="users-header-section">
        <div className="chart-title users-title">Danh sách người dùng</div>
      </div>
      
      <div className="users-content-grid">
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
              {loading && <div className="users-row"><div>Đang tải...</div></div>}
              {!loading && pageItems.map((user) => (
                <div
                  key={user.id}
                  className={`users-row ${selectedUserId === user.id ? 'active' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div>{user.fullName}</div>
                  <div>{user.email}</div>
                  <div>{user.phoneNumber || '-'}</div>
                  <div>{user.roles.join(', ')}</div>
                  <div>{user.isLockedOut ? 'Bị khóa' : 'Hoạt động'}</div>
                </div>
              ))}
            </div>
            {!loading && (
              <div className="users-pagination">
                <button className="btn sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`btn sm ${p === currentPage ? 'primary' : ''}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button className="btn sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
              </div>
            )}
          </div>
        </div>

        <div className="users-editor">
          <div className="users-editor-header">
            <div className="users-editor-title">{selectedUser ? selectedUser.fullName : 'Chọn người dùng'}</div>
          </div>

          {selectedUser && (
            <>
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
                    <div className="users-value">{detailedUser.lastName }</div>
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
                    <div className="users-value">{detailedUser.isLockedOut ? 'Bị khóa' : 'Hoạt động'}</div>
                  </div>
                  <div className="users-field">
                    <label className="users-label">Ngày tạo</label>
                    <div className="users-value">{new Date(detailedUser.createAt).toLocaleString('vi-VN')}</div>
                  </div>
                  <div className="users-field">
                    <label className="users-label">Ngày cập nhật</label>
                    <div className="users-value">{new Date(detailedUser.updateAt).toLocaleString('vi-VN')}</div>
                  </div>
                  {detailedUser.lockoutEnd && (
                    <div className="users-field">
                      <label className="users-label">Ngày mở khóa</label>
                      <div className="users-value">{new Date(detailedUser.lockoutEnd).toLocaleString('vi-VN')}</div>
                    </div>
                  )}
                </div>
              ) : null}
              </div>

              <div className="users-divider" />

              <div className="users-section">
              <div className="users-section-title">Đơn hàng của khách hàng</div>
              <div className="users-orders-table">
                <div className="row header">
                  <div>Ngày đặt</div>
                  <div>Tổng tiền</div>
                  <div>Trạng thái</div>
                  <div>Thanh toán</div>
                </div>
                {loadingOrders && <div className="row"><div>Đang tải...</div></div>}
                {!loadingOrders && userOrders.length === 0 && (
                  <div className="row"><div>Không có đơn hàng</div></div>
                )}
                {!loadingOrders && userOrders.map((order) => (
                  <div key={order.id} className="row">
                    <div>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</div>
                    <div>{order.finalPrice.toLocaleString('vi-VN')} VND</div>
                    <div>{getStatusText(order.status)}</div>
                    <div>{getPaymentStatusText(order.paymentStatus)}</div>
                  </div>
                ))}
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

