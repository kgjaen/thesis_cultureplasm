// movies.js
var Area = require("../models/areas"),
  writeResponse = require("../helpers/response").writeResponse,
  writeError = require("../helpers/response").writeError,
  loginRequired = require("../middlewares/loginRequired"),
  dbUtils = require("../neo4j/dbUtils"),
  _ = require("lodash"),
  fileUpload = require("express-fileupload");

// Create an Area
exports.createArea = function(req, res, next) {
  var siteid = _.get(req.body, "siteid");
  var desc = _.get(req.body, "desc");
  var photosphere = _.get(req.body, "psphere");

  Area.createArea(dbUtils.getSession(req), siteid, desc, photosphere)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.updateArea = function(req, res, next) {
  var desc = _.get(req.body, "desc");
  var photosphere = _.get(req.body, "psphere");

  Area.updateArea(dbUtils.getSession(req), req.params.id, desc, photosphere)
    // Area.updateArea(dbUtils.getSession(req), req.params.id, desc)

    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.connectPoi = function(req, res, next) {
  var id = _.get(req.body, "poiid");
  var x = _.get(req.body, "x");
  var y = _.get(req.body, "y");

  Area.connectPoi(dbUtils.getSession(req), req.params.id, id, x, y)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.disconnectPoi = function(req, res, next) {
  var id = _.get(req.body, "poiid");

  Area.disconnectPoi(dbUtils.getSession(req), req.params.id, id)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.connectArea = function(req, res, next) {
  var id = _.get(req.body, "aid");
  var dir = _.get(req.body, "dir");

  Area.connectArea(dbUtils.getSession(req), req.params.id, id, dir)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.disconnectArea = function(req, res, next) {
  var id = _.get(req.body, "aid");

  Area.disconnectArea(dbUtils.getSession(req), req.params.id, id)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

// Gets all areas of a site
exports.list = function(req, res, next) {
  Area.getAll(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// Gets all areas of a site
exports.unrelatedPois = function(req, res, next) {
  Area.unrelatedPois(dbUtils.getSession(req), req.params.id, req.params.aid)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.unrelatedAreas = function(req, res, next) {
  Area.unrelatedAreas(dbUtils.getSession(req), req.params.id, req.params.aid)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.connectedarea = function(req, res, next) {
  Area.connectedarea(dbUtils.getSession(req), req.params.id, req.params.dir)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.getAreaRelations = function(req, res, next) {
  Area.getRelatedAndUnrelatedAreas(
    dbUtils.getSession(req),
    req.params.id,
    req.params.aid
  )
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.getPoiRelations = function(req, res, next) {
  Area.getRelatedAndUnrelatedPOIs(
    dbUtils.getSession(req),
    req.params.id,
    req.params.aid
  )
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findById = function(req, res, next) {
  Area.getById(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.deleteArea = function(req, res, next) {
  Area.deleteArea(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.getPoisNearby = function(req, res, next) {
  Area.getPoisNearby(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.relatedareas = function(req, res, next) {
  Area.relatedareas(dbUtils.getSession(req), req.params.aid)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.getAreaConnected = function(req, res, next) {
  Area.getAreaConnected(
    dbUtils.getSession(req),
    req.params.id,
    req.params.direction
  )
    .then(response => writeResponse(res, response))
    .catch(next);
};
