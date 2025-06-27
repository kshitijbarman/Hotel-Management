import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    axios
      .get("https://hotel-management-backend-rgpk.onrender.com/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const role = res.data.user.role;
        setUserRole(role);
        setIsAuthenticated(true);

        localStorage.setItem("userType", role);
        console.log(
          `ProtectedRoute - Validated role: ${role}, Required: ${requiredRole}`
        );
      })
      .catch((error) => {
        console.error("ProtectedRoute - getMe error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("userType");
        setIsAuthenticated(false);
        localStorage.clear();
      });
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // if (requiredRole && userRole !== requiredRole) {
  //   return <Navigate to="/" replace />;
  // }

  return children;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const baseURL = "http://localhost:6969";

//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setIsAuthenticated(false);
//       return;
//     }

//     axios
//       .get(`${baseURL}/user/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         const role = res.data.user.role;
//         setUserRole(role);
//         setIsAuthenticated(true);
//         localStorage.setItem("userType", role);
//         console.log(
//           `ProtectedRoute - Validated role: ${role}, Required: ${requiredRole}`
//         );
//       })
//       .catch((error) => {
//         console.error("ProtectedRoute - getMe error:", error);
//         localStorage.clear();
//         setIsAuthenticated(false);
//       });
//   }, []);

//   if (isAuthenticated === null) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
