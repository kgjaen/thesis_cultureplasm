import React, { Component } from "react";
import "./App.css";
// import { Asset } from "./Asset";
// import { throwStatement } from "@babel/types";
// import { Poi } from "./Poi";
import POIThumbnail from "./POIThumbnail";
import { ButtonToolbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export class SimulateTour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.aid,
      desc: "",
      photosphere: "",
      dir: "N",
      presX: 0,
      x: "0 0 0",
      pois: [],
      r: [],
      skySrc: "#sky",
      presY: 0,
      poiFound: false,
      poi: "",
      withPois: false
    };
  }

  update = event => {
    this.setState({
      skySrc: ""
    });
    console.log(this.state.skySrc);
    fetch(
      `http://localhost:5000/api/v0/areas/${this.state.id}/connectedarea/${this.state.dir}`
    )
      .then(response => response.json())
      .then(data => {
        var i = 0;
        var len = data.pois.length;
        var poiswithrel = [];
        var merged = "";
        for (i; i < len; i++) {
          merged = { ...data.rotations[i], ...data.pois[i] };
          poiswithrel.push(merged);
        }

        // SHOW POIS AVAILABLE IN THE AREA
        if (data.pois.length == 0) {
          console.log("NO POI AVAILABLE");
        } else {
          console.log(data.pois);
        }

        this.setState({
          id: data.id,
          desc: data.desc,
          photosphere:
            "https://cors-anywhere.herokuapp.com/" + data.photosphere,
          pois: poiswithrel,
          skySrc: "#sky"
        });
      });
  };

  setDirection(xPos) {
    var x = xPos % 360;
    var direction = "";

    // IF DIRECTION IS TO THE LEFT
    if (x >= 0) {
      if (x < 23) {
        direction = "N";
      } else if (x < 68) {
        direction = "NW";
      } else if (x < 113) {
        direction = "W";
      } else if (x < 158) {
        direction = "SW";
      } else if (x < 203) {
        direction = "S";
      } else if (x < 248) {
        direction = "SE";
      } else if (x < 293) {
        direction = "E";
      } else if (x < 338) {
        direction = "NE";
      } else {
        direction = "N";
      }
    } else {
      if (x >= -23) {
        direction = "N";
      } else if (x >= -68) {
        direction = "NE";
      } else if (x >= -113) {
        direction = "E";
      } else if (x >= -158) {
        direction = "SE";
      } else if (x >= -203) {
        direction = "S";
      } else if (x >= -248) {
        direction = "SW";
      } else if (x >= -293) {
        direction = "W";
      } else if (x >= -338) {
        direction = "NW";
      } else {
        direction = "N";
      }
    }

    const { pois } = this.state;

    this.setState({ dir: direction });
  }

  checkIfPOIExists(x, y) {
    const { pois } = this.state;
    var i = 0;
    var len = pois.length;
    for (i; i < len; i++) {
      console.log(pois[i].x);
      console.log(pois[i].y);
      if (pois[i].x <= x + 3 && pois[i].x >= x - 3) {
        if (pois[i].y <= y + 3 && pois[i].y >= y - 3) {
          console.log("ARE EQUAL! WHOOO!");
          this.setState({
            poiFound: true,
            poi: pois[i]
          });
        } else console.log("NO POI!");
      } else console.log("NO POI!");
    }
  }

  up = event => {
    this.setState({
      poiFound: false
    });
    this.setState({ presY: (this.state.presY + 1) % 360 });
    this.setState({
      x: this.state.presY + " " + this.state.presX + " 0"
    });
    this.checkIfPOIExists(this.state.presX, this.state.presY);
  };

  down = event => {
    this.setState({
      poiFound: false
    });
    this.setState({ presY: (this.state.presY - 1) % 360 });
    this.setState({
      x: this.state.presY + " " + this.state.presX + " 0"
    });
    this.checkIfPOIExists(this.state.presX, this.state.presY);
  };

  turnLeft = event => {
    this.setState({
      poiFound: false
    });
    this.setState({ presX: (this.state.presX + 1) % 360 });
    this.setState({ x: this.state.presY + " " + this.state.presX + " 0" });
    this.checkIfPOIExists(this.state.presX, this.state.presY);
    this.setDirection(this.state.presX);
  };

  turnRight = event => {
    this.setState({
      poiFound: false
    });
    this.setState({ presX: (this.state.presX - 1) % 360 });
    this.setState({ x: this.state.presY + " " + this.state.presX + " 0" });
    const { id, photosphere, pois } = this.state;
    this.setDirection(this.state.presX);
    this.checkIfPOIExists(this.state.presX, this.state.presY);
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/v0/areas/${this.state.id}`)
      .then(response => response.json())
      .then(data => {
        var i = 0;
        var len = data.can_access.length;
        var poiswithrel = [];
        var merged = "";
        for (i; i < len; i++) {
          merged = { ...data.position[i], ...data.can_access[i] };
          poiswithrel.push(merged);
        }
        this.setState({
          id: data.id,
          desc: data.desc,
          photosphere:
            "https://cors-anywhere.herokuapp.com/" + data.photosphere,
          pois: poiswithrel
        });
        console.log(this.state.pois);
      });
  }

  render() {
    const { photosphere, id, dir, x, skySrc, poi, desc } = this.state;

    return (
      <div>
        <div className="container bg-2">
          <Link
            to={`/site/${this.props.match.params.id}/area/${this.props.match.params.aid}`}
          >
            <span className="glyphicon glyphicon-chevron-left">
              Back to Area
            </span>
          </Link>
          <div>
            <h3> SIMULATE TOUR </h3>
            <h4> Area: {id} </h4>
            <h4> Desc: {desc} </h4>
            <h4> Direction: {dir} </h4>

            <h5>Rotation Angle: {x} </h5>

            <a-scene embedded>
              <a-assets>
                <img
                  id="sky"
                  crossOrigin="autonomous"
                  src={this.state.photosphere}
                />
              </a-assets>
              <a-sky src={this.state.skySrc}></a-sky>
              <a-entity id="rig" rotation={this.state.x}>
                <a-camera id="camera">
                  <a-cursor
                    geometry="primitive: ring; radiusInner: 0.05; radiusOuter: 0.08"
                    material="color: red; shader: flat"
                  ></a-cursor>
                </a-camera>
              </a-entity>
            </a-scene>
          </div>
          <br />
          <div>
            <ButtonToolbar>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.turnLeft()}
              >
                <span className="glyphicon glyphicon-chevron-left"></span>
              </Button>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.turnRight()}
              >
                <span className="glyphicon glyphicon-chevron-right"></span>
              </Button>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.up()}
              >
                <span className="glyphicon glyphicon-chevron-up"></span>
              </Button>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.down()}
              >
                <span className="glyphicon glyphicon-chevron-down"></span>
              </Button>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.update()}
              >
                <span className="glyphicon glyphicon-play-circle"></span>
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3>POIs Found: </h3>
            {this.state.poiFound ? (
              <div>
                <p>POI FOUND!</p>
                <POIThumbnail
                  key={poi.id}
                  sid={this.props.match.params.sid}
                  id={poi.id}
                  name={poi.name}
                  type={poi.type}
                  desc={poi.desc}
                  photo={poi.photo}
                />
              </div>
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
