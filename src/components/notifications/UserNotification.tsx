import React, { useState, useEffect } from "react";
import "./styles/UserNotification.css";
import { fetchNotifications } from "../../router/notiApi";
import { Noti } from "../../router/types/notiResponse";

export default function UserNotification() {
  const [items, setItems] = useState<Noti[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchNotifications();
        if (res.isSuccess && Array.isArray(res.data.items)) {
          setItems(res.data.items);
        } else {
          console.error("Failed to load notifications:", res.message);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  
  // if (loading) return <div>Loading notifications...</div>;
  return (
    <div className="un-page">
      <div className="un-container">
        <h2>Thông báo</h2>
        {loading && <p>Loading notifications...</p>}
        {items.length === 0 ? (
          <p>Bạn không có thông báo nào cả</p>
        ) : (
          
          <ul className="un-list">
            {items.map((noti) => (
              <li key={noti.id} className={`un-item ${noti.isRead ? "read" : "unread"}`}>
                <h4 className="un-title">{noti.title}</h4>
                <p className="un-content">{noti.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
