import React from "react";

function About() {
  return (
    <div className="container text-center">
      <h3>THE DIGITALAGUNA TEAM</h3>
      <p>
        <em>We love cultural heritage sites digitization!</em>
      </p>
      <p>
        As part of DigitaLaguna Team's vision to digitally preserve cultural
        heritage sites and museums, a graph database was developed to store
        signifcant information about the sites, which includes descriptive data,
        photospheres and other images.
      </p>
      <br />
      <div className="row">
        <div className="col-sm-4">
          <p className="text-center">
            <strong>Kendall Jaen</strong>
          </p>
          <br />
          <a href="#demo" data-toggle="collapse">
            <img
              src="/images/ken.jpg"
              className="img-circle person"
              alt="Random Name"
              width="255"
              height="255"
            />
          </a>
          <div id="demo" className="collapse">
            <p>MS Student</p>
            <p>ICS Faculty</p>
          </div>
        </div>
        <div className="col-sm-4">
          <p className="text-center">
            <strong>Dja Dela Rosa</strong>
          </p>
          <br />
          <a href="#demo2" data-toggle="collapse">
            <img
              src="/images/dja.jpg"
              className="img-circle person"
              alt="Random Name"
              width="255"
              height="255"
            />
          </a>
          <div id="demo2" className="collapse">
            <p>Team Member</p>
            <p>ICS Faculty</p>
          </div>
        </div>
        <div className="col-sm-4">
          <p className="text-center">
            <strong>Faye Caraan</strong>
          </p>
          <br />
          <a href="#demo3" data-toggle="collapse">
            <img
              src="/images/faye.jpg"
              className="img-circle person"
              alt="Random Name"
              width="255"
              height="255"
            />
          </a>
          <div id="demo3" className="collapse">
            <p>Research Assistant</p>
            <p>Team Lead</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
