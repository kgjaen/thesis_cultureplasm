import React, { Component } from "react";
import POIThumbnail from "./POIThumbnail";
import { AddPOIModal } from "./modals/AddPOIModal";
import { ButtonToolbar, Button } from "react-bootstrap";
import "./App.css";
import { Link } from "react-router-dom";

export class POI extends Component {
  constructor(props) {
    super(props);
    this.state = { pois: [], showModal: false };
  }

  refreshList() {
    fetch(
      `http://localhost:5000/api/v0/sites/${this.props.match.params.id}/pois`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ pois: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  render() {
    let hideModal = () => this.setState({ showModal: false });
    return (
      <div id="pois" className="container bg-2">
        <Link to={`/site/${this.props.match.params.id}/`}>
          <span className="glyphicon glyphicon-chevron-left">Back to Site</span>
        </Link>
        <h3>POINTS OF INTEREST</h3>
        <div className="row text-center">
          {this.state.pois.map(poi => (
            <POIThumbnail
              sid={this.props.match.params.id}
              id={poi.id}
              name={poi.name}
              type={poi.type}
              desc={poi.desc}
              photo={poi.photo}
            />
          ))}
        </div>
        <ButtonToolbar>
          <Button
            variant="primary"
            onClick={() => this.setState({ showModal: true })}
          >
            Add POI
          </Button>

          <AddPOIModal
            show={this.state.showModal}
            onHide={hideModal}
            siteid={`${this.props.match.params.id}`}
          />
        </ButtonToolbar>
      </div>
    );
  }
}
