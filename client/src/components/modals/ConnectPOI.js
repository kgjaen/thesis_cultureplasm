import React, { Component } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Snackbar from "@material-ui/core/SnackBar";
import IconButton from "@material-ui/core/IconButton";
import "../App.css";
import { storage } from "../../firebase";

export class ConnectPOI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   snackbarOpen: false,
      //   snackbarmsg: "",
      //   type: "Painting",
      //   photo: "",
      //   ps_url: "",
      //   progress: 0
      photosphere: "",
      rotation: "",
      rotation: ""
    };
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  refreshList() {
    fetch(`http://localhost:5000/api/v0/areas/${this.props.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          photosphere: "https://cors-anywhere.herokuapp.com/" + data.photosphere
        });
      });
    console.log("HELLo");
    console.log(this.state.photosphere);
  }

  //   onTypeChange = event => {
  //     this.setState({ type: event.target.value });
  //   };
  onChangeRotation = event => {
    this.setState({
      rotation: event.target.getAttribute("rotation")
    });

    console.log("ROTATION: " + this.state.rotation);
  };
  //   snackbarClose = event => {
  //     this.setState({ snackbarOpen: false });
  //   };

  //   onChange = event => {
  //     this.setState({ photo: event.target.files[0] });
  //   };

  //   onTypeChange = event => {
  //     this.setState({ type: event.target.value });
  //   };

  //   handleUpload(event) {
  //     event.preventDefault();

  //     const { photo } = this.state;
  //     const uploadTask = storage
  //       .ref(`${this.props.siteid}/pois/${photo.name}`)
  //       .put(photo);

  //     uploadTask.on(
  //       "state_changed",
  //       snapshot => {
  //         const progress = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         this.setState({ progress });
  //       },
  //       error => {},
  //       () => {
  //         storage
  //           .ref(`${this.props.siteid}/pois`)
  //           .child(photo.name)
  //           .getDownloadURL()
  //           .then(url => {
  //             console.log(url);
  //             this.setState({ ps_url: url });
  //           });
  //       }
  //     );

  //     console.log("URL" + this.state.ps_url);
  //   }

  //   handleSubmit(event) {
  //     event.preventDefault();

  //     fetch("http://localhost:5000/api/v0/pois", {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         siteid: this.props.siteid,
  //         name: event.target.poiName.value,
  //         desc: event.target.poiDesc.value,
  //         type: this.state.type,
  //         photo: this.state.ps_url
  //       })
  //     })
  //       .then(res => res.json())
  //       .then(
  //         result => {
  //           this.setState({
  //             snackbarOpen: true,
  //             snackbarmsg: "Successfully added poi."
  //           });
  //         },
  //         error => {
  //           // alert("Adding " + event.target.siteName.value + " site failed!");
  //           this.setState({
  //             snackbarOpen: true,
  //             snackbarmsg: "Failed to add poi."
  //           });
  //         }
  //       );
  //   }

  componentDidMount() {
    this.refreshList();
  }

  //   componentDidUpdate() {
  //     this.refreshList();
  //   }

  render() {
    return (
      <div className="container">
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
            <a-scene embedded>
              <a-assets>
                <img
                  id="sky"
                  crossOrigin="autonomous"
                  src={this.state.photosphere}
                />
              </a-assets>
              <a-sky id="asky" src="#sky"></a-sky>
              <a-entity id="rig" rotation={this.state.x}>
                <a-camera id="camera">
                  <a-cursor></a-cursor>
                </a-camera>
              </a-entity>
            </a-scene>

            <Button variant="primary" type="submit" onClick={this.props.onHide}>
              Add POI
            </Button>
            <Button
              variant="primary"
              type="submit"
              onclick={window.alert(document.getElementById("asky").src)}
            >
              Check src
            </Button>
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
