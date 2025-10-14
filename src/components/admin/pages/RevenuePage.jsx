import React from 'react'
import { useOutletContext } from 'react-router-dom'
import DashboardSection from '../sections/DashboardSection'

export default function RevenuePage(){
  const { orders = [], boxTypes = [] } = useOutletContext() || {}
  // Tái sử dụng phần Tổng doanh thu trong Dashboard
  return <DashboardSection orders={orders} boxTypes={boxTypes} />
}


