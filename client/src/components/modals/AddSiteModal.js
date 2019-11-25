import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";
import "../App.css";

export class AddSiteModal extends Component {
  constructor(props) {
    super(props);
    this.state = { snackbarOpen: false, snackbarmsg: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  snackbarClose = event => {
    this.setState({ snackbarOpen: false });
  };
  handleSubmit(event) {
    event.preventDefault();
    // alert(event.target.siteName.value);
    fetch("http://localhost:5000/api/v0/sites", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "kgjaen",
        name: event.target.siteName.value,
        loc: event.target.siteLoc.value,
        desc: event.target.siteDesc.value
      })
    })
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            snackbarOpen: true,
            snackbarmsg: "Successfully added site " + result.name + "!"
          });
        },
        error => {
          // alert("Adding " + event.target.siteName.value + " site failed!");
          this.setState({
            snackbarOpen: true,
            snackbarmsg:
              "Failed to add " + event.target.siteName.value + " site"
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
              Add Site
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <Row>
                <Col sm={6}>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="SiteName">
                      <Form.Label> Site Name: </Form.Label>
                      <Form.Control
                        type="text"
                        name="siteName"
                        required
                        placeholder="Enter name of site"
                      />
                    </Form.Group>
                    <Form.Group controlId="SiteLocation">
                      <Form.Label> Site Location: </Form.Label>
                      <Form.Control
                        type="text"
                        name="siteLoc"
                        required
                        placeholder="Enter location of site"
                      />
                    </Form.Group>
                    <Form.Group controlId="SiteDescription">
                      <Form.Label> Site Description: </Form.Label>
                      <Form.Control
                        type="text"
                        name="siteDesc"
                        required
                        placeholder="Enter description of site"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        onClick={this.props.onHide}
                      >
                        Add Site
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