"use strict";

var uuid = require("node-uuid");
var _ = require("lodash");
var Area = require("../models/neo4j/area");
var POI = require("../models/neo4j/poi");
var POIRotation = require("../models/neo4j/poirotation");
var AreaDirection = require("../models/neo4j/areadirection");

var createArea = function(session, siteid, desc, photosphere) {
  desc = desc.toLowerCase();
  return session
    .run(
      "MATCH (site:Site) WHERE site.id={siteid} \
      WITH site \
      CREATE (site)-[r:COMPOSED_OF]->(area:Area {id:{id}, desc:{desc}, photosphere:{photosphere}}) \
      RETURN area",

      {
        id: uuid.v4().slice(0, 8),
        desc: desc,
        photosphere: photosphere,
        siteid: siteid
      }
    )
    .then(results => {
      return new Area(results.records[0].get("area"));
    });
};

// return all areas
function _manyAreas(neo4jResult) {
  return neo4jResult.records.map(r => new Area(r.get("area")));
}

// get all areas of a site
var getAll = function(session, id) {
  return session
    .run("MATCH (site:Site{id:{id}})-[:COMPOSED_OF]->(area) \
    RETURN area", {
      id: id
    })
    .then(result => _manyAreas(result));
};

// get details of an area
var _singleAreaWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Area(record.get("area")));

    result.can_go_to = _.map(record.get("can_go_to"), record => {
      return new Area(record);
    });
    result.can_access = _.map(record.get("can_access"), record => {
      return new POI(record);
    });
    result.position = _.map(record.get("position"), record => {
      return new POIRotation(record);
    });
    result.composed_of = _.map(record.get("composed_of"), record => {
      return new Area(record);
    });
    result.pois_nearby = _.map(record.get("pois_nearby"), record => {
      return new POI(record);
    });
    result.north = _.map(record.get("north"), record => {
      return new Area(record);
    });
    result.south = _.map(record.get("south"), record => {
      return new Area(record);
    });
    result.east = _.map(record.get("east"), record => {
      return new Area(record);
    });
    result.west = _.map(record.get("west"), record => {
      return new Area(record);
    });
    result.northeast = _.map(record.get("northeast"), record => {
      return new Area(record);
    });
    result.northwest = _.map(record.get("northwest"), record => {
      return new Area(record);
    });
    result.southeast = _.map(record.get("southeast"), record => {
      return new Area(record);
    });
    result.southwest = _.map(record.get("southwest"), record => {
      return new Area(record);
    });
    return result;
  } else {
    return null;
  }
};

// get an area by id
var getById = function(session, id) {
  return session
    .run(
      "MATCH (area:Area {id:{id}} ) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO]->(d:Area)  \
      OPTIONAL MATCH (area)-[poiPos:CAN_ACCESS]->(p:POI)  \
      OPTIONAL MATCH (area)<-[:COMPOSED_OF]-(site:Site)  \
      OPTIONAL MATCH (d)-[:CAN_ACCESS]->(b:POI) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{n}}]->(n:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{s}}]->(s:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{e}}]->(e:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{w}}]->(w:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{ne}}]->(ne:Area)   \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{nw}}]->(nw:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{se}}]->(se:Area) \
      OPTIONAL MATCH (area)-[:CAN_GO_TO {dir:{sw}}]->(sw:Area) \
      RETURN DISTINCT area,   \
      collect(DISTINCT d) AS can_go_to,   \
      collect(DISTINCT p) AS can_access, \
      collect(DISTINCT poiPos) AS position, \
      collect(DISTINCT site) AS composed_of, \
      collect(DISTINCT n) AS north, \
      collect(DISTINCT b) AS pois_nearby, \
      collect(DISTINCT s) AS south, \
      collect(DISTINCT e) AS east, \
      collect(DISTINCT w) AS west, \
      collect(DISTINCT se) AS southeast,\
      collect(DISTINCT sw) AS southwest, \
      collect(DISTINCT nw) AS northwest, \
      collect(DISTINCT ne) AS northeast",

      {
        id: id,
        n: "N",
        s: "S",
        e: "E",
        w: "W",
        ne: "NE",
        nw: "NW",
        se: "SE",
        sw: "SW"
      }
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleAreaWithDetails(result.records[0]);
      } else {
        throw { message: "area not found", status: 404 };
      }
    });
};

var relatedareas = function(session, aid) {
  return session
    .run(
      "MATCH (a:Area{id:{aid}})  \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{n}}]->(n:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{s}}]->(s:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{e}}]->(e:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{w}}]->(w:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{ne}}]->(ne:Area)   \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{nw}}]->(nw:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{se}}]->(se:Area) \
      OPTIONAL MATCH (a)-[:CAN_GO_TO {dir:{sw}}]->(sw:Area) \
      RETURN DISTINCT a, n, e, s, w, ne, nw, se , sw",
      {
        aid: aid,
        n: "N",
        s: "S",
        e: "E",
        w: "W",
        ne: "NE",
        nw: "NW",
        se: "SE",
        sw: "SW"
      }
    )
    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _areaRelationsWithDetails(result.records[0]);
      } else {
        throw { message: "area not  found", status: 404 };
      }
    });
};

// get details of an area
var _singleAreaRelationsWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Area(record.get("p")));

    result.unrelated_areas = _.map(record.get("unrelated_areas"), record => {
      return new Area(record);
    });
    result.connected_areas = _.map(record.get("connected_areas"), record => {
      return new Area(record);
    });

    return result;
  } else {
    return null;
  }
};

var getRelatedAndUnrelatedAreas = function(session, sid, id) {
  return session
    .run(
      "MATCH (p:Area{id:{id}})  \
      OPTIONAL MATCH (area:Area)<-[:COMPOSED_OF]-(s:Site{id:{sid}}) \
      WHERE NOT (p)-[:CAN_GO_TO]->(area) AND NOT area.id= {id} \
      OPTIONAL MATCH (p)-[:CAN_GO_TO]->(connected:Area)  \
      RETURN p, collect (DISTINCT area) as unrelated_areas,  \
      collect (DISTINCT connected) as connected_areas",

      {
        id: id,
        sid: sid
      }
    )

    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleAreaRelationsWithDetails(result.records[0]);
      } else {
        throw { message: "area not  found", status: 404 };
      }
    });
};

var _singlePoiRelationsWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Area(record.get("p")));

    result.unrelated_pois = _.map(record.get("unrelated_pois"), record => {
      return new POI(record);
    });
    result.connected_pois = _.map(record.get("connected_pois"), record => {
      return new POI(record);
    });
    return result;
  } else {
    return null;
  }
};

var getRelatedAndUnrelatedPOIs = function(session, sid, id) {
  return session
    .run(
      "MATCH (p:Area{id:{id}})  \
      OPTIONAL MATCH (poi:POI)<-[:CONTAINS]-(s:Site{id:{sid}}) \
      WHERE NOT (poi)-[:CAN_ACCESS]-(p) \
      OPTIONAL MATCH (p)-[:CAN_ACCESS]-(connected:POI)  \
      RETURN p, collect (DISTINCT poi) as unrelated_pois,  \
      collect (DISTINCT connected) as connected_pois",

      {
        id: id,
        sid: sid
      }
    )

    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singlePoiRelationsWithDetails(result.records[0]);
      } else {
        throw { message: "area not  found", status: 404 };
      }
    });
};

var updateArea = function(session, id, desc, photosphere) {
  desc = desc.toLowerCase();
  return session
    .run(
      "MATCH (area:Area {id: {id}}) \
      SET area.desc = {desc}, area.photosphere ={photosphere} \
      RETURN area",

      {
        id: id,
        desc: desc,
        photosphere: photosphere
      }
    )

    .then(results => {
      return new Area(results.records[0].get("area"));
    });
};

var connectedarea = function(session, id, dir) {
  return session
    .run(
      "MATCH (a:Area{id:{id}})-[:CAN_GO_TO{dir:{dir}}]->(area:Area) \
      OPTIONAL MATCH (area)-[r:CAN_ACCESS]->(poi:POI)  \
      RETURN DISTINCT area, collect (DISTINCT r) as rotation, collect (DISTINCT poi) as pois",

      {
        id: id,
        dir: dir
      }
    )

    .then(result => {
      if (!_.isEmpty(result.records)) {
        return _singleConnectedAreaWithDetails(result.records[0]);
      } else {
        throw { message: "Area not  found", status: 404 };
      }
    });
};

var _singleConnectedAreaWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Area(record.get("area")));

    result.pois = _.map(record.get("pois"), record => {
      return new POI(record);
    });

    result.rotations = _.map(record.get("rotation"), record => {
      return new POIRotation(record);
    });

    return result;
  } else {
    return null;
  }
};

var _singlePoiRelationsWithDetails = function(record) {
  if (record.length) {
    var result = {};
    _.extend(result, new Area(record.get("p")));

    result.unrelated_pois = _.map(record.get("unrelated_pois"), record => {
      return new POI(record);
    });
    result.connected_pois = _.map(record.get("connected_pois"), record => {
      return new POI(record);
    });
    return result;
  } else {
    return null;
  }
};

var connectPoi = function(session, id, poiid, x, y) {
  return session
    .run(
      "MATCH (a:Area{id:{id}}), (b:POI{id:{poiid}}) \
      CREATE (a)-[:CAN_ACCESS {x: {x}, y:{y}}]->(b) \
      RETURN b",

      {
        id: id,
        poiid: poiid,
        x: x,
        y: y
      }
    )

    .then(results => {
      return new Area(results.records[0].get("b"));
    });
};

var setOppositeDir = function(dir) {
  var dir2 = "";
  switch (dir) {
    case "N":
      dir2 = "S";
      break;
    case "S":
      dir2 = "N";
      break;
    case "E":
      dir2 = "W";
      break;
    case "W":
      dir2 = "E";
      break;
    case "NE":
      dir2 = "SW";
      break;
    case "SE":
      dir2 = "NW";
      break;
    case "NW":
      dir2 = "SE";
      break;
    case "SW":
      dir2 = "NE";
  }

  return dir2;
};

var connectArea = function(session, id, aid, dir) {
  var dir2 = setOppositeDir(dir);

  return session
    .run(
      "MATCH (a:Area{id:{id}}), (b:Area{id:{aid}}) \
      CREATE (a)-[r:CAN_GO_TO {dir:{dir}}]->(b) \
      CREATE (b)-[n:CAN_GO_TO {dir:{dir2}}]->(a) \
      RETURN a, b",

      {
        id: id,
        aid: aid,
        dir: dir,
        dir2: dir2
      }
    )

    .then(results => {
      return new Area(results.records[0].get("b"));
    });
};

var disconnectPoi = function(session, id, poiid) {
  return session
    .run(
      "MATCH (a:Area{id:{id}})-[r:CAN_ACCESS]->(b:POI{id:{poiid}}) \
      DELETE r",

      {
        id: id,
        poiid: poiid
      }
    )

    .then(results => {
      return results;
    });
};

var disconnectArea = function(session, id, aid) {
  return session
    .run(
      "MATCH (a:Area{id:{id}})-[r:CAN_GO_TO]-(b:Area{id:{aid}}) \
      DELETE r",

      {
        id: id,
        aid: aid
      }
    )

    .then(results => {
      return results;
    });
};

var updateAreaDescOnly = function(session, id, desc) {
  return session
    .run(
      "MATCH (area:Area {id: {id}}) \
      SET area.desc = {desc} \
      RETURN area",

      {
        id: id,
        desc: desc
      }
    )

    .then(results => {
      return new Area(results.records[0].get("area"));
    });
};

var deleteArea = function(session, id) {
  return session
    .run(
      "MATCH (area:Area {id: {id}}) \
    DETACH DELETE area",

      {
        id: id
      }
    )
    .then(results => {
      return results;
    });
};

function _manyPOIs(neo4jResult) {
  return neo4jResult.records.map(r => new POI(r.get("poi")));
}

// get all sites
var getPoisNearby = function(session, id) {
  return session
    .run(
      "MATCH (area:Area{id:{id}})-[:CAN_GO_TO]-(connectedarea:Area) \
    OPTIONAL MATCH (connectedarea)-[:CAN_ACCESS]->(poi:POI) \
    RETURN DISTINCT poi",
      {
        id: id
      }
    )
    .then(result => _manyPOIs(result));
};

var unrelatedPois = function(session, sid, aid) {
  return session
    .run(
      "MATCH (poi:POI)<-[:CONTAINS]-(s:Site{id:{sid}}) \
      WHERE NOT (poi)<-[:CAN_ACCESS]-(:Area{id:{aid}}) \
      RETURN poi",
      {
        sid: sid,
        aid: aid
      }
    )
    .then(result => _manyPOIs(result));
};

var unrelatedAreas = function(session, sid, aid) {
  return session
    .run(
      "MATCH (area:Area)<-[:COMPOSED_OF]-(s:Site{id:{sid}}) \
      WHERE NOT (area)-[:CAN_GO_TO]-(:Area{id:{aid}}) AND NOT area.id={aid} \
      RETURN area",
      {
        sid: sid,
        aid: aid
      }
    )
    .then(result => _manyAreas(result));
};

module.exports = {
  createArea: createArea,
  getAll: getAll,
  getById: getById,
  getPoisNearby: getPoisNearby,
  updateAreaDescOnly: updateAreaDescOnly,
  updateArea: updateArea,
  deleteArea: deleteArea,
  connectPoi: connectPoi,
  disconnectPoi: disconnectPoi,
  unrelatedPois: unrelatedPois,
  connectArea: connectArea,
  disconnectArea: disconnectArea,
  unrelatedAreas: unrelatedAreas,
  getRelatedAndUnrelatedAreas: getRelatedAndUnrelatedAreas,
  getRelatedAndUnrelatedPOIs: getRelatedAndUnrelatedPOIs,
  relatedareas: relatedareas,
  connectedarea: connectedarea
};
