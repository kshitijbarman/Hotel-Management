
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Feedback = () => {
//   const navigate = useNavigate();
//   const [guestId, setGuestId] = useState("");
//   const [guestName, setGuestName] = useState("");
//   const [feedback, setFeedback] = useState("");
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       setSuccess("Thank you for your valuable feedback!");
//       setGuestId("");
//       setGuestName("");
//       setFeedback("");
//       setRating(0);
//     } catch (err) {
//       setError(err.message || "Failed to submit feedback. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-between items bg-gray-600">
//       {/* <div className="bg-red-500 w-1/2">1</div> */}
//       <div className="hidden md:block w-1/2 h-screen  ">
//         <img
//           src="https://media.istockphoto.com/id/2155637046/photo/feedback-360-cycle-feedback.webp?a=1&b=1&s=612x612&w=0&k=20&c=8WKeGzV2EZhWtFYjBQZMbeEn5qhJ2H9wyUfXfCqBnT0="
//           className=" w-full h-full object-cover rounded-3xl"
//           alt="Feedback Illustration"
//         />
//       </div>

//       <div className="sm:w-full lg:w-1/2 h-screen">
//         <div className="relative bg-white bg-opacity-0 border border-gray-100 rounded-3xl shadow-2xl w-full   overflow-hidden backdrop-blur-[1px]">
//           {/* Close button */}
//           <button
//             onClick={() => navigate(-1)}
//             aria-label="Close"
//             className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-8 w-8"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>

//           {/* Header with gradient */}
//           <div className="bg-gradient-to-r from-gray-500 to-gray-500 px-8 py-12">
//             <h2 className="text-3xl font-bold text-white text-center">
//               <span className="inline-block mr-2">🌟</span> Share Your Feedback
//             </h2>
//             <p className="text-green-100 text-center mt-1">
//               We value your experience with us
//             </p>
//           </div>

//           <div className="px-8 py-8">
//             {/* Status messages */}
//             {success && (
//               <div
//                 role="alert"
//                 className="mb-6 animate-fade-in text-green-800 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start"
//               >
//                 <svg
//                   className="h-5 w-5 text-green-500 mr-3 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>{success}</div>
//               </div>
//             )}
//             {error && (
//               <div
//                 role="alert"
//                 className="mb-6 animate-fade-in text-red-800 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start"
//               >
//                 <svg
//                   className="h-5 w-5 text-red-500 mr-3 mt-0.5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>{error}</div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Two-column layout for ID and Name */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Guest ID */}
//                 <div>
//                   <label
//                     htmlFor="guestId"
//                     className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//                   >
//                     <svg
//                       className="h-4 w-4 text-green-500 mr-2"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Guest ID
//                   </label>
//                   <input
//                     type="text"
//                     id="guestId"
//                     value={guestId}
//                     onChange={(e) => setGuestId(e.target.value)}
//                     placeholder="e.g. GUEST-1234"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition placeholder-gray-400"
//                     required
//                   />
//                 </div>

//                 {/* Guest Name */}
//                 <div>
//                   <label
//                     htmlFor="guestName"
//                     className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//                   >
//                     <svg
//                       className="h-4 w-4 text-green-500 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     Guest Name
//                   </label>
//                   <input
//                     type="text"
//                     id="guestName"
//                     value={guestName}
//                     onChange={(e) => setGuestName(e.target.value)}
//                     placeholder="Your full name"
//                     className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition placeholder-gray-400"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Rating */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
//                   <svg
//                     className="h-4 w-4 text-green-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
//                     />
//                   </svg>
//                   Your Rating
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       type="button"
//                       className="focus:outline-none"
//                       onClick={() => setRating(star)}
//                       onMouseEnter={() => setHoverRating(star)}
//                       onMouseLeave={() => setHoverRating(0)}
//                     >
//                       <svg
//                         className={`h-10 w-10 transition-colors duration-150 ${
//                           (hoverRating || rating) >= star
//                             ? "text-yellow-400"
//                             : "text-gray-300"
//                         }`}
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     </button>
//                   ))}
//                   <span className="ml-2 text-gray-600 text-sm">
//                     {rating
//                       ? `${rating} star${rating !== 1 ? "s" : ""}`
//                       : "Not rated"}
//                   </span>
//                 </div>
//               </div>

//               {/* Feedback */}
//               <div>
//                 <label
//                   htmlFor="feedback"
//                   className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center"
//                 >
//                   <svg
//                     className="h-4 w-4 text-green-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//                     />
//                   </svg>
//                   Your Feedback
//                 </label>
//                 <textarea
//                   id="feedback"
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                   rows="6"
//                   placeholder="What did you like or what could we improve?"
//                   className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition placeholder-gray-400 resize-none"
//                   required
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full bg-gradient-to-r from-gray-600 to-gray-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50 flex items-center justify-center ${
//                   isSubmitting ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       className="h-5 w-5 text-white mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                       />
//                     </svg>
//                     Submit Feedback
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Feedback;
