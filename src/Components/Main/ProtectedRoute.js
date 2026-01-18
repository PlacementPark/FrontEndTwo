import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
import AxiosInstance from "./AxiosInstance";
const ProtectedRoute = ({ children }) => {
   const [check, setCheck] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   useEffect(() => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) navigate("/login");
      const fetchData = async () => {
         try {
            const res = await AxiosInstance.get("/status");

            dispatch(
               setUser({
                  userMail: res.data.userMail,
                  employeeType: res.data.employeeType,
                  userid: res.data.userid,
                  username: res.data.username,
               })
            );

            setCheck(true);
         } catch (error) {
            navigate("/login");
         }
      };
      fetchData();
   }, [navigate, dispatch]);
   if (check) {
      return children;
   }
};

export default ProtectedRoute;
