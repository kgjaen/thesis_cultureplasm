import React from "react";
import "./App.css";

function Footer() {
  return (
    <footer className="text-center">
      <a
        className="up-arrow"
        href="#myPage"
        data-toggle="tooltip"
        title="TO TOP"
      >
        <span className="glyphicon glyphicon-chevron-up"></span>
      </a>
      <br />
      <br />
      <p>
        <span className="glyphicon glyphicon-copyright-mark"></span> 2019
        DigitaLaguna. All Rights Reserved.{" "}
      </p>
    </footer>
  );
}

export default Footer;
