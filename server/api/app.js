var express = require("express"),
  path = require("path"),
  routes = require("./routes"),
  nconf = require("./config"),
  swaggerJSDoc = require("swagger-jsdoc"),
  methodOverride = require("method-override"),
  errorHandler = require("errorhandler"),
  bodyParser = require("body-parser"),
  setAuthUser = require("./middlewares/setAuthUser"),
  neo4jSessionCleanup = require("./middlewares/neo4jSessionCleanup"),
  writeError = require("./helpers/response").writeError,
  fileUpload = require("express-fileupload");

var app = express(),
  api = express();

app.use(nconf.get("api_path"), api);

var swaggerDefinition = {
  info: {
    title: "Cultureplasm API",
    version: "1.0.0",
    description: ""
  },
  host: "localhost:5000",
  basePath: "/"
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ["./routes/*.js"]
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
api.get("/swagger.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/docs", express.static(path.join(__dirname, "swaggerui")));
app.set("port", nconf.get("PORT"));

api.use(bodyParser.json());
api.use(methodOverride());

//enable CORS
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//api custom middlewares:
api.use(setAuthUser);
api.use(neo4jSessionCleanup);
api.use(fileUpload());

//SITE ROUTES
api.post("/sites", routes.sites.createSite);
api.get("/sites", routes.sites.list);
api.get("/sites/three", routes.sites.listthree);
api.get("/sites/:id", routes.sites.findById);
api.put("/sites/:id", routes.sites.updateSite);
api.delete("/sites/:id", routes.sites.deleteSite);

// AREA ROUTES
api.post("/areas", routes.areas.createArea);
api.get("/sites/:id/areas", routes.areas.list);
api.get("/areas/:id", routes.areas.findById);
api.get("/areas/:id/connectedarea/:dir", routes.areas.connectedarea);
api.get("/areas/:id/poisnearby/", routes.areas.getPoisNearby);
api.put("/areas/:id", routes.areas.updateArea);
api.put("/areas/:id/connectpoi/", routes.areas.connectPoi);
api.put("/areas/:id/disconnectpoi/", routes.areas.disconnectPoi);
api.put("/areas/:id/connectarea/", routes.areas.connectArea);
api.put("/areas/:id/disconnectarea/", routes.areas.disconnectArea);
api.get("/sites/:id/areas/:aid/arearelations/", routes.areas.getAreaRelations);
api.get("/sites/:id/areas/:aid/poirelations/", routes.areas.getPoiRelations);

api.get("/sites/:id/areas/:aid/unrelatedareas", routes.areas.unrelatedAreas); //get all unrelated area
api.get("/sites/:id/areas/:aid/unrelatedpois", routes.areas.unrelatedPois); //get all unrelated pois
api.get("/areas/:aid/relatedareas", routes.areas.relatedareas);
api.delete("/areas/:id", routes.areas.deleteArea);

// POI ROUTES
api.post("/pois", routes.pois.createPOI);
api.get("/sites/:id/pois", routes.pois.listSitePOI);
api.get("/areas/:id/pois", routes.pois.listAreaPOI);
api.get("/pois/:id", routes.pois.findById);
api.put("/pois/:id", routes.pois.updatePOI);
api.delete("/pois/:id", routes.pois.deletePOI);

//api error handler
api.use(function(err, req, res, next) {
  if (err && err.status) {
    writeError(res, err);
  } else next(err);
});

app.listen(app.get("port"), () => {
  console.log(
    "Express server listening on port " + app.get("port") + " see docs at /docs"
  );
});
