import React from "react";
import "./App.css";

function Photo(props) {
  return (
    <div className="col-sm-4">
      <div className="thumbnail text-center">
        <img src={props.photo} alt="imgUrl" width="400" height="300" />
      </div>
    </div>
  );
}

export default Photo;
