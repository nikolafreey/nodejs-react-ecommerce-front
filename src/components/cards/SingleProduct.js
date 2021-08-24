import React from "react";
import { Card, Tabs, Tooltip } from "antd";
import { Link, useHistory } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import StarRating from "react-star-ratings";
import ProductListItems from "./ProductListItems";
import _ from "lodash";

import placeholderImage from "../../images/Screenshot_111.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RatingModal from "../modals/RatingModal";
import { showAverage } from "../../services/ratingService";
import { useDispatch } from "react-redux";
import { ADD_TO_CART } from "../../actionTypes/cartActionTypes";
import { useState } from "react";
import { SET_VISIBLE } from "../../actionTypes/drawerActionTypes";
import { addToWishList } from "../../services/userService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  const { TabPane } = Tabs;

  const [tooltip, setTooltip] = useState("Click to Add");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  const handleAddToCart = () => {
    //create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      //push new product to cart
      cart.push({ ...product, count: 1 });
      //remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      //save to localStorage
      localStorage.setItem("cart", JSON.stringify(unique));
      //show tooltip
      setTooltip("Added!");
      //add to redux store
      dispatch({ type: ADD_TO_CART, payload: unique });
      //show items from cart in Side Drawer
      dispatch({ type: SET_VISIBLE, payload: true });
    }
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishList(product._id, user.token).then((res) => {
      console.log(res);
      toast.success("Added to wishlist!");
      history.push("/user/wishlist");
    });
  };

  return (
    <>
      <div className="col-md-7">
        <Carousel showArrows autoPlay infiniteLoop>
          {images && images.length === 0 ? (
            <Card
              cover={
                <img
                  alt="Cover"
                  className="mb-3 card-image"
                  src={placeholderImage}
                />
              }
            ></Card>
          ) : (
            images &&
            images.map((i) => (
              <img src={i.url} key={i.public_id} alt="carousel" />
            ))
          )}
        </Carousel>
        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            More info about the product.
          </TabPane>
        </Tabs>
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="pt-1 pb-3 text-center">No Rating Yet.</div>
        )}
        <Card
          actions={[
            <a onClick={handleAddToCart}>
              <ShoppingCartOutlined className="text-success" /> <br /> Add to
              Cart
            </a>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
