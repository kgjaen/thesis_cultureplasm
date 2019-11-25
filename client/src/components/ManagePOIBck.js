import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";
import { ConnectPOI } from "./modals/ConnectPOI";

export class ManageAreaPOIs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unrelatedpois: [],
      connectedpois: [],
      desc: "",
      id: "",
      showModal: false
    };
  }

  refreshList() {
    fetch(
      `http://localhost:5000/api/v0/sites/${this.props.match.params.sid}/areas/${this.props.match.params.id}/poirelations`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          unrelatedpois: data.unrelated_pois,
          connectedpois: data.connected_pois,
          desc: data.desc,
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

  removePoi(id) {
    if (window.confirm("Are you sure?")) {
      fetch(
        `http://localhost:5000/api/v0/areas/${this.props.match.params.id}/disconnectpoi`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            poiid: id
          })
        }
      )
        .then(res => res.json())
        .then(
          result => {
            console.log(result);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Successfully disconnected POI."
            });
          },
          error => {
            console.log(error);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Failed to disconnect poi."
            });
          }
        );
    }
  }

  addPoi(id) {
    // if (window.confirm("Are you sure?")) {
    //   fetch(
    //     `http://localhost:5000/api/v0/areas/${this.props.match.params.id}/connectpoi`,
    //     {
    //       method: "PUT",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         poiid: id
    //       })
    //     }
    //   )
    //     .then(res => res.json())
    //     .then(
    //       result => {
    //         console.log(result);
    //         this.setState({
    //           snackbarOpen: true,
    //           snackbarmsg: "Successfully connected POI."
    //         });
    //       },
    //       error => {
    //         console.log(error);
    //         this.setState({
    //           snackbarOpen: true,
    //           snackbarmsg: "Failed to connect poi."
    //         });
    //       }
    //     );
    // }
    // this.setState((showModal: true));
  }

  render() {
    const { unrelatedpois, connectedpois, id, desc } = this.state;
    let hideModal = () =>
      this.setState({
        showModal: false
      });
    return (
      <div>
        <div id="areas" className="container bg-2">
          <h3> AREA ID: {id} </h3> <p> Description: {desc} </p> <br />
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3> POIs Contained </h3>
            <div className="row text-center">
              {connectedpois.map(poi => (
                <div className="col-sm-2">
                  <div className="thumbnail text-center">
                    <Link
                      to={`/site/${this.props.match.params.sid}/poi/${poi.id}`}
                    >
                      <img
                        src={poi.photo}
                        alt="imgUrl"
                        width="400"
                        height="300"
                      />
                      <p>
                        <strong>{poi.name}</strong>
                      </p>
                    </Link>
                    <Button
                      className="mr-2"
                      variant="danger"
                      onClick={() => this.removePoi(poi.id)}
                      size="sm"
                    >
                      Remove
                    </Button>
                    <Snackbar
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      open={this.state.snackbarOpen}
                      autoHideDuration={5000}
                      onClose={this.snackbarClose}
                      message={
                        <span id="message-id">{this.state.snackbarmsg}</span>
                      }
                      action={[
                        <IconButton
                          key="close"
                          arial-label="Close"
                          color="inherit"
                          onClick={this.snackbarClose}
                        >
                          x
                        </IconButton>
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="areas" className="container bg-2">
          <h3> POIS Available </h3>
          <div className="row text-center">
            {unrelatedpois.map(poi => (
              <div className="col-sm-2">
                <div className="thumbnail text-center">
                  <Link
                    to={`/site/${this.props.match.params.sid}/poi/${poi.id}`}
                  >
                    <img
                      src={poi.photo}
                      alt="imgUrl"
                      width="400"
                      height="300"
                    />
                    <p>
                      <strong>{poi.name}</strong>
                    </p>
                  </Link>
                  <Button
                    className="mr-2"
                    variant="danger"
                    // onClick={() => this.addPoi(poi.id)}
                    onClick={() =>
                      this.setState({
                        showModal: true
                      })
                    }
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    onClose={this.snackbarClose}
                    message={
                      <span id="message-id">{this.state.snackbarmsg}</span>
                    }
                    action={[
                      <IconButton
                        key="close"
                        arial-label="Close"
                        color="inherit"
                        onClick={this.snackbarClose}
                      >
                        x
                      </IconButton>
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
          <ConnectPOI
            id={this.props.match.params.id}
            show={this.state.showModal}
            onHide={hideModal}
          />
        </div>
      </div>
    );
  }
}
