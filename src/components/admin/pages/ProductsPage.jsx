import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { updateBoxType } from '../../../router/adminApi'
import '../styles/admin.css'
import '../styles/products.css'

export default function ProductsPage() {
  const context = useOutletContext() || {}
  const { boxTypes: contextBoxTypes = [] } = context
  
  const [boxTypes] = useState(contextBoxTypes)
  const [selectedBox, setSelectedBox] = useState(null)
  const [expandedBoxes, setExpandedBoxes] = useState(new Set())
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Organize boxTypes by hierarchy
  const boxTypesByParent = React.useMemo(() => {
    const allBoxes = new Map()
    const parents = []
    
    // Build map of all boxes
    boxTypes.forEach(box => {
      allBoxes.set(box.id, box)
    })
    
    // Identify root parents and organize hierarchy
    boxTypes.forEach(box => {
      if (box.parentID === "00000000-0000-0000-0000-000000000000") {
        parents.push(box)
      }
    })
    
    // Get all children (direct and nested) for a parent
    const getChildren = (parentId) => {
      const children = boxTypes.filter(box => box.parentID === parentId)
      return children.map(child => ({
        ...child,
        children: getChildren(child.id)
      }))
    }
    
    const parentsWithChildren = parents.map(parent => ({
      ...parent,
      children: getChildren(parent.id)
    }))
    
    return parentsWithChildren
  }, [boxTypes])

  const handleBoxClick = (box) => {
    setSelectedBox(box)
    // Exit edit mode if clicking a different box
    if (isEditing && editData) {
      setIsEditing(false)
      setEditData(null)
    }
  }

  const handleExpandToggle = (boxId, e) => {
    e.stopPropagation()
    setExpandedBoxes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(boxId)) {
        newSet.delete(boxId)
      } else {
        newSet.add(boxId)
      }
      return newSet
    })
  }

  // Get parent name from parentID
  const getParentName = (parentID) => {
    if (parentID === "00000000-0000-0000-0000-000000000000") {
      return "Root"
    }
    const parent = boxTypes.find(b => b.id === parentID)
    return parent ? parent.name : parentID
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      name: selectedBox.name,
      description: selectedBox.description,
      price: selectedBox.price,
      parentID: selectedBox.parentID
    })
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData(null)
  }

  const handleUpdateBox = async () => {
    if (!selectedBox || !editData) return

    setIsUpdating(true)
    try {
      await updateBoxType(selectedBox.id, editData)
      setIsEditing(false)
      setEditData(null)
      // Trigger refresh
      window.dispatchEvent(new CustomEvent('box-types-updated'))
      alert('Cập nhật thành công!')
    } catch (error) {
      console.error('Failed to update box type:', error)
      alert('Cập nhật thất bại!')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="products-page">
      <div className="products-page-header">
        <div className="chart-title">Danh sách sản phẩm</div>
      </div>
      
      <div className="products-content">
        <div className="products-list">
          {boxTypesByParent.map(parentBox => {
            const renderBox = (box, level = 0) => {
              const isParent = box.children && box.children.length > 0
              const isExpanded = expandedBoxes.has(box.id)
              
              return (
                <div key={box.id}>
                  <div 
                    className={`${level === 0 ? 'box-parent' : 'box-child'} ${selectedBox?.id === box.id ? 'active' : ''}`}
                    onClick={() => handleBoxClick(box)}
                  >
                    <div className="box-header">
                      {isParent && (
                        <button
                          className="expand-btn"
                          onClick={(e) => handleExpandToggle(box.id, e)}
                        >
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      )}
                      <div className="box-info">
                        <div className="box-name">{box.name}</div>
                        <div className="box-description">{box.description}</div>
                        <div className="box-price">
                          {box.price === 0 ? 'Custom' : `${box.price.toLocaleString('vi-VN')} VND`}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isParent && isExpanded && (
                    <div className="children-container">
                      {box.children.map(child => renderBox(child, level + 1))}
                    </div>
                  )}
                </div>
              )
            }
            
            return (
              <div key={parentBox.id} className="box-category">
                {renderBox(parentBox)}
              </div>
            )
          })}
        </div>

        <div className="products-detail">
          {selectedBox ? (
            <div className="detail-card">
              <div className="detail-header">
                <h3>Chi tiết sản phẩm</h3>
                {!isEditing && <button className="btn sm primary" onClick={handleEdit}>Chỉnh sửa</button>}
              </div>
              <div className="detail-body">
                <div className="detail-item">
                  <label>ID:</label>
                  <div>{selectedBox.id}</div>
                </div>
                <div className="detail-item">
                  <label>Tên:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="detail-input"
                    />
                  ) : (
                    <div>{selectedBox.name}</div>
                  )}
                </div>
                <div className="detail-item">
                  <label>Mô tả:</label>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="detail-textarea"
                      rows={3}
                    />
                  ) : (
                    <div>{selectedBox.description}</div>
                  )}
                </div>
                <div className="detail-item">
                  <label>Giá:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                      className="detail-input"
                    />
                  ) : (
                    <div>{selectedBox.price === 0 ? 'Custom' : `${selectedBox.price.toLocaleString('vi-VN')} VND`}</div>
                  )}
                </div>
                <div className="detail-item">
                  <label>Sản phẩm cha:</label>
                  {isEditing ? (
                    <select
                      value={editData.parentID}
                      onChange={(e) => setEditData({ ...editData, parentID: e.target.value })}
                      className="detail-select"
                    >
                      <option value="00000000-0000-0000-0000-000000000000">Root</option>
                      {boxTypes.map(box => (
                        <option key={box.id} value={box.id}>{box.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div>{getParentName(selectedBox.parentID)}</div>
                  )}
                </div>
                {isEditing && (
                  <div className="detail-actions">
                    <button className="btn sm primary" onClick={handleUpdateBox} disabled={isUpdating}>
                      {isUpdating ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button className="btn sm" onClick={handleCancelEdit} disabled={isUpdating}>
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="detail-card">
              <div className="detail-empty">Chọn một sản phẩm để xem chi tiết</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
