// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ReportIssue = () => {
//   const [guestId, setGuestId] = useState(""); // You can set default or fetch from props/context
//   const [guestName, setGuestName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (
//       !guestId.trim() ||
//       !guestName.trim() ||
//       !subject.trim() ||
//       !message.trim()
//     ) {
//       setError("All fields are required.");
//       return;
//     }

//     // Simulate success
//     setSuccess("Issue reported successfully.");
//     setGuestId("");
//     setGuestName("");
//     setSubject("");
//     setMessage("");

//     // Optionally redirect after success
//     // setTimeout(() => navigate("/"), 2000);
//   };

//   return (
//     <div className="right-0 max-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8 md:py-12 ">
//       <div className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* Close button with better styling */}
//         <button
//           onClick={() => navigate(-1)}
//           aria-label="Close"
//           className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-8 w-8"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2.5}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
//           <h2 className="text-3xl font-bold text-white text-center">
//             <span className="inline-block mr-2">🚨</span> Report an Issue
//           </h2>
//           <p className="text-blue-100 text-center mt-1">
//             We'll get back to you within 24 hours
//           </p>
//         </div>

//         <div className="px-8 py-8">
//           {/* Status messages with animation */}
//           {success && (
//             <div
//               role="alert"
//               className="mb-6 animate-fade-in text-green-800 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start"
//             >
//               <svg
//                 className="h-5 w-5 text-green-500 mr-3 mt-0.5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <div>{success}</div>
//             </div>
//           )}
//           {error && (
//             <div
//               role="alert"
//               className="mb-6 animate-fade-in text-red-800 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start"
//             >
//               <svg
//                 className="h-5 w-5 text-red-500 mr-3 mt-0.5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <div>{error}</div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Two-column layout for ID and Name */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Guest ID */}
//               <div>
//                 <label
//                   htmlFor="guestId"
//                   className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//                 >
//                   <svg
//                     className="h-4 w-4 text-blue-500 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Guest ID
//                 </label>
//                 <input
//                   type="text"
//                   id="guestId"
//                   value={guestId}
//                   onChange={(e) => setGuestId(e.target.value)}
//                   placeholder="e.g. GUEST-1234"
//                   className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition placeholder-gray-400"
//                   required
//                 />
//               </div>

//               {/* Guest Name */}
//               <div>
//                 <label
//                   htmlFor="guestName"
//                   className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//                 >
//                   <svg
//                     className="h-4 w-4 text-blue-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                   Guest Name
//                 </label>
//                 <input
//                   type="text"
//                   id="guestName"
//                   value={guestName}
//                   onChange={(e) => setGuestName(e.target.value)}
//                   placeholder="Your full name"
//                   className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition placeholder-gray-400"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Subject */}
//             <div>
//               <label
//                 htmlFor="subject"
//                 className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//               >
//                 <svg
//                   className="h-4 w-4 text-blue-500 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//                 Subject
//               </label>
//               <input
//                 type="text"
//                 id="subject"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 placeholder="Brief summary of your issue"
//                 className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition placeholder-gray-400"
//                 required
//               />
//             </div>

//             {/* Message */}
//             <div>
//               <label
//                 htmlFor="message"
//                 className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//               >
//                 <svg
//                   className="h-4 w-4 text-blue-500 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//                   />
//                 </svg>
//                 Detailed Message
//               </label>
//               <textarea
//                 id="message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 rows="6"
//                 placeholder="Please describe your issue in detail..."
//                 className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition placeholder-gray-400 resize-none"
//                 required
//               />
//             </div>

//             {/* Submit Button with loading state */}
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center"
//             >
//               <svg
//                 className="h-5 w-5 text-white mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                 />
//               </svg>
//               Submit Report
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssue;
