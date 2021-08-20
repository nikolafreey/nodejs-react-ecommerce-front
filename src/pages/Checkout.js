import React from "react";

const Checkout = () => {
  const saveAddressToDb = () => {
    //
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        textarea
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
        <p>Products x Quantity</p>
        <hr />
        <p>List of products</p>
        <hr />
        <p>Cart Total</p>
      </div>
    </div>
  );
};

export default Checkout;
