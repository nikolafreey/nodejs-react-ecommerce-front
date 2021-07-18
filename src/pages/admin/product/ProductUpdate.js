import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "../../../services/productService";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import FileUpload from "../../../components/forms/FileUpload";
import {
  getCategories,
  getCategorySubs,
} from "../../../services/categoryService";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "",
  description: "",
  price: 0,
  category: "",
  subCategory: [],
  shipping: "",
  quantity: 0,
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus"],
  color: "",
  brand: "",
};

const ProductUpdate = ({ match, history }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  //   const [showSubCategory, setShowSubCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ArrayOfSubIds, setArrayOfSubIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subCategory = ArrayOfSubIds;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated successfully`);
        history.push("/admin/products");
      })
      .catch((e) => {
        setLoading(false);
        toast.error("Update Product Failed with Error: " + e.message);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setValues({ ...values, subCategory: [] });
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });
    //if user clicks back to original category show its sub categories that were chosen by default
    if (values.category._id === e.target.value) {
      loadProduct();
    }
    //clear old sub category IDs
    setArrayOfSubIds([]);
  };

  const loadCategories = () =>
    getCategories().then((res) => setCategories(res.data));

  const loadProduct = () => {
    getProduct(slug).then((res) => {
      console.log("res", res);
      setValues({ ...values, ...res.data });
      getCategorySubs(res.data.category._id)
        .then((res) => {
          setSubOptions(res.data);
        })
        .catch((e) => console.log(e));

      let arr = [];
      res.data.subCategory.map((s) => arr.push(s._id));
      console.log("arr", arr);
      setArrayOfSubIds((prev) => arr);
    });
  };

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {JSON.stringify(values)}
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product Update</h4>
          )}
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            values={values}
            setValues={setValues}
            categories={categories}
            subOptions={subOptions}
            handleCategoryChange={handleCategoryChange}
            ArrayOfSubIds={ArrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
            selectedCategory={selectedCategory}
          />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
