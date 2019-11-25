import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";
import "../App.css";
import { storage } from "../../firebase";

export class AddAreaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      snackbarmsg: "",
      photosphere: "",
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
    this.setState({ photosphere: event.target.files[0] });
  };

  handleUpload(event) {
    event.preventDefault();

    const { photosphere } = this.state;
    const uploadTask = storage
      .ref(`${this.props.siteid}/areas/${photosphere.name}`)
      .put(photosphere);

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
          .ref(`${this.props.siteid}/areas`)
          .child(photosphere.name)
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
    fetch("http://localhost:5000/api/v0/areas", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        siteid: this.props.siteid,
        desc: event.target.areaDesc.value,
        psphere: this.state.ps_url
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            snackbarOpen: true,
            snackbarmsg: "Successfully added area."
          });
        },
        error => {
          // alert("Adding " + event.target.siteName.value + " site failed!");
          this.setState({
            snackbarOpen: true,
            snackbarmsg: "Failed to add an area."
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
              onClick={this.snackbarClose}
            >
              x
            </IconButton>
          ]}
        />
        <Modal
          {...this.props}
          aria-labelledby="contained-modal-title-vcenter"
          size="lg"
          style={{ opacity: 1 }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Area
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
                    <Form.Group controlId="AreaDescription">
                      <Form.Label> Area Description: </Form.Label>
                      <Form.Control
                        type="text"
                        name="areaDesc"
                        required
                        placeholder="Enter description of area"
                      />
                    </Form.Group>
                    <label className="custom-file-label" htmlFor="left">
                      Photosphere
                    </label>
                    <input
                      type="file"
                      className="custom-file-input"
                      id="left"
                      required
                      onChange={this.onChange}
                    />
                    <button onClick={this.handleUpload}>
                      Upload Photosphere
                    </button>
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
                        Add Area
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
