import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminNav from "../../components/nav/AdminNav";
import Orders from "../../components/order/Orders";
import { changeStatus, getOrders } from "../../services/adminService";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [orders, setOrders] = useState([]);

  const loadOrders = () =>
    getOrders(user.token).then((res) => setOrders(res.data));

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success("Status has been updated!");
      loadOrders();
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Admin Dashboard</h4>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
