import React, { Component } from "react";
import POIThumbnail from "./POIThumbnail";
import Photo from "./Photo";
import { Redirect } from "react-router";
import { EditAreaModal } from "./modals/EditAreaModal";
import { ButtonToolbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AreasConnected } from "./AreasConnected";

export class AreaDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // areas: [],
      pois: [],
      photosphere: "",
      desc: "",
      id: "",
      poisnearby: [],
      showModal: false,
      fireRedirect: false,
      snackbarmsg: "",
      snackbarOpen: false,
      checked: [1],
      areasconnected: []
    };
  }

  refreshList() {
    fetch(`http://localhost:5000/api/v0/areas/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        var connections = [
          data.northwest[0],
          data.north[0],
          data.northeast[0],
          data.west[0],
          {
            id: data.id,
            photosphere: data.photosphere,
            desc: data.desc
          },
          data.east[0],
          data.southwest[0],
          data.south[0],
          data.southeast[0]
        ];

        // console.log(connections);

        this.setState({
          pois: data.can_access,
          photosphere: data.photosphere,
          desc: data.desc,
          id: data.id,
          poisnearby: data.pois_nearby,
          areasconnected: connections
        });
      });

    // console.log(this.state.poisnearby);
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  deleteArea(id) {
    if (window.confirm("Are you sure?")) {
      fetch(
        `http://localhost:5000/api/v0/areas/${this.props.match.params.id}`,
        {
          method: "DELETE",
          header: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      this.setState({
        fireRedirect: true
      });
    }
  }
  render() {
    const {
      id,
      desc,
      photosphere,
      areas,
      pois,
      poisnearby,
      areasconnected
    } = this.state;
    let hideModal = () =>
      this.setState({
        showModal: false
      });
    return (
      <div>
        <div id="areas" className="container bg-2">
          <Link to={`/site/${this.props.match.params.sid}/area`}>
            <span className="glyphicon glyphicon-chevron-left">
              Back to Areas
            </span>
          </Link>
          <h3> AREA ID: {id} </h3> <p> Description: {desc} </p> <br />
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
              Edit Area
            </Button>
            <Button
              className="mr-2"
              variant="danger"
              onClick={() => this.deleteArea(this.state.id)}
            >
              Delete Area
            </Button>
          </ButtonToolbar>
          <br />
          <Link
            to={`/site/${this.props.match.params.sid}/area/${this.props.match.params.id}/simulatetour`}
            className="btn btn-danger "
          >
            <span className="glyphicon glyphicon-cog"> Simulate Tour</span>
          </Link>
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3> Photospheres </h3>
            <Photo photo={photosphere} direction="left"></Photo>
            <div className="row text-center"> </div>
          </div>
        </div>
        <div id="areasConnected" className="container">
          <h3> Areas Connected (Grid View) </h3>
          <AreasConnected
            areas={areasconnected}
            sid={this.props.match.params.sid}
          />
          <br />
          <Link
            to={`/site/${this.props.match.params.sid}/area/${this.props.match.params.id}/manageareas`}
            className="btn btn-danger "
          >
            <span className="glyphicon glyphicon-cog"> Manage Areas</span>
          </Link>
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3> POIs Contained </h3>
            <div className="row text-center">
              {pois.map(poi => (
                <POIThumbnail
                  key={poi.id}
                  sid={this.props.match.params.sid}
                  id={poi.id}
                  name={poi.name}
                  type={poi.type}
                  desc={poi.desc}
                  photo={poi.photo}
                />
              ))}
            </div>
            <br />
            <Link
              to={`/site/${this.props.match.params.sid}/area/${this.props.match.params.id}/managepois`}
              className="btn btn-danger "
            >
              <span className="glyphicon glyphicon-cog"> Manage POIs</span>
            </Link>
          </div>
        </div>
        {/* <div id="areasConnected" className="container">
          <h3> POIs Nearby </h3>
          <div className="row text-center">
            {poisnearby.map(poi => (
              <POIThumbnail
                sid={this.props.match.params.sid}
                id={poi.id}
                name={poi.name}
                type={poi.type}
                desc={poi.desc}
                photo={poi.photo}
              />
            ))}
          </div>
        </div> */}
        {/* <EditAreaModal
          siteid={this.props.match.params.sid}
          id={id}
          desc={desc}
          photo={photosphere}
          show={this.state.showModal}
          onHide={hideModal}
        /> */}
        {this.state.fireRedirect && (
          <Redirect to={`/site/${this.props.match.params.sid}/area/`} />
        )}
      </div>
    );
  }
}
