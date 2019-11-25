import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function POIThumbnail(props) {
  let imgUrl = props.photo;
  return (
    <div className="col-sm-2">
      <div className="thumbnail text-center">
        <Link to={`/site/${props.sid}/poi/${props.id}`}>
          <img src={imgUrl} alt="imgUrl" width="400" height="300" />
          <span>
            <strong>{props.name}</strong>
          </span>
          <br />
          <span>{props.type}</span>
        </Link>
      </div>
    </div>
  );
}

export default POIThumbnail;
