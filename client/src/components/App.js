import React from "react";
import Nav from "./Nav";
import "./App.css";
import About from "./About";
import Footer from "./Footer";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Site } from "./Site";
import { SiteDetails } from "./SiteDetails";
import { AreaDetails } from "./AreaDetails";
import { Area } from "./Area";
import { POI } from "./POI";
import { POIDetails } from "./POIDetails";
import { ManageAreaPOIs } from "./ManageAreaPOIs";
import { ManageAreaAreas } from "./ManageAreaAreas";
import { SimulateTour } from "./SimulateTour";

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/site" exact component={Site} />
          <Route path="/site/:id" exact component={SiteDetails} />
          <Route path="/site/:id/area" exact component={Area} />
          <Route path="/site/:sid/area/:id" exact component={AreaDetails} />
          <Route
            path="/site/:sid/area/:id/managepois"
            exact
            component={ManageAreaPOIs}
          />
          <Route
            path="/site/:sid/area/:id/manageareas"
            exact
            component={ManageAreaAreas}
          />
          <Route path="/site/:id/poi" exact component={POI} />
          <Route path="/site/:sid/poi/:id" exact component={POIDetails} />
          <Route
            path="/site/:id/area/:aid/simulatetour"
            exact
            component={SimulateTour}
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
