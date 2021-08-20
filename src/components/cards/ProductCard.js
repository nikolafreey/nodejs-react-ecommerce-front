import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import placeholder from "../../images/Screenshot_111.png";
import { Link } from "react-router-dom";
import { showAverage } from "../../services/ratingService";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { ADD_TO_CART } from "../../actionTypes/cartActionTypes";
import { SET_VISIBLE } from "../../actionTypes/drawerActionTypes";

const ProductCart = ({ product }) => {
  const { images, title, slug, description, price } = product;
  const { Meta } = Card;

  const [tooltip, setTooltip] = useState("Click to Add");

  //redux
  const dispatch = useDispatch();
  const { user, cart } = useSelector((state) => ({ ...state }));

  const handleAddToCart = () => {
    //create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      //remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      //save to localStorage
      localStorage.setItem("cart", JSON.stringify(unique));
      //show tooltip
      setTooltip("Added!");
      //add to redux state
      dispatch({ type: ADD_TO_CART, payload: unique });
      //show cart items in Side Drawer
      dispatch({ type: SET_VISIBLE, payload: true });
    }
  };

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="pt-1 pb-3 text-center">No Rating Yet.</div>
      )}
      <Card
        cover={
          <img
            alt="Cover"
            className="p-1"
            style={{ height: "150px", objectFit: "cover" }}
            src={images && images.length ? images[0].url : placeholder}
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-success" /> <br /> Add to
              Cart
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 50)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCart;
