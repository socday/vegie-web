import React, { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getOrderById as getOrderByIdAdmin } from '../../../router/adminApi'

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

export default function OrderDetailModal({ order, isOpen, onClose }) {
  const context = useOutletContext() || {}
  const { boxTypes: contextBoxTypes = [] } = context
  
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [expandedDetails, setExpandedDetails] = useState({})
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false)
  
  // Create boxNameById function
  const boxNameById = useMemo(() => {
    const map = new Map()
    contextBoxTypes.forEach((b) => map.set(b.id, b.name))
    return (id) => map.get(id) || 'Unknown'
  }, [contextBoxTypes])

  React.useEffect(() => {
    if (isOpen && order) {
      setLoadingOrderDetail(true)
      setExpandedDetails({})
      
      getOrderByIdAdmin(order.id)
        .then((response) => {
          if (response.isSuccess && response.data) {
            // Use only data from API /Orders/${id}
            setSelectedOrder(response.data)
          } else {
            console.error('Failed to load order details:', response.message)
            setSelectedOrder(null)
          }
        })
        .catch((error) => {
          console.error('Error loading order details:', error)
          setSelectedOrder(null)
        })
        .finally(() => {
          setLoadingOrderDetail(false)
        })
    } else {
      setSelectedOrder(null)
      setExpandedDetails({})
    }
  }, [isOpen, order])

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}></div>
      <div className="order-detail-modal modal-content" style={{ zIndex: 1101, width: '600px', left: 'auto', right: '5%' }}>
        <div className="users-editor-header">
          <div className="users-editor-title">
            {loadingOrderDetail ? 'Đang tải...' : `Chi tiết đơn hàng ${selectedOrder ? '#' + selectedOrder.id.slice(0,6) : ''}`}
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {loadingOrderDetail ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div>Đang tải chi tiết đơn hàng...</div>
          </div>
        ) : selectedOrder ? (
          <div className="detail-body">
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
            <div className="products-table">
              <div className="products-header">
                <div>Tên</div>
                <div>SL</div>
                <div>Đơn giá</div>
              </div>
              {(selectedOrder.details || []).map((d, idx) => {
                // Use same logic as OrdersBoard
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
                      <div className="products-expanded-row">
                        <div style={{ paddingLeft: '20px', paddingTop: '4px', paddingBottom: '4px' }}>
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
                          {d.giftBoxOrderId && (
                            <div className="detail-item" style={{ marginTop: '2px' }}>
                              <b>Gift Box Order ID:</b> {d.giftBoxOrderId}
                            </div>
                          )}
                        </div>
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
  )
}

