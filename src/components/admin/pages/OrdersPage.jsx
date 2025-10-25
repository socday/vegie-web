import React from 'react'
import { useOutletContext } from 'react-router-dom'
import OrdersBoard from '../sections/OrdersBoard'
import { getAllOrders, getAllBoxTypes, getStatistics } from '../../../router/adminApi'

export default function OrdersPage(){
  const { orders = [], boxTypes = [] } = useOutletContext() || {}
  
  // Create boxNameById function
  const boxNameById = (id) => {
    const box = boxTypes.find(b => b.id === id)
    return box?.name || 'Unknown'
  }
  
  return (
    <OrdersBoard 
      orders={orders} 
      boxNameById={boxNameById}
      onRefresh={async () => {
        try {
          // Calculate current month dates for statistics
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

          // Fetch all data
          const [ordersData, boxTypesData, currentStats, prevStats] = await Promise.all([
            getAllOrders(),
            getAllBoxTypes(),
            getStatistics(formatDate(currentMonthStart), formatDate(currentMonthEnd)),
            getStatistics(formatDate(previousMonthStart), formatDate(previousMonthEnd))
          ])
          
          // Dispatch events to update AdminShell context
          window.dispatchEvent(new CustomEvent('orders-refresh', { detail: ordersData }))
          window.dispatchEvent(new CustomEvent('box-types-refresh', { detail: boxTypesData }))
          window.dispatchEvent(new CustomEvent('stats-refresh', { 
            detail: { currentMonth: currentStats, previousMonth: prevStats } 
          }))
        } catch (error) {
          console.error('Failed to refresh data:', error)
          throw error
        }
      }}
    />
  )
}


