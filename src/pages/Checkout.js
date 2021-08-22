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
import { applyCoupon } from "../services/couponService";
import { COUPON_APPLIED } from "../actionTypes/couponActionTypes";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [coupon, setCoupon] = useState("");

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
      setTotalAfterDiscount(0);
      setCoupon("");
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

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () => (
    <>
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
      {totalAfterDiscount > 0 && (
        <p className="bg-success p-2">
          Discounted Price: ${totalAfterDiscount}
        </p>
      )}
    </>
  );

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token).then((res) => {
      if (res.data) {
        setTotalAfterDiscount(res.data);
        //update the Redux state
        dispatch({ type: COUPON_APPLIED, payload: true });
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        //update redux state
        dispatch({ type: COUPON_APPLIED, payload: false });
      }
    });
  };

  const showApplyCoupon = () => (
    <>
      <input
        type="text"
        className="form-control"
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>
      <div className="col-md-6">
        {showProductSummary()}
        <div className="row">
          <div className="col-md-6">
            <button
              onClick={() => history.push("/payment")}
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
