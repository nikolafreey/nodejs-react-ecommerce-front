import React, { useEffect, useState } from "react";
import {
  getProduct,
  getRelated,
  productStar,
} from "../services/productService";
import SingleProduct from "../components/cards/SingleProduct";
import ProductCard from "../components/cards/ProductCard";
import { useSelector } from "react-redux";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [related, setRelated] = useState([]);
  const [star, setStar] = useState(0);

  const { slug } = match.params;

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  });

  const loadSingleProduct = () =>
    getProduct(slug).then((res) => {
      setProduct(res.data);
      //load related products
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      loadSingleProduct(); //show updated rating in real time after change
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related Products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related && related.length > 0 ? (
          related.map((related) => (
            <div key={related._id} className="col-md-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="text-center col">No Related Products</div>
        )}
      </div>
    </div>
  );
};

export default Product;
