// movies.js
var Site = require("../models/sites"),
  writeResponse = require("../helpers/response").writeResponse,
  writeError = require("../helpers/response").writeError,
  loginRequired = require("../middlewares/loginRequired"),
  dbUtils = require("../neo4j/dbUtils"),
  _ = require("lodash");

/**
 * @swagger
 * definition:
 *   Site:
 *     type: object
 *     properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        loc:
 *          type: string
 *        desc:
 *          type: string
 */

// Create a Site

/**
 * @swagger
 * /api/v0/createSite:
 *   post:
 *     tags:
 *     - sites
 *     description: Create a new site
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         type: object
 *         schema:
 *           properties:
 *             username:
 *               type: string
 *             name:
 *               type: string
 *             loc:
 *               type: string
 *             desc:
 *               type: string
 *     responses:
 *       201:
 *         description: Your new site
 *         schema:
 *           $ref: '#/definitions/Site'
 *       400:
 *         description: Error message(s)
 */
exports.createSite = function(req, res, next) {
  var username = _.get(req.body, "username");
  var name = _.get(req.body, "name");
  var loc = _.get(req.body, "loc");
  var desc = _.get(req.body, "desc");

  Site.createSite(dbUtils.getSession(req), username, name, loc, desc)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.updateSite = function(req, res, next) {
  var name = _.get(req.body, "name");
  var loc = _.get(req.body, "loc");
  var desc = _.get(req.body, "desc");

  Site.updateSite(dbUtils.getSession(req), req.params.id, name, loc, desc)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

exports.deleteSite = function(req, res, next) {
  Site.deleteSite(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response, 201))
    .catch(next);
};

// Gets all sites

/**
 * @swagger
 * /api/v0/sites:
 *   get:
 *     tags:
 *     - sites
 *     description: Returns all sites
 *     summary: Returns all sites
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of sites
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Site'
 */

exports.list = function(req, res, next) {
  Site.getAll(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

// Gets all sites
exports.listthree = function(req, res, next) {
  Site.getThree(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

exports.findById = function(req, res, next) {
  Site.getById(dbUtils.getSession(req), req.params.id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

//
