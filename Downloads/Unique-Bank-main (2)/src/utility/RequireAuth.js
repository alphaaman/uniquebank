import { Navigate, useLocation } from "react-router";
import { getToken } from "../services/LocalStorageService";

export const RequireAuth = ({ children }) => {
  const token = getToken();
  console.log(token)
  const location = useLocation()

  if (!token) {
    console.log(token)
    return <Navigate to="/login" state={{path: location.pathname}}/>;
  }

  return children;
};
