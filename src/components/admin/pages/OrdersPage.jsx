import React from 'react'
import { useOutletContext } from 'react-router-dom'
import PlaceholderSection from '../sections/PlaceholderSection'

export default function OrdersPage(){
  const { orders = [] } = useOutletContext() || {}
  return (
    <PlaceholderSection title="Đơn hàng">
      Dùng lại dữ liệu đã tải: {orders.length} đơn hàng.
    </PlaceholderSection>
  )
}


