import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ADD_TO_CART } from "../actionTypes/cartActionTypes";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
} from "../services/userService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("res", res);
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    //remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }

    //remove from redux
    dispatch({ type: ADD_TO_CART, payload: [] });

    //remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      toast.success("Cart is empty, Continue shopping.");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        toast.success("Address Saved!");
        setAddressSaved(true);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        coupon input and apply button for coupon
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {products.map((p, i) => (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) x {p.count} = ${p.price * p.count})
            </p>
          </div>
        ))}
        <hr />
        <p>Cart Total: ${total}</p>
        <div className="row">
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
            >
              Place Order
            </button>
          </div>
          <div className="col-md-6">
            <button
              onClick={emptyCart}
              disabled={!products.length}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
