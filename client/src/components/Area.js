import React, { Component } from "react";
import AreaThumbnail from "./AreaThumbnail";
import "./App.css";
import { ButtonToolbar, Button } from "react-bootstrap";
import { AddAreaModal } from "./modals/AddAreaModal";
import { Link } from "react-router-dom";

export class Area extends Component {
  constructor(props) {
    super(props);
    this.state = { areas: [], showModal: false };
  }

  refreshList() {
    fetch(
      `http://localhost:5000/api/v0/sites/${this.props.match.params.id}/areas`
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ areas: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  render() {
    const { areas } = this.state;
    let hideModal = () => this.setState({ showModal: false });
    return (
      <div id="areas" className="container bg-2">
        <Link to={`/site/${this.props.match.params.id}/`}>
          <span className="glyphicon glyphicon-chevron-left">
            Back to Areas
          </span>
        </Link>
        <h3>AREAS</h3>
        <div className="row text-center">
          {areas.map(area => (
            <AreaThumbnail
              sid={this.props.match.params.id}
              id={area.id}
              desc={area.desc}
              photo={area.photosphere}
            />
          ))}
        </div>
        <ButtonToolbar>
          <Button
            variant="primary"
            onClick={() => this.setState({ showModal: true })}
          >
            Add Area
          </Button>
          <AddAreaModal
            show={this.state.showModal}
            onHide={hideModal}
            siteid={`${this.props.match.params.id}`}
          />
        </ButtonToolbar>
      </div>
    );
  }
}
