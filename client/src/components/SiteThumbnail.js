import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function SiteThumbnail(props) {
  return (
    <div className="col-sm-4">
      <div className="thumbnail text-center">
        <Link to={`/site/${props.id}`}>
          <img src="/images/loc.png" alt="Paris" width="100" height="100" />
          <p>
            <strong>{props.name}</strong>
          </p>
        </Link>
      </div>
    </div>
  );
}

export default SiteThumbnail;
