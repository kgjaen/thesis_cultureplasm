import React, { Component } from "react";
import AreaThumbnail from "./AreaThumbnail";
import Photo from "./Photo";
import { Redirect } from "react-router";
import { ButtonToolbar, Button } from "react-bootstrap";
import { EditPOIModal } from "./modals/EditPOIModal";

export class POIDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      name: "",
      photo: "",
      desc: "",
      type: "",
      id: "",
      showModal: false,
      fireRedirect: false
    };
  }

  refreshList() {
    fetch(`http://localhost:5000/api/v0/pois/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          areas: data.can_access,
          photo: data.photo,
          desc: data.desc,
          name: data.name,
          type: data.type,
          id: data.id
        });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  deletePOI(id) {
    if (window.confirm("Are you sure?")) {
      fetch(`http://localhost:5000/api/v0/pois/${this.props.match.params.id}`, {
        method: "DELETE",
        header: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      this.setState({
        fireRedirect: true
      });
    }
  }

  render() {
    const { id, name, type, desc, areas, photo } = this.state;
    let hideModal = () =>
      this.setState({
        showModal: false
      });
    return (
      <div>
        <div id="areas" className="container bg-2">
          <h3> POI ID: {id} </h3> <p> Name: {name} </p> <p> Type: {type} </p>
          <p> Description: {desc} </p> <br />
          <ButtonToolbar>
            <Button
              className="mr-2"
              variant="danger"
              onClick={() =>
                this.setState({
                  showModal: true
                })
              }
            >
              Edit POI
            </Button>
            <Button
              className="mr-2"
              variant="danger"
              onClick={() => this.deletePOI(id)}
            >
              Delete POI
            </Button>
          </ButtonToolbar>
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3> Photos: </h3>
            <Photo photo={photo} direction="left"></Photo>
            <div className="row text-center"> </div>
          </div>
        </div>
        <div id="areasConnected" className="container">
          <h3> Location(s): </h3>
          {areas.map(area => (
            <AreaThumbnail
              sid={this.props.match.params.id}
              id={area.id}
              desc={area.desc}
              photo={area.photosphere}
            />
          ))}
          <div className="row text-center"> </div>
        </div>
        <EditPOIModal
          siteid={this.props.match.params.sid}
          id={id}
          desc={desc}
          name={name}
          type={type}
          photo={photo}
          show={this.state.showModal}
          onHide={hideModal}
        />
        {this.state.fireRedirect && (
          <Redirect to={`/site/${this.props.match.params.sid}/poi/`} />
        )}
      </div>
    );
  }
}
