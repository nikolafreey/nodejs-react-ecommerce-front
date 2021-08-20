import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import placeholder from "../../images/Screenshot_111.png";
import { Link } from "react-router-dom";
import { SET_VISIBLE } from "../../actionTypes/drawerActionTypes";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      placement="right"
      closable={false}
      title={`Cart / ${cart.length} Product`}
      onClose={() => dispatch({ type: SET_VISIBLE, payload: false })}
      visible={drawer}
    >
      {cart.map((p) => (
        <div className="row" key={p._id}>
          <div className="col">
            {p.images[0] ? (
              <>
                <img
                  src={p.images[0].url}
                  style={imageStyle}
                  alt="placeholder"
                />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={placeholder} style={imageStyle} alt="placeholder" />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to="/cart">
        <button
          type="button"
          className="btn text-center btn-primary btn-raised btn-block"
          onClick={() => dispatch({ type: SET_VISIBLE, payload: false })}
        >
          GO TO CHECKOUT
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
