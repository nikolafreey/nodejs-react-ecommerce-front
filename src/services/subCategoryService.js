import axios from "axios";

export const getSubCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API}/subcategories`);

export const getSubCategory = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/subcategory/${slug}`);

export const removeSubCategory = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/subcategory/${slug}`, {
    headers: { authtoken },
  });

export const updateSubCategory = async (slug, subcategory, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API}/subcategory/${slug}`,
    subcategory,
    {
      headers: { authtoken },
    }
  );

export const createSubCategory = async (subcategory, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/subcategory`, subcategory, {
    headers: { authtoken },
  });
