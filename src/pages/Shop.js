import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsByFilter,
  getProductsByCount,
} from "../services/productService";
import ProductCard from "../components/cards/ProductCard";
import { Menu, Slider } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { SEARCH_QUERY } from "../actionTypes/searchActionTypes";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState([0, 0]);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const { SubMenu, ItemGroup } = Menu;

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12).then((res) => {
      setLoading(false);
      setProducts(res.data);
    });
  };

  const fetchProducts = (arg) => {
    setLoading(true);
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const handleSlider = (value) => {
    dispatch({ type: SEARCH_QUERY, payload: { text: "" } });
    setPrice(value);
    setTimeout(() => {
      //When we interact with slider the value of price changes a lot and it would put unneccessary load on backend server.
      setOk(!ok); //Therefore we use setTimeout to delay the reqnest by 300ms and effectively debounce and throttle the request towards the API server
    }, 300);
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
    }, 300);

    return () => clearTimeout(delayed);
  }, [text]);

  useEffect(() => {
    fetchProducts({ price });
  }, [ok]); //Value of ok changes when we interact with the slider thanks to handleSlider function

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4 className="text-center">Search / Filter</h4>
          <Menu mode="inline" defaultOpenKeys={["1", "2"]}>
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
