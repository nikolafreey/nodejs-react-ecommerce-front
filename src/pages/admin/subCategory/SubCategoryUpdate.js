import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CategoryForm from "../../../components/forms/CategoryForm";
import {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  removeSubCategory,
  updateSubCategory,
} from "../../../services/subCategoryService";
import { getCategories } from "../../../services/categoryService";

const SubCategoryUpdate = ({ match, history }) => {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadSubCategory();
  }, [match.params.slug]);

  const { user } = useSelector((state) => ({ ...state }));

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data));
  };

  const loadSubCategory = () => {
    getSubCategory(match.params.slug).then((res) => {
      setName(res.data.name);
      setParent(res.data.parent);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    updateSubCategory(match.params.slug, { name, parent }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`SubCategory with name ${name} updated!`);
        history.push("/admin/subcategory");
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
            <h4>SubCategory Update Page</h4>
          )}
          <div className="form-group">
            <label htmlFor="category">Parent Category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
            >
              <option>Please Select. . .</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id} selected={c._id === parent}>
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
          <hr />
        </div>
      </div>
    </div>
  );
};

export default SubCategoryUpdate;
