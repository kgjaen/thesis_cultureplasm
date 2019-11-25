import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">
            CULTUREPLASM
          </a>
        </div>
        <ul className="nav navbar-nav">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/site">Sites</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
