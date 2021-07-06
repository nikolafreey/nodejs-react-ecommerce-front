import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ProductCreateForm = ({
  handleSubmit,
  handleChange,
  handleCategoryChange,
  showSubCategory,
  subOptions,
  values,
  setValues,
}) => {
  const {
    title,
    description,
    price,
    category,
    categories,
    subCategory,
    shipping,
    quantity,
    images,
    colors,
    color,
    brands,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          id="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="shipping">Shipping</label>
        <select
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option>Select. . .</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          name="quantity"
          id="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color</label>
        <select name="color" className="form-control" onChange={handleChange}>
          <option>Select. . .</option>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="brand">Brand</label>
        <select name="brand" className="form-control" onChange={handleChange}>
          <option>Select. . .</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="">Category</label>
        <select
          name="category"
          id="category"
          className="form-control"
          onChange={handleCategoryChange}
        >
          <option>Select. . .</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option value={c._id} key={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      {showSubCategory && (
        <div>
          <label htmlFor="subCategories">Sub Category</label>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select. . ."
            value={subCategory}
            onChange={(value) => {
              setValues({ ...values, subCategory: value });
            }}
          >
            {subOptions.length > 0 &&
              subOptions.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
          </Select>
        </div>
      )}
      <br />
      <button className="btn btn-outline-info">Save</button>
    </form>
  );
};

export default ProductCreateForm;
