
var Strategy = require('./strategy')
  , agent = require('superagent')
  , qs = require('querystring')
  , url = require('url')
  , http = require('http')
  , exec = require('child_process').exec
  , assert = require('assert')

var ENDPOINT = 'https://api.instagram.com/oauth';
var REDIRECT_URI = 'http://localhost:9999/ig/auth';

function InstagramStrategy (id, secret) {
  Strategy.call(this, 'instagram');
  this.id = id;
  this.secret = secret
  this.server = null;
  this.data = null;
}

InstagramStrategy.prototype.__proto__ = Strategy.prototype;

InstagramStrategy.prototype._setup = function (done) {
  done();
};

InstagramStrategy.prototype._auth = function (done) {
  var self = this;
  var server = http.createServer(onrequest);
  var sockets = [];
  var authUrl = (
    ENDPOINT +'/authorize/'+
    '?client_id='+ this.id +
    '&redirect_uri='+ REDIRECT_URI +
    '&response_type=code'
  );

  console.log('opening http://localhost:9999/')
  exec('open http://localhost:9999/', function (err) {
    if (err) { return done(err); }
    server.listen(9999);
  });

  server.on('connection', function (socket) {
    sockets.push(socket);
    socket.setTimeout(1000);
  });

  function onrequest (req, res) {
    if (self.code) { return res.end(); }
    switch (req.url) {
      case '/':
        res.statusCode = 302;
        res.setHeader('Location', authUrl);
        res.end();
        break;

      default:
        self.code = qs.parse(url.parse(req.url).query).code;
        res.setHeader('Connection', 'close');
        res.write('<script> window.close(); </script>');
        res.end();
        server.close(done);
        sockets.forEach(function (socket) {
          socket.destroy();
        });
    }
  }
};

InstagramStrategy.prototype._access = function (done) {
  var self = this;
  agent
  .post(ENDPOINT +'/access_token')
  .type('form')
  .send({
    client_id: this.id,
    client_secret: this.secret,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    code: this.code
  })
  .end(function (err, res) {
    if (err) { return done(err); }
    else if (res.body.code >= 400) {
      err = new Error(res.body.error_message);
      err.name = res.body.error_type;
      err.code = res.body.code;
      return done(err);
    } else {
      self.set(res.body);
      done();
    }
  });
};

InstagramStrategy.prototype._end = function (done) {
  console.log('access token', this.data.access_token);
  done();
};

var strategy = new InstagramStrategy(process.env.ID, process.env.SECRET);

strategy.run(function (err) {
  if (err) {
    console.error('error:', err.stack ? err.stack : err);
    process.exit(1);
  }

  assert(this.data);
});
