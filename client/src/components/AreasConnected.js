import React, { Component } from "react";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";

export class AreasConnected extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.areas);
    return (
      <div>
        <GridList cellHeight={180} cols={3}>
          {this.props.areas.map(area => (
            <GridListTile cols={1} rows={1}>
              <img
                src={
                  area
                    ? area.photosphere
                    : "http://epncb.oma.be/images/NotAvailable.png"
                }
                alt={area ? area.desc : null}
              />

              {area ? (
                <GridListTileBar
                  title={<span>ID: {area ? area.id : null} </span>}
                  subtitle={<span>Description: {area.desc}</span>}
                  actionIcon={
                    <Link to={`/site/${this.props.sid}/area/${area.id}`}>
                      <IconButton
                        aria-label={`info about ${area.id}`}
                        color="primary"
                      >
                        <span className="glyphicon glyphicon-info-sign"></span>
                      </IconButton>
                    </Link>
                  }
                />
              ) : null}
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}
