import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../Assets/Features/User/userSlice";
const ProtectedRoute = ({ children }) => {
   const [check, setCheck] = useState(false);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   useEffect(() => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) navigate("/login");
      const fetchData = async () => {
         try {
            const res = await axios.get(
               "https://tpp-backend-eura.onrender.com/api/v1/status",
               {
                  headers: {
                     authorization: token,
                  },
               }
            );

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
