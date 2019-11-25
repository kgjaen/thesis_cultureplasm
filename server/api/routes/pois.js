// movies.js
var POI = require("../models/pois"),
  writeResponse = require("../helpers/response").writeResponse,
  dbUtils = require("../neo4j/dbUtils"),
  _ = require("lodash");

/**
 * @swagger
 * definition:
 *   POI:
 *     type: object
 *     properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        type:
 *          type: string
 *        desc:
 *          type: string
 *        photo:
 *          type: string
 */

// Create a POI
exports.createPOI = function(req, res, next) {
  var siteid = _.get(req.body, "siteid");
  var name = _.get(req.body, "name");
  var desc = _.get(req.body, "desc");
  var type = _.get(req.body, "type");
  var photo = _.get(req.body, "photo");

  POI.createPOI(dbUtils.getSession(req), siteid, name, desc, type, photo)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

/**
 * @swagger
 * /api/v0/sites/:id/pois:
 *   get:
 *     tags:
 *     - pois
 *     description: Returns all pois
 *     summary: Returns all pois
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: site id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A list of pois
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/POI'
 */
// Gets all pois of a site
exports.listSitePOI = function(req, res, next) {
  POI.getAllBySite(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

// Gets all pois of an area
exports.listAreaPOI = function(req, res, next) {
  POI.getAllByArea(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findById = function(req, res, next) {
  POI.getById(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.updatePOI = function(req, res, next) {
  var name = _.get(req.body, "name");
  var type = _.get(req.body, "type");
  var desc = _.get(req.body, "desc");
  var photo = _.get(req.body, "photo");

  POI.updatePOI(dbUtils.getSession(req), req.params.id, name, type, desc, photo)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.deletePOI = function(req, res, next) {
  POI.deletePOI(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};
