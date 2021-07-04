import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import {
  createSubCategory,
  getSubCategories,
  removeSubCategory,
} from "../../../services/subCategoryService";
import { getCategories } from "../../../services/categoryService";

const SubCategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadSubCategories();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const loadSubCategories = () => {
    getSubCategories().then((res) => setSubCategories(res.data));
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword); //filtered((c) => c.name.toLowerCase().includes(keyword))

  const handleRemove = async (slug) => {
    setLoading(true);
    if (window.confirm("Are you sure you want to Delete " + slug)) {
      removeSubCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error("Deleted subcategory " + res.data.name);
          loadSubCategories();
        })
        .catch((err) => {
          if (err.response.status === 400) {
            toast.error(err.response.data.error);
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createSubCategory({ name, parent: category }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`SubCategory with name ${name} created!`);
        loadSubCategories();
      })
      .catch((e) => {
        setLoading(false);
        if (e.response.status === 400) {
          toast.error("Error: " + e.response.data.error);
        } else {
          toast.error("Error: " + e.message);
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading. . .</h4>
          ) : (
            <h4>SubCategory Create Page</h4>
          )}
          <div className="form-group">
            <label htmlFor="category">Parent Category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please Select. . .</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          <hr />

          {subCategories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary" key={c._id}>
              {c.name}
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/subcategory/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryCreate;
