import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../services/categoryService";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const { user } = useSelector((state) => ({ ...state }));

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const handleSearchChange = (e) => {
      e.preventDefault();
      setKeyword(e.target.value.toLowerCase());
  }

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword); //filtered((c) => c.name.toLowerCase().includes(keyword))

  const handleRemove = async (slug) => {
    setLoading(true);
    if (window.confirm("Are you sure you want to Delete " + slug)) {
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error("Deleted category " + res.data.name);
          loadCategories();
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
    console.log(name);
    setLoading(true);

    createCategory({ name }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`Category with name ${name} created!`);
        loadCategories();
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
            <h4>Category Create Page</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          <hr />
          {categories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary" key={c._id}>
              {c.name}{" "}
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${c.slug}`}>
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

export default CategoryCreate;
