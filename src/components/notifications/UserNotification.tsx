import React, { useState, useEffect } from "react";
import "./styles/UserNotification.css";
import { Noti } from "./types/notiResponse";
import { fetchNotifications } from "../../router/notiApi";

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

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div className="un-page">
      <div className="un-container">
        <h2>Thông báo</h2>
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

// import React, { useState, useEffect } from "react";
// import "./styles/UserNotification.css";
// import { Noti } from "./types/notiResponse";

// export default function UserNotification() {
//   const [items, setItems] = useState<Noti[]>([]);

//   useEffect(() => {
//     // Fake API simulation
//     const fakeNotifications: Noti[] = [
//       {
//         id: "1",
//         title: "Order Confirmed",
//         content: "Your order #1234 has been confirmed successfully.",
//         isRead: false,
//       },
//       {
//         id: "2",
//         title: "Shipping Update",
//         content: "Your package is on the way! Expected delivery in 2 days.",
//         isRead: true,
//       },
//       {
//         id: "3",
//         title: "New Promotion",
//         content: "50% off all items this weekend only. Don’t miss out!",
//         isRead: false,
//       },
//     ];

//     // Simulate API delay
//     setTimeout(() => setItems(fakeNotifications), 800);
//   }, []);

//   return (
//     <div className="un-page">
//       <div className="un-container">
//         <h2>Thông báo</h2>
//         {items.length === 0 ? (
//           <p>Bạn không có thông báo nào cả</p>
//         ) : (
//           <ul className="un-list">
//             {items.map((n) => (
//               <li key={n.id} className={`un-item ${n.isRead ? "read" : "unread"}`}>
//                 <h4 className="un-title">{n.title}</h4>
//                 <p className="un-content">{n.content}</p>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }