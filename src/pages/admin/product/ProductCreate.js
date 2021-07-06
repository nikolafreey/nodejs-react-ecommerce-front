import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { createProduct } from "../../../services/productService";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import {
  getCategories,
  getCategorySubs,
} from "../../../services/categoryService";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "Macbook Pro",
  description: "Macbook Pro from Apple",
  price: 2000,
  category: "",
  categories: [],
  subCategory: [],
  shipping: "Yes",
  quantity: 10,
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
  color: "Black",
  brand: "Apple",
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((res) =>
      setValues({ ...values, categories: res.data })
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        toast.success("Created a product: " + res.data.title);
        setValues(initialState);
      })
      .catch((err) =>
        toast.error("Product not created, Error: " + err.message)
      );
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setValues({ ...values, subCategory: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
      setShowSubCategory(true);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product Create</h4>
          )}
          <hr />
          {JSON.stringify(values.images)}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductCreateForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSubCategor={showSubCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
