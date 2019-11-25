// movies.js
var Users = require("../models/users"),
  writeResponse = require("../helpers/response").writeResponse,
  dbUtils = require("../neo4j/dbUtils"),
  _ = require("lodash");
var Site = require("../models/sites");

exports.createSite = function(req, res, next) {
  var username = _.get(req.body, "username");
  var name = _.get(req.body, "name");
  var loc = _.get(req.body, "loc");
  var desc = _.get(req.body, "desc");

  Site.createSite(dbUtils.getSession(req), username, name, loc, desc)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};
