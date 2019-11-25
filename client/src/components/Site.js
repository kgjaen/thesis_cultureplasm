import React, { Component } from "react";
import SiteThumbnail from "./SiteThumbnail";
import "./App.css";
import { ButtonToolbar, Button } from "react-bootstrap";
import { AddSiteModal } from "./modals/AddSiteModal";

export class Site extends Component {
  constructor(props) {
    super(props);
    this.state = { sites: [], showModal: false };
  }

  refreshList() {
    fetch("http://localhost:5000/api/v0/sites")
      .then(response => response.json())
      .then(data => {
        this.setState({ sites: data });
      });
  }

  componentDidMount() {
    this.refreshList();
  }

  componentDidUpdate() {
    this.refreshList();
  }

  render() {
    const { sites } = this.state;
    let hideModal = () => this.setState({ showModal: false });
    return (
      <div id="sites" className="container bg-2">
        <h3>YOUR SITES</h3>
        <div className="row text-center">
          {sites.map(site => (
            <SiteThumbnail
              key={site.id}
              id={site.id}
              name={site.name}
              loc={site.loc}
              desc={site.desc}
            />
          ))}
        </div>

        <ButtonToolbar>
          <Button
            variant="primary"
            onClick={() => this.setState({ showModal: true })}
          >
            Add Site
          </Button>

          <AddSiteModal show={this.state.showModal} onHide={hideModal} />
        </ButtonToolbar>
      </div>
    );
  }
}
