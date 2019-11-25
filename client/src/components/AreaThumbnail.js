import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function AreaThumbnail(props) {
  let imgUrl = props.photo;
  return (
    <div className="col-sm-2">
      <div className="thumbnail text-center">
        <Link to={`/site/${props.sid}/area/${props.id}`}>
          <img src={imgUrl} alt="imgUrl" width="400" height="300" />
          <p>
            <strong>{props.desc}</strong>
          </p>
        </Link>
      </div>
    </div>
  );
}

export default AreaThumbnail;
