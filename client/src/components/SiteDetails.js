import React, { Component } from "react";
import AreaThumbnail from "./AreaThumbnail";
import POIThumbnail from "./POIThumbnail";
import { Link } from "react-router-dom";
import { ButtonToolbar, Button } from "react-bootstrap";
import { EditSiteModal } from "./modals/EditSiteModal";
import { Redirect } from "react-router";

export class SiteDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      pois: [],
      name: "",
      loc: "",
      desc: "",
      id: "",
      showModal: false,
      fireRedirect: false
    };
  }

  refreshList() {
    fetch(`http://localhost:5000/api/v0/sites/${this.props.match.params.id}`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          areas: data.composed_of,
          pois: data.contains,
          name: data.name,
          loc: data.loc,
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

  deleteSite(id) {
    if (window.confirm("Are you sure?")) {
      fetch(
        `http://localhost:5000/api/v0/sites/${this.props.match.params.id}`,
        {
          method: "DELETE",
          header: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      this.setState({ fireRedirect: true });
    }
  }

  render() {
    let hideModal = () => this.setState({ showModal: false });
    return (
      <div>
        <div id="general" className="bg-1">
          <div className="container text-center">
            <h3 key={this.state.id} className="text-center">
              {this.state.name}
            </h3>
            <p>
              <em>{this.state.loc}</em>
            </p>
            <p>
              <em>{this.state.desc}</em>
            </p>
            <br />

            <ButtonToolbar>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.setState({ showModal: true })}
              >
                Edit Site
              </Button>
              <Button
                className="mr-2"
                variant="danger"
                onClick={() => this.deleteSite(this.state.id)}
              >
                Delete Site
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div id="areas" className="container bg-2">
          <h3>AREAS</h3>
          <div className="row text-center">
            {this.state.areas.map(area => (
              <AreaThumbnail
                key={area.id}
                sid={this.props.match.params.id}
                id={area.id}
                desc={area.desc}
                photo={area.photosphere}
              />
            ))}
          </div>
          <div className="text-right">
            <Link to={`/site/${this.props.match.params.id}/area`}>
              <span>View All Areas</span>
              <span className="glyphicon glyphicon-menu-right"></span>
            </Link>
          </div>
        </div>
        <div id="pois" className="bg-1">
          <div className="container">
            <h3>POINTS OF INTEREST</h3>
            <div className="row text-center">
              {this.state.pois.map(poi => (
                <POIThumbnail
                  key={poi.id}
                  sid={this.props.match.params.id}
                  id={poi.id}
                  name={poi.name}
                  type={poi.type}
                  desc={poi.desc}
                  photo={poi.photo}
                  siteid={this.state.id}
                />
              ))}
            </div>
            <div className="text-right">
              <Link to={`/site/${this.props.match.params.id}/poi`}>
                <span>View All POIs</span>
                <span className="glyphicon glyphicon-menu-right"></span>
              </Link>
            </div>
            <EditSiteModal
              id={this.state.id}
              name={this.state.name}
              loc={this.state.loc}
              desc={this.state.desc}
              show={this.state.showModal}
              onHide={hideModal}
            />
            {this.state.fireRedirect && <Redirect to={"/site"} />}
          </div>
        </div>
      </div>
    );
  }
}
