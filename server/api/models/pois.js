"use strict";

var uuid = require("node-uuid");
var _ = require("lodash");
var POI = require("../models/neo4j/poi");

var createPOI = function(session, siteid, name, desc, type, photo) {
  name = name.toUpperCase();
  return session
    .run(
      "MATCH (site:Site) WHERE site.id={siteid} \
        WITH site \
        CREATE (site)-[r:CONTAINS]->(poi:POI {id:{id}, name:{name}, desc:{desc}, type:{type},photo:{photo}}) \
        RETURN poi",
      {
        id: uuid.v4().slice(0, 8),
        name: name,
        desc: desc,
        type: type,
        photo: photo,
        siteid: siteid
      }
    )
    .then(results => {
      return new POI(results.records[0].get("poi"));
    });
};

function _manyPOIs(neo4jResult) {
  return neo4jResult.records.map(r => new POI(r.get("poi")));
}

// get all sites
var getAllBySite = function(session, id) {
  return session
    .run("MATCH (site:Site{id:{id}})-[:CONTAINS]->(poi) \
      RETURN poi", {
      id: id
    })
    .then(result => _manyPOIs(result));
};

// get all sites
var getAllByArea = function(session, id) {
  return session
    .run(
      "MATCH (area:Area{id:{id}})-[:CAN_ACCESS]->(poi) \
        RETURN poi",
      {
        id: id
      }
    )
    .then(result => _manyPOIs(result));
};

// get details of an area
var _singlePOIWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new POI(record.get("poi")));

    result.can_access = _.map(record.get("can_access"), record => {
      return new POI(record);
    });
    result.contains = _.map(record.get("contains"), record => {
      return new POI(record);
    });
    return result;
  } else {
    return null;
  }
};

// get a poi by id
var getById = function(session, id) {
  return session
    .run(
      "MATCH (poi:POI {id:{id}} )\
      OPTIONAL MATCH (p:Area)-[:CAN_ACCESS]->(poi) \
      OPTIONAL MATCH (poi)<-[:CONTAINS]-(w:Site) \
      RETURN DISTINCT poi, \
      collect(DISTINCT p) AS can_access, \
      collect(DISTINCT w) AS contains",
      {
        id: id
      }
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePOIWithDetails(result.records[0]);
      } else {
        throw { message: "area not found", status: 404 };
      }
    });
};

var updatePOIWithNoPhoto = function(session, id, name, type, desc) {
  name = name.toUpperCase();
  return session
    .run(
      "MATCH (poi:POI {id: {id}}) \
      SET poi.name = {name}, poi.type = {type}, \
      poi.desc = {desc}\
      RETURN poi",
      {
        id: id,
        name: name,
        type: type,
        desc: desc
      }
    )
    .then(results => {
      return new POI(results.records[0].get("poi"));
    });
};

var updatePOI = function(session, id, name, type, desc, photo) {
  name = name.toUpperCase();
  return session
    .run(
      "MATCH (poi:POI {id: {id}}) \
      SET poi.name = {name}, poi.type = {type}, \
      poi.desc = {desc}, poi.photo ={photo} \
      RETURN poi",
      {
        id: id,
        name: name,
        type: type,
        desc: desc,
        photo: photo
      }
    )
    .then(results => {
      return new POI(results.records[0].get("poi"));
    });
};

var deletePOI = function(session, id) {
  return session
    .run(
      "MATCH (poi:POI {id: {id}}) \
      DETACH DELETE poi",

      {
        id: id
      }
    )
    .then(results => {
      return results;
    });
};

module.exports = {
  createPOI: createPOI,
  getAllBySite: getAllBySite,
  getAllByArea: getAllByArea,
  getById: getById,
  updatePOI: updatePOI,
  updatePOIWithNoPhoto,
  deletePOI: deletePOI
};
