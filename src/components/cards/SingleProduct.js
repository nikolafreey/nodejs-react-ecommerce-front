import React from "react";
import { Card, Tabs } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import StarRating from "react-star-ratings";
import ProductListItems from "./ProductListItems";

import placeholderImage from "../../images/Screenshot_111.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RatingModal from "../modals/RatingModal";
import { showAverage } from "../../services/ratingService";

const SingleProduct = ({ product, onStarClick, star }) => {
  const { title, images, description, _id } = product;
  const { TabPane } = Tabs;

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
            <>
              <ShoppingCartOutlined className="text-success" /> <br /> Add to
              Cart
            </>,
            <Link to="/">
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </Link>,
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
