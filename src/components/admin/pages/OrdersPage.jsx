import React from 'react'
import { useOutletContext } from 'react-router-dom'
import OrdersBoard from '../sections/OrdersBoard'

export default function OrdersPage(){
  const context = useOutletContext() || {}
  const { orders = [], boxTypes = [], users = [] } = context
  
  // Create boxNameById function
  const boxNameById = (id) => {
    const box = boxTypes.find(b => b.id === id)
    return box?.name || 'Unknown'
  }
  
  return (
    <OrdersBoard 
      orders={orders}
      users={users}
      boxNameById={boxNameById}
      onRefresh={async () => {
        // Trigger loadData in AdminShell to refresh all context data
        window.dispatchEvent(new CustomEvent('orders-updated'))
      }}
    />
  )
}


