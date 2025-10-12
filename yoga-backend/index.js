import axios from "axios";
import app from "./app.js";
import Razorpay from 'razorpay'
import { isIndianNumber } from "./utils/PhoneChecker.js";

export const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});


// async function sendTemplate() {
//   try {
//     const response = await axios({
//       url: "https://graph.facebook.com/v22.0/715147185021086/messages", // Phone number ID
//       method: "post",
//       headers: {
//         Authorization: `Bearer ${process.env.WHASTAPP_API}`,
//         "Content-Type": "application/json",
//       },
//       data: {
//         messaging_product: "whatsapp",
//         to: "918077989856",
//         type: "template",
//         template: {
//           name: "yoga_trial_confirmation__session_access_details",
//           language: { code: "en_US" },
//           components: [
//             {
//               type: "header",
//               parameters: [
//                 {
//                   type: "image",
//                   image: {
//                     link: "https://images.app.goo.gl/XaKACGfGKpGxJuVy6"
//                   }
//                 }
//               ]
//             },
//             {
//               type: "body",
//               parameters: [
//                 { type: "text", text: "Ram" }, // {{1}}
//                 { type: "text", text: "26.10.2025" }, // {{2}}
//                 { type: "text", text: "https://auth/register?ref=samarth-gcmw1o&refferal_count=2&name=samarth sharma" } // {{3}}
//               ]
//             }
//           ]
//         }
//       }
//     });

//     console.log("Message sent:", response.data);
//   } catch (error) {
//     console.error("Error sending template:", error.response?.data || error.message);
//   }
// }

// sendTemplate();

// async function sendHelloTemplate() {
//   try {
//     const response = await axios({
//       url: "https://graph.facebook.com/v22.0/715147185021086/messages", // Phone number ID
//       method: "post",
//       headers: {
//         Authorization: `Bearer ${process.env.WHASTAPP_API}`,
//         "Content-Type": "application/json",
//       },
//       data: {
//         messaging_product: "whatsapp",
//         to: "918077989856",
//         type: "template",
//         template: {
//           name: "hello_world",
//           language: { code: "en_US" },
//         }
//       }
//     });

//     console.log("Message sent:", response.data);
//   } catch (error) {
//     console.error("Error sending template:", error.response?.data || error.message);
//   }
// }

// sendHelloTemplate();

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);

});