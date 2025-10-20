import React, { useEffect, useMemo, useState } from 'react'
import { createDiscount, deleteDiscount, getDiscounts, updateDiscount } from '../../../router/adminApi'
import '../styles/discounts.css'

function toDateInputValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function toISODate(dateInput) {
    if (!dateInput) return new Date().toISOString();
  
    const [y, m, d] = dateInput.split('-').map(Number);
    const local = new Date(y, m - 1, d, 0, 0, 0);
  
    const corrected = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  
    return corrected.toISOString();
  }

export default function DiscountsPage(){
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const selected = useMemo(() => items.find(x => x.id === selectedId) || null, [items, selectedId])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5
  const [newCustomersOnly, setNewCustomersOnly] = useState(false)

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountValue: 0,
    isPercentage: true,
    startDate: '',
    endDate: '',
    isActive: true,
  })

  useEffect(() => {
    let ignore = false
    setLoading(true)
    getDiscounts().then((data) => {
      if (!ignore) setItems(data)
    }).finally(() => {
      if (!ignore) setLoading(false)
    })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (!selected) return
    setForm({
      code: selected.code || '',
      description: selected.description || '',
      discountValue: selected.discountValue || 0,
      isPercentage: !!selected.isPercentage,
      startDate: toDateInputValue(selected.startDate),
      endDate: toDateInputValue(selected.endDate),
      isActive: selected.isActive ?? true,
    })
  }, [selected])

  function handleNew(){
    setSelectedId(null)
    setForm({ code: '', description: '', discountValue: 0, isPercentage: true, startDate: '', endDate: '', isActive: true })
  }

  async function handleSave(){
    const payload = {
      code: form.code.trim(),
      description: form.description.trim(),
      discountValue: Number(form.discountValue) || 0,
      isPercentage: !!form.isPercentage,
      startDate: toISODate(form.startDate),
      endDate: toISODate(form.endDate),
      isActive: !!form.isActive,
    }

    const ok = selectedId
      ? await updateDiscount(selectedId, payload)
      : await createDiscount(payload)

    if (!ok) {
      alert('Lưu thất bại')
      return
    }
    const refreshed = await getDiscounts()
    setItems(refreshed)
    if (!selectedId) {
      const created = refreshed.find(x => x.code === payload.code)
      setSelectedId(created?.id ?? null)
    }
  }

  async function handleDelete(id){
    if (!id) return
    if (!confirm('Xóa mã giảm giá này?')) return
    const ok = await deleteDiscount(id)
    if (!ok) {
      alert('Xóa thất bại')
      return
    }
    const refreshed = await getDiscounts()
    setItems(refreshed)
    setSelectedId(null)
    handleNew()
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="board discounts-page">
      <div>
        <div className="discounts-header">
          <div className="chart-title discounts-title">Danh sách các mã giảm giá</div>
          <button className="btn primary discounts-create" onClick={handleNew}>+ Tạo mã giảm giá</button>
        </div>
        <div className="table discounts-table">
          <div className="row header discount-row">
            <div>Mã</div>
            <div>Tên chương trình</div>
            <div>Loại</div>
            <div>Giá trị</div>
            <div>Trạng thái</div>
          </div>
          {loading && <div className="row"><div>Đang tải...</div></div>}
          {!loading && pageItems.map((d) => (
            <div
              key={d.id}
              className={`row discount-row ${selectedId === d.id ? 'active' : ''}`}
              onClick={() => setSelectedId(d.id)}
            >
              <div>{d.code}</div>
              <div>{d.description}</div>
              <div>{d.isPercentage ? 'Theo %' : 'Số tiền'}</div>
              <div>{d.isPercentage ? `${d.discountValue}%` : `${Number(d.discountValue||0).toLocaleString('vi-VN')} VND`}</div>
              <div>{d.isActive ? 'Đang hoạt động' : 'Ngừng'}</div>
            </div>
          ))}
          {!loading && (
            <div className="discounts-pagination">
              <button className="btn sm" onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}>«</button>
              {Array.from({ length: totalPages }, (_,i)=>i+1).map(p => (
                <button key={p} className={`btn sm ${p===currentPage?'primary':''}`} onClick={()=>setCurrentPage(p)}>{p}</button>
              ))}
              <button className="btn sm" onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}>»</button>
            </div>
          )}
        </div>
      </div>

      <div className="panel-card discounts-editor">
        <div className="discounts-editor-header">
          <div className="discounts-editor-title">{selected ? selected.code : 'Mới'}</div>
          <button className="btn sm primary" onClick={handleSave}>Lưu</button>
        </div>

        <div className="discounts-section">
          <div className="discounts-section-title">Thông tin</div>
          <div className="discounts-fields-grid">
            <div className="discounts-field">
              <label className="discounts-label">Tên chương trình</label>
              <input value={form.description} onChange={e=>setForm(f=>({ ...f, description: e.target.value }))} />
            </div>
            <div className="discounts-field">
              <label className="discounts-label">Loại giảm giá</label>
              <select value={form.isPercentage ? 'percent' : 'amount'} onChange={e=>setForm(f=>({ ...f, isPercentage: e.target.value === 'percent' }))}>
                <option value="percent">Theo %</option>
                <option value="amount">Số tiền</option>
              </select>
            </div>
            <div className="discounts-field">
              <label className="discounts-label">Mã khuyến mãi</label>
              <input value={form.code} onChange={e=>setForm(f=>({ ...f, code: e.target.value.toUpperCase() }))} />
            </div>
            <div className="discounts-field">
              <label className="discounts-label">Giá trị giảm</label>
              <input type="number" value={form.discountValue} onChange={e=>setForm(f=>({ ...f, discountValue: e.target.value }))} />
            </div>
            <div className="discounts-field">
              <label className="discounts-label">Loại đơn</label>
              <select value={'single'} onChange={()=>{}}>
                <option value="single">Đơn lẻ</option>
                <option value="group">Đơn nhóm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="discounts-divider" />

        <div className="discounts-section">
          <div className="discounts-section-title">Thời gian áp dụng</div>
          <div className="discounts-dates-grid">
            <div className="discounts-field">
              <label className="discounts-label">Ngày bắt đầu</label>
              <input type="date" value={form.startDate} onChange={e=>setForm(f=>({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="discounts-field">
              <label className="discounts-label">Ngày kết thúc</label>
              <input type="date" value={form.endDate} onChange={e=>setForm(f=>({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
        </div>
{/* 
        <div className="discounts-divider" />

        <div className="discounts-section">
          <div className="discounts-section-title">Trạng thái đơn hàng</div>
          <select value={form.isActive ? 'true' : 'false'} onChange={e=>setForm(f=>({ ...f, isActive: e.target.value === 'true' }))}>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="discounts-actions">
          {selected && <button className="btn sm hidden" onClick={()=>handleDelete(selected.id)}>Xóa</button>}
        </div> */}
      </div>
    </div>
  )
}


