
/**
 * Module dependencies
 */

var Batch = require('batch')

/**
 * Base `Strategy' constructor
 *
 * @api public
 * @param {String} name
 */

module.exports = Strategy;
function Strategy (name) {
  if (!(this instanceof Strategy)) {
    return new Strategy(name);
  } else if ('string' != typeof name) {
    throw new TypeError("expecting string");
  }

  this.name = name;
  this.data = null;
  this.ordering = null;
  this.tasks = null;
  this.reset();
}

/**
 * Runs the strategy
 *
 * @api public
 * @param {Function} done
 */

Strategy.prototype.run = function (done) {
  var self = this;
  if ('function' != typeof done) { done = function () {}; }
  this.ordering.map(function (task) {
    return self[task].bind(self);
  }).forEach(function (task) {
    task()
  });
  this.tasks.end(done.bind(this));
  return this;
};

/**
 * Set strategy data
 *
 * @api public
 * @param {MixeD} data
 */

Strategy.prototype.set = function (data) {
  this.data = data || null;
  return this;
};

/**
 * Sets the task ordering.
 * Default: 'before, auth, access, end'
 *
 * @api public
 * @param {Array} ordering
 */

Strategy.prototype.order = function (ordering) {
  if (null == ordering || !Array.isArray(ordering)) {
    return this;
  }
  this.ordering = ordering;
  return this;
};

/**
 * Resets state for strategy
 *
 * @api public
 */

Strategy.prototype.reset = function () {
  this.tasks = new Batch();
  this.tasks.concurrency(1);
  this.order(['setup', 'auth', 'access', 'end']);
  return this;
};

/**
 * Initializes setup task
 *
 * @api public
 */

Strategy.prototype.setup = function () {
  var self = this;
  this.tasks.push(function (next) {
    self._setup(next);
  });
  return this;
};

/**
 * Initializes auth task
 *
 * @api public
 */

Strategy.prototype.auth = function () {
  var self = this;
  this.tasks.push(function (next) {
    self._auth(next);
  });
  return this;
};

/**
 * Initializes access task
 *
 * @api public
 */

Strategy.prototype.access = function () {
  var self = this;
  this.tasks.push(function (next) {
    self._access(next);
  });
  return this;
};

/**
 * Initializes end task
 *
 * @api public
 */

Strategy.prototype.end = function () {
  var self = this;
  this.tasks.push(function (next) {
    self._end(next);
  });
  return this;
};

/**
 * Setup interface method
 *
 * @api private
 */

Strategy.prototype._setup = function (done) {
  throw new TypeError("`_setup()' not implemented");
};

/**
 * Authenticate interface method
 *
 * @api private
 */

Strategy.prototype._auth = function (done) {
  throw new TypeError("`_auth()' not implemented");
};

/**
 * Access interface method
 *
 * @api private
 */

Strategy.prototype._access = function (done) {
  throw new TypeError("`_access()' not implemented");
};

/**
 * End interface method
 *
 * @api private
 */

Strategy.prototype._end = function (done) {
  throw new TypeError("`_end()' not implemented");
};

