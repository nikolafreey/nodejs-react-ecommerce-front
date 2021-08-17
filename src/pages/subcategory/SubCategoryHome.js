import React, { useState, useEffect } from "react";
import ProductCard from "../../components/cards/ProductCard";
import { getSubCategory } from "../../services/subCategoryService";

const SubCategoryHome = ({ match }) => {
  const [subCategory, setSubCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getSubCategory(slug).then((c) => {
      console.log(JSON.stringify(c.data, null, 4));
      setSubCategory(c.data.subCategory);
      setProducts(c.data.products);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading. . .
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              {products && products.length} Products in "
              {subCategory && subCategory.name}" subcategory.
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products &&
          products.length > 0 &&
          products.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProductCard product={p} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SubCategoryHome;
