"use strict";

var uuid = require("node-uuid");
var _ = require("lodash");
var Site = require("../models/neo4j/site");

var createSite = function(session, username, name, loc, desc) {
  name = name.toUpperCase();
  loc = loc.toUpperCase();
  desc = desc.toLowerCase();
  return session
    .run(
      "CREATE (site:Site {id:{id}, name:{name}, loc:{loc}, desc:{desc}}) \
    WITH site \
    MATCH (user:User) WHERE user.username = {username} \
    CREATE (user)-[r:MANAGES]->(site) \
    RETURN site",

      {
        id: uuid.v4().slice(0, 8),
        name: name,
        loc: loc,
        desc: desc,
        username: username
      }
    )
    .then(results => {
      return new Site(results.records[0].get("site"));
    });
};

var updateSite = function(session, id, name, loc, desc) {
  name = name.toUpperCase();
  loc = loc.toUpperCase();
  desc = desc.toLowerCase();
  return session
    .run(
      "MATCH (site:Site {id: {id}}) \
    SET site.name = {name}, site.loc ={loc}, site.desc= {desc} \
    RETURN site",

      {
        id: id,
        name: name,
        loc: loc,
        desc: desc
      }
    )
    .then(results => {
      return new Site(results.records[0].get("site"));
    });
};

var deleteSite = function(session, id) {
  return session
    .run(
      "MATCH (site:Site {id: {id}}) \
    DETACH DELETE site",

      {
        id: id
      }
    )
    .then(results => {
      return results;
    });
};

// return many sites
function _manySites(neo4jResult) {
  return neo4jResult.records.map(r => new Site(r.get("site")));
}

// get all sites
var getAll = function(session) {
  return session
    .run("MATCH (site:Site) RETURN site")
    .then(result => _manySites(result));
};

// get all sites
var getThree = function(session) {
  return session
    .run("MATCH (site:Site) RETURN site LIMIT 3")
    .then(result => _manySites(result));
};

var _singleSiteWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Site(record.get("site")));

    result.composed_of = _.map(record.get("composed_of"), record => {
      return new Site(record);
    });
    result.contains = _.map(record.get("contains"), record => {
      return new Site(record);
    });
    result.managed_by = _.map(record.get("managed_by"), record => {
      return new Site(record);
    });
    return result;
  } else {
    return null;
  }
};

// get a site by id
var getById = function(session, id) {
  return session
    .run(
      "MATCH (site:Site {id:{id}} )\
    OPTIONAL MATCH (site)-[:COMPOSED_OF]->(d:Area) \
    OPTIONAL MATCH (site)-[:CONTAINS]->(p:POI) \
    OPTIONAL MATCH (site)<-[:MANAGES]-(w:User) \
    RETURN DISTINCT site, \
    collect(DISTINCT d) AS composed_of, \
    collect(DISTINCT p) AS contains, \
    collect(DISTINCT w) AS managed_by",
      {
        id: id
      }
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleSiteWithDetails(result.records[0]);
      } else {
        throw { message: "site not found", status: 404 };
      }
    });
};

module.exports = {
  createSite: createSite,
  getAll: getAll,
  getThree: getThree,
  getById: getById,
  updateSite: updateSite,
  deleteSite: deleteSite
};
