import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";

export class ManageAreaAreas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unrelatedareas: [],
      connectedareas: [],
      desc: "",
      id: "",
      dir: "N"
    };
  }

  refreshList() {
    fetch(
      `http://localhost:5000/api/v0/sites/${this.props.match.params.sid}/areas/${this.props.match.params.id}/arearelations`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          id: data.id,
          desc: data.desc,
          unrelatedareas: data.unrelated_areas,
          connectedareas: data.connected_areas
        });
      });
  }

  onTypeChange = event => {
    this.setState({ dir: event.target.value });
    console.log(this.state.dir);
  };

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  removeArea(id) {
    if (window.confirm("Are you sure?")) {
      fetch(
        `http://localhost:5000/api/v0/areas/${this.props.match.params.id}/disconnectarea`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            aid: id
          })
        }
      )
        .then(res => res.json())
        .then(
          result => {
            console.log(result);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Successfully disconnected area."
            });
          },
          error => {
            console.log(error);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Failed to disconnect area."
            });
          }
        );
    }
  }

  addArea(id) {
    if (window.confirm("Are you sure?")) {
      fetch(
        `http://localhost:5000/api/v0/areas/${this.props.match.params.id}/connectarea`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            aid: id,
            dir: this.state.dir
          })
        }
      )
        .then(res => res.json())
        .then(
          result => {
            console.log(result);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Successfully connected area."
            });
          },
          error => {
            console.log(error);
            this.setState({
              snackbarOpen: true,
              snackbarmsg: "Failed to connect area."
            });
          }
        );
    }
  }

  render() {
    const { unrelatedareas, connectedareas, id, desc } = this.state;

    return (
      <div>
        <div id="areas" className="container bg-2">
          <Link
            to={`/site/${this.props.match.params.sid}/area/${this.props.match.params.id}`}
          >
            <span className="glyphicon glyphicon-chevron-left">
              Back to Area Details
            </span>
          </Link>
          <h3> AREA ID: {id} </h3> <p> Description: {desc} </p> <br />
        </div>
        <div id="photospheres" className="bg-1">
          <div className="container">
            <h3> Areas Connected </h3>
            <div className="row text-center">
              {connectedareas.map(area => (
                <div className="col-sm-2">
                  <div className="thumbnail text-center">
                    <Link
                      to={`/site/${this.props.match.params.sid}/area/${area.id}`}
                    >
                      <img
                        src={area.photosphere}
                        alt="imgUrl"
                        width="400"
                        height="300"
                      />
                      <p>
                        <strong>{area.desc}</strong>
                      </p>
                    </Link>
                    <Button
                      className="mr-2"
                      variant="danger"
                      onClick={() => this.removeArea(area.id)}
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
          <h3> Areas Available </h3>
          <form>
            <label>Direction: </label>
            <select value={this.state.type} onChange={this.onTypeChange}>
              <option selected value="N">
                North
              </option>
              <option value="S"> South </option>
              <option value="E"> East </option>
              <option value="W"> West </option>
              <option value="NE"> Northeast </option>
              <option value="NW"> Northwest </option>
              <option value="SE"> Southeast </option>
              <option value="SW"> Southwest </option>
            </select>
          </form>
          <div className="row text-center">
            {unrelatedareas.map(area => (
              <div className="col-sm-2">
                <div className="thumbnail text-center">
                  <Link
                    to={`/site/${this.props.match.params.sid}/area/${area.id}`}
                  >
                    <img
                      src={area.photosphere}
                      alt="imgUrl"
                      width="400"
                      height="300"
                    />
                    <p>
                      <strong>{area.id}</strong>
                    </p>
                  </Link>
                  <Button
                    className="mr-2"
                    variant="danger"
                    onClick={() => this.addArea(area.id)}
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
        </div>
      </div>
    );
  }
}
