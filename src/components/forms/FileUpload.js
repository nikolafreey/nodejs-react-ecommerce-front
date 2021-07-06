import axios from "axios";
import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        { headers: { authtoken: user.token } }
      )
      .then((res) => {
        setLoading(false);
        const { images } = values;
        let filteredImages = images.filter(
          (item) => item.public_id !== public_id
        );
        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const fileUploadAndResize = (e) => {
    console.log(e.target.files);
    //resize
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                {
                  image: uri,
                },
                { headers: { authtoken: user ? user.token : "" } }
              )
              .then((res) => {
                console.log("Image upload res data", res.data);
                setLoading(false);
                allUploadedFiles.push(res.data);
                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                console.error(err);
                setLoading(false);
              });
          },
          "base64"
        );
      }
    }
  };

  return (
    <>
      <div className="row">
        {values.images.length > 0 &&
          values.images.map((image) => (
            <Badge
              key={image.public_id}
              count="X"
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar src={image.url} size={100} className="ml-3" />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label className="btn btn-primary btn-raised" htmlFor="file">
          Choose File
          <input
            hidden
            type="file"
            name="file"
            id="file"
            multiple
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
