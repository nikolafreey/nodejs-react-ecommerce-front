import React, { useEffect, useState } from "react";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import Jumbotron from "../components/cards/Jumbotron";
import CategoryList from "../components/category/CategoryList";
import SubCategoryList from "../components/subcategory/SubCategoryList";

const Home = () => {
  return (
    <>
      {/* {JSON.stringify(products)} */}
      <div className="jumbotron text-danger h1 font-weigth-bold text-center">
        <Jumbotron text={["New Arrivals", "Best Sellers"]} />
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals />
      <br />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        Best Sellers
      </h4>
      <BestSellers />
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        Category List
      </h4>
      <CategoryList />
      <h4 className="text-center p-3 mt-5 mb-5 display-3 jumbotron">
        SubCategory List
      </h4>
      <SubCategoryList />
      <br />
      <br />
    </>
  );
};

export default Home;
