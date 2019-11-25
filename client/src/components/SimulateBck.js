import React, { Component } from "react";
import "./App.css";
// import { Asset } from "./Asset";
// import { throwStatement } from "@babel/types";
// import { Poi } from "./Poi";
import POIThumbnail from "./POIThumbnail";
import { ButtonToolbar, Button } from "react-bootstrap";

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
      previousRotation: "0 0 0"
    };
  }

  update = event => {
    // event.preventDefault();

    this.setState({
      skySrc: ""
    });
    console.log(this.state.skySrc);
    fetch(
      `http://localhost:5000/api/v0/areas/${this.state.id}/connectedarea/${this.state.dir}`
      // `http://localhost:5000/api/v0/areas/${this.state.id}/connectedarea/W`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data.rotations);
        console.log(data.pois);

        var i = 0;
        var len = data.pois.length;
        var poiswithrel = [];
        var merged = "";
        for (i; i < len; i++) {
          merged = { ...data.rotations[i], ...data.pois[i] };
          poiswithrel.push(merged);
        }
        // console.log(poiswithrel[0].rotation);

        this.setState({
          id: data.id,
          desc: data.desc,
          photosphere:
            "https://cors-anywhere.herokuapp.com/" + data.photosphere,
          pois: poiswithrel,
          // r: data.rotations,
          skySrc: "#sky"
        });
        // console.log("AFTER SET STATE:" + this.state.pois[0]);
      });
  };

  setDirection(xPos) {
    var x = xPos % 360;
    var direction = "";
    switch (x) {
      case 0:
        direction = "N";
        break;
      case 45:
        direction = "NW";
        break;
      case 90:
        direction = "W";
        break;
      case 135:
        direction = "SW";
        break;
      case 180:
        direction = "S";
        break;
      case 225:
        direction = "SE";
        break;
      case 270:
        direction = "E";
        break;
      case 315:
        direction = "NE";
        break;

      case -45:
        direction = "NE";
        break;
      case -90:
        direction = "E";
        break;
      case -135:
        direction = "SE";
        break;
      case -180:
        direction = "S";
        break;
      case -225:
        direction = "SW";
        break;
      case -270:
        direction = "W";
        break;
      case -315:
        direction = "NW";
        break;
      default:
        break;
    }
    console.log(x + " IS " + direction);
    const { pois } = this.state;

    this.setState({ dir: direction });
  }

  setDirectionLarge(xPos) {
    var x = xPos % 360;
    var direction = "";
    switch (x) {
      case 0:
        direction = "N";
        break;
      case 45:
        direction = "NW";
        break;
      case 90:
        direction = "W";
        break;
      case 135:
        direction = "SW";
        break;
      case 180:
        direction = "S";
        break;
      case 225:
        direction = "SE";
        break;
      case 270:
        direction = "E";
        break;
      case 315:
        direction = "NE";
        break;

      case -45:
        direction = "NE";
        break;
      case -90:
        direction = "E";
        break;
      case -135:
        direction = "SE";
        break;
      case -180:
        direction = "S";
        break;
      case -225:
        direction = "SW";
        break;
      case -270:
        direction = "W";
        break;
      case -315:
        direction = "NW";
        break;
      default:
        break;
    }
    console.log(x + " IS " + direction);
    const { pois } = this.state;

    this.setState({ dir: direction });
  }

  checkIfPOIExists(x) {
    var pres = "0 " + x + " 0";
    const { pois } = this.state;
    var i = 0;
    var len = pois.length;
    for (i; i < len; i++) {
      console.log(pois[0].rotation);
      console.log(pres);
      if (pois[0].rotation === pres) {
        console.log("ARE EQUAL!");
      } else console.log("AREA UNEQUAL!");
    }
  }

  up = event => {
    this.setState({ presY: (this.state.presY + 1) % 360 });
    this.setState({
      rotation: this.state.presY + " " + this.state.presX + " 0"
    });
  };

  down = event => {
    this.setState({ presY: (this.state.presY - 1) % 360 });
    this.setState({
      rotation: this.state.presY + " " + this.state.presX + " 0"
    });
  };

  turnLeft = event => {
    this.setState({ presX: (this.state.presX + 45) % 360 });
    this.setState({ x: "0 " + this.state.presX + " 0" });
    this.checkIfPOIExists(this.state.presX);
    this.setDirection(this.state.presX);
    console.log(this.state.presX + " AY " + this.state.dir);
  };

  turnRight = event => {
    this.setState({ presX: (this.state.presX - 45) % 360 });
    this.setState({ x: "0 " + this.state.presX + " 0" });
    console.log(this.state.x);
    const { id, photosphere, pois } = this.state;
    console.log(id);
    console.log(photosphere);
    console.log(pois);
    this.setDirection(this.state.presX);
    this.checkIfPOIExists(this.state.presX);
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/v0/areas/${this.state.id}`)
      .then(response => response.json())
      .then(data => {
        // console.log(data.can_access);
        this.setState({
          id: data.id,
          desc: data.desc,
          photosphere:
            "https://cors-anywhere.herokuapp.com/" + data.photosphere,
          pois: data.can_access
        });
        console.log(this.state.pois);
      });
  }

  render() {
    const { photosphere, id, dir, x, skySrc, pois, desc } = this.state;
    console.log("SKYSRC=" + skySrc);
    console.log("PS=" + photosphere);
    console.log(this.state.presX + " = " + this.state.dir);
    console.log("AFTER RENDER: ");
    console.log(this.state.pois[0]);
    return (
      <div className="container bg-2">
        <div>
          {/* <p>{photosphere} </p> */}
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
                <a-cursor></a-cursor>
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
            <Button className="mr-2" variant="danger" onClick={() => this.up()}>
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
        <div>
          <h3>POIs Available: </h3>
          {/* {pois.map(poi => (
            <POIThumbnail
              sid={this.props.match.params.sid}
              id={poi.id}
              name={poi.name}
              type={poi.type}
              desc={poi.desc}
              photo={poi.photo}
            /> */}
          {/* ))} */}
        </div>
      </div>
    );
  }
}
