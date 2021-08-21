import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByFilter,
  getProductsByCount,
} from "../services/productService";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { SEARCH_QUERY } from "../actionTypes/searchActionTypes";
import { getCategories } from "../services/categoryService";
import Star from "../components/forms/Star";
import { getSubCategories } from "../services/subCategoryService";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "Asus",
  ]);
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [shipping, setShipping] = useState(["Yes", "No "]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [star, setStar] = useState();
  const [subCategory, setSubCategory] = useState();

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const { SubMenu, ItemGroup } = Menu;

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  const loadAllProducts = () => {
    // setLoading(true);
    getProductsByCount(12).then((res) => {
      setProducts(res.data);
      //   setLoading(false);
    });
  };

  const handleSlider = (value) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setCategoryIds([]);
    setPrice(value);
    setStar();
    setSubCategory();
    setBrand("");
    setColor("");
    setShipping("");

    setTimeout(() => {
      //When we interact with slider the value of price changes a lot and it would put unneccessary load on backend server.
      setOk(!ok); //Therefore we use setTimeout to delay the reqnest by 300ms and effectively debounce and throttle the request towards the API server
    }, 300);
  };

  const handleCheck = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setStar();
    setSubCategory();
    setBrand("");
    setColor("");
    setShipping("");

    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    fetchProducts({ category: inTheState });
  };

  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          onChange={handleCheck}
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleSubCategory = (sub) => {
    setSubCategory(sub);
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar();
    setSubCategory();
    setBrand("");
    setColor("");
    setShipping("");

    fetchProducts({ subCategory: sub });
  };

  const showSubCategories = () =>
    subCategories.map((sub) => (
      <div
        className="p-1 m-1 badge badge-secondary"
        key={sub._id}
        onClick={() => handleSubCategory(sub)}
        style={{ cursor: "pointer" }}
      >
        {sub.name}
      </div>
    ));

  const handleStarClick = (num) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSubCategory();
    setBrand("");
    setColor("");
    setShipping("");
    setStar(num);

    fetchProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  const showBrands = () =>
    brands.map((b) => (
      <Radio
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-1 pr-4"
      >
        {" "}
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar();
    setSubCategory();
    setColor("");
    setShipping("");
    setBrand(e.target.value);

    fetchProducts({ brand: e.target.value });
  };

  const showColors = () =>
    colors.map((c) => (
      <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-1 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar();
    setSubCategory();
    setBrand("");
    setShipping("");
    setColor(e.target.value);

    fetchProducts({ color: e.target.value });
  };

  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShipping}
        value="Yes"
        checked={shipping.includes("Yes")}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShipping}
        value="No"
        checked={shipping.includes("No")}
      >
        No
      </Checkbox>
    </>
  );

  const handleShipping = (e) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar();
    setSubCategory();
    setBrand("");
    setColor("");
    setShipping(e.target.value);

    fetchProducts({ shipping: e.target.value });
  };

  useEffect(() => {
    const delayed = setTimeout(() => {
      if (!text) loadAllProducts();
      fetchProducts({ query: text });
    }, 300);

    return () => clearTimeout(delayed);
  }, [text]);

  useEffect(() => {
    fetchProducts({ price });
  }, [ok]); //Value of ok changes when we interact with the slider thanks to handleSlider function

  useEffect(() => {
    loadAllProducts();
    getCategories().then((res) => setCategories(res.data));
    getSubCategories().then((res) => setSubCategories(res.data));
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4 className="text-center">Search / Filter</h4>
          <Menu mode="inline" defaultOpenKeys={["1", "2", "3"]}>
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  range
                  max={4999}
                  value={price}
                  tipFormatter={(v) => `$${v}`}
                  onChange={handleSlider}
                />
              </div>
            </SubMenu>
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <div className="pl-4 pr-4">{showSubCategories()}</div>
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div className="row pl-3 ml-1">{showBrands()}</div>
            </SubMenu>
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div className="row pl-3 ml-1">{showColors()}</div>
            </SubMenu>
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div className="pr-5">{showShipping()}</div>
            </SubMenu>
          </Menu>
        </div>
        <div className="col-md-9">
          {loading ? (
            <h4 className="text-danger">Loading. . .</h4>
          ) : (
            <h4 className="text-center">Products</h4>
          )}
          {products && products.length < 1 && <p>No Products Found!</p>}
          <div className="row pb-5">
            {products &&
              products.map((p) => (
                <div key={p._id} className="col-md-4 mt-3">
                  <ProductCard product={p} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
