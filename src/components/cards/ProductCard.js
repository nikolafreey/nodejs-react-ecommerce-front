import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import placeholder from "../../images/Screenshot_111.png";
import { Link } from "react-router-dom";

const ProductCart = ({ product }) => {
  const { images, title, slug, description } = product;
  const { Meta } = Card;

  return (
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
        <Link to={`/admin/product/${slug}`}>
          <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>,
        <>
          <ShoppingCartOutlined /> <br /> Add to Cart
        </>,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 50)}...`}
      />
    </Card>
  );
};

export default ProductCart;
