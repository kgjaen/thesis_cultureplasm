import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";
import "../App.css";
import { storage } from "../../firebase";

export class AddPOIModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      snackbarmsg: "",
      type: "Painting",
      photo: "",
      ps_url: "",
      progress: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  snackbarClose = event => {
    this.setState({ snackbarOpen: false });
  };

  onChange = event => {
    this.setState({ photo: event.target.files[0] });
  };

  onTypeChange = event => {
    this.setState({ type: event.target.value });
  };

  handleUpload(event) {
    event.preventDefault();

    const { photo } = this.state;
    const uploadTask = storage
      .ref(`${this.props.siteid}/pois/${photo.name}`)
      .put(photo);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {},
      () => {
        storage
          .ref(`${this.props.siteid}/pois`)
          .child(photo.name)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            this.setState({ ps_url: url });
          });
      }
    );

    console.log("URL" + this.state.ps_url);
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/v0/pois", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        siteid: this.props.siteid,
        name: event.target.poiName.value,
        desc: event.target.poiDesc.value,
        type: this.state.type,
        photo: this.state.ps_url
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            snackbarOpen: true,
            snackbarmsg: "Successfully added poi."
          });
        },
        error => {
          // alert("Adding " + event.target.siteName.value + " site failed!");
          this.setState({
            snackbarOpen: true,
            snackbarmsg: "Failed to add poi."
          });
        }
      );
  }

  render() {
    return (
      <div className="container">
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snackbarOpen}
          autoHideDuration={5000}
          onClose={this.snackbarClose}
          message={<span id="message-id">{this.state.snackbarmsg}</span>}
          action={[
            <IconButton
              key="close"
              arial-label="Close"
              color="inherit"
              onclick={this.snackbarClose}
            >
              x
            </IconButton>
          ]}
        />
        <Modal
          {...this.props}
          aria-labelledby="contained-modal-title-vcenter"
          size="lg"
          centered
          style={{ opacity: 1 }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add POI
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              maxHeight: "calc(100vh)",
              overflowY: "auto"
            }}
          >
            <div className="container">
              <Row>
                <Col sm={6}>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="POIName">
                      <Form.Label> Name: </Form.Label>
                      <Form.Control
                        type="text"
                        name="poiName"
                        required
                        placeholder="Enter name of POI"
                      />
                    </Form.Group>
                    <Form.Group controlId="POIDescription">
                      <Form.Label> POI Description: </Form.Label>
                      <Form.Control
                        type="text"
                        name="poiDesc"
                        required
                        placeholder="Enter description of POI"
                      />
                    </Form.Group>

                    <label>Type: </label>
                    <select
                      value={this.state.type}
                      onChange={this.onTypeChange}
                    >
                      <option selected value="Painting">
                        Painting
                      </option>
                      <option value="Artifact"> Artifact </option>
                      <option value="Clothes"> Sculpture </option>
                      <option value="Furniture"> Furniture </option>
                      <option value="Photo"> Photo </option>
                      <option value="Book"> Book </option>
                      <option value="Clothes"> Clothes </option>
                    </select>
                    <br />
                    <label className="custom-file-label" htmlFor="left">
                      File
                    </label>
                    <input
                      type="file"
                      className="custom-file-input"
                      id="left"
                      required
                      onChange={this.onChange}
                    />
                    <button onClick={this.handleUpload}>Upload File</button>
                    <br />
                    <span> Progress: </span>
                    <progress value={this.state.progress} max="100" />
                    <br />
                    <img
                      src={
                        this.state.ps_url ||
                        "http://via.placeholder.com/400x300"
                      }
                      alt="Photosphere"
                      height="300"
                      width="400"
                    />
                    <br />
                    <br />
                    <Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={this.props.onHide}
                      >
                        Add POI
                      </Button>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
            </div>{" "}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
