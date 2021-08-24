import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import UserNav from "../../components/nav/UserNav";
import { getWishList, removeWishList } from "../../services/userService";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [wishList, setWishList] = useState([]);

  useEffect(() => {
    loadWishList();
  }, []);

  const handleRemove = (productId) =>
    removeWishList(productId, user.token).then((res) => {
      loadWishList();
    });

  const loadWishList = () =>
    getWishList(user.token).then((res) => {
      setWishList(res.data.wishlist);
      toast.error("Deleted a product from wishlist!");
    });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>
          {wishList.map((p) => (
            <div key={p._id} className="alert alert-secondary">
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                onClick={() => handleRemove(p._id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
