import { useEffect, useState } from "react";
import { Recipe } from "../../router/types/boxResponse";
import { blindBoxAi } from "../../router/boxApi";
import "./styles/TodayMenu.css";

export default function TodayMenu() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        setError(null);

        const response = await blindBoxAi(["carrot", "onion"]); // example vegetables
        console.log("BlindBoxAI Success:", response.isSuccess);

        console.log("BlindBoxAI Data:", response.data.at(0));
        if (response.isSuccess && response.data.length > 0) {
          setRecipe(response.data[0]);
        } else {
          setError("Không tìm thấy công thức nấu ăn.");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, []);






  return (
    <div className="today-menu-page">
      <div className="today-menu-background"></div>
      <div className="today-menu-container">
        <div className="today-menu-word">
          <h2 className="head2">Thực đơn hôm nay</h2>
          <span>Chúng ta có gì nào?<br /></span>


          {loading ? (
            <p>Đang tải thực đơn hôm nay...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : !recipe ? (
            <p>Không có công thức nào được tìm thấy.</p>
          ) : (
            <>
              <h3>{recipe.dishName}</h3>
              <p>{recipe.description}</p>
              <div>
                Nguyên liệu:
                <ul style={{ listStyleType: "none"}}>
                    {recipe.ingredients.map((item, index) => (
                    <li key={index} >
                       - {item}
                    </li>
                    ))}
                </ul>
                </div>
                <div>
                Hướng dẫn vào bếp:
                <ul style={{ listStyleType: "none"}}>
                    {recipe.instructions.map((item, index) => (
                    <li key={index} >
                       - {item}
                    </li>
                    ))}
                </ul>
              </div>
              <p>Dự tính thời gian: {recipe.estimatedCookingTime}</p>
              <p>Mẹo vào bếp: {recipe.cookingTips}</p>
              {/* <img
                src={recipe.imageUrl}
                alt={recipe.dishName}
                style={{ width: "300px", borderRadius: "12px", marginTop: "10px" }}
              /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import type { Recipe } from "../../router/types/boxResponse";

// export default function TodayMenu() {
//   const [recipe, setRecipe] = useState<Recipe | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchRecipe() {
//       try {
//         setLoading(true);
//         setError(null);

//         // ---- 👇 Fake API delay + fake data
//         await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate network delay

//         const fakeResponse = {
//           isSuccess: true,
//           data: [
//             {
//               id: "1",
//               dishName: "Canh cà chua trứng",
//               description: "Món canh đơn giản, thanh mát và dễ nấu.",
//               ingredients: ["Trứng", "Cà chua", "Hành lá", "Gia vị"],
//               instructions: [
//                 "Đánh trứng, cắt cà chua.",
//                 "Xào cà chua, thêm nước, đổ trứng vào khuấy đều.",
//               ],
//               estimatedCookingTime: "15 phút",
//               cookingTips: "Cho trứng sau khi nước sôi để không bị tanh.",
//               imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
//             },
//           ],
//           message: "Fake recipe for testing",
//         };
//         console.log("Fake response:", fakeResponse);

//         if (fakeResponse.isSuccess && fakeResponse.data.length > 0) {
//           setRecipe(fakeResponse.data[0]);
//         } else {
//           setError("Không tìm thấy công thức nấu ăn.");
//         }
//       } catch (err) {
//         console.error("Error fetching recipe:", err);
//         setError("Lỗi khi tải dữ liệu.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRecipe();
//   }, []);

//   return (
//     <div className="today-menu-page">
//       <div className="today-menu-background"></div>
//       <div className="today-menu-container">
//         <div className="today-menu-word">
//           <h2 className="head2">Thực đơn hôm nay</h2>
//           <span>Chúng ta có gì nào?<br /></span>


//           {loading ? (
//             <p>Đang tải thực đơn hôm nay...</p>
//           ) : error ? (
//             <p className="error-message">{error}</p>
//           ) : !recipe ? (
//             <p>Không có công thức nào được tìm thấy.</p>
//           ) : (
//             <>
//               <h3>{recipe.dishName}</h3>
//               <p>{recipe.description}</p>
//               <div>
//                 Nguyên liệu:
//                 <ul style={{ listStyleType: "none"}}>
//                     {recipe.ingredients.map((item, index) => (
//                     <li key={index} >
//                        - {item}
//                     </li>
//                     ))}
//                 </ul>
//                 </div>
//                 <div>
//                 Hướng dẫn vào bếp:
//                 <ul style={{ listStyleType: "none"}}>
//                     {recipe.instructions.map((item, index) => (
//                     <li key={index} >
//                        - {item}
//                     </li>
//                     ))}
//                 </ul>
//               </div>
//               <p>Dự tính thời gian: {recipe.estimatedCookingTime}</p>
//               <p>Mẹo vào bếp: {recipe.cookingTips}</p>
//               {/* <img
//                 src={recipe.imageUrl}
//                 alt={recipe.dishName}
//                 style={{ width: "300px", borderRadius: "12px", marginTop: "10px" }}
//               /> */}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }