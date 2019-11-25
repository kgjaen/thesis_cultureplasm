// extracts just the data from the query results

var _ = require("lodash");

var AreaDirection = (module.exports = function(_node) {
  _.extend(this, _node.properties);
});
