var each = require('./utils/each'),
    extend = require('./utils/extend'),
    parseParams = require('./utils/parse-params');

var Emitter = require('component-emitter');

(function(env){
  var initialKeen = typeof env.Keen !== 'undefined' ? env.Keen : undefined;

  function Client(props){
    if (this instanceof Client === false) {
      return new Client(props);
    }
    this.configure(props);

    // Set up event handling
    if (Client.debug) {
      this.on('error', Client.log);
    }
    this.emit('ready');
    Client.emit('client', this);
  }

  Emitter(Client);
  Emitter(Client.prototype);

  extend(Client, {
    debug: false,
    enabled: true,
    // extensions: {
    //   events: [],
    //   collections: {}
    // },
    // helpers: {},
    loaded: false,
    resources: {
      'base'      : '{protocol}://{host}',
      'version'   : '{protocol}://{host}/3.0',
      'projects'  : '{protocol}://{host}/3.0/projects',
      'projectId' : '{protocol}://{host}/3.0/projects/{projectId}'
    },
    utils: {
      'each'        : each,
      'extend'      : extend,
      'parseParams' : parseParams
    },
    version: '__VERSION__'
  });

  Client.log = function(str){
    if (Client.debug && typeof console === 'object') {
      console.log('[Keen]', str);
    }
  };

  Client.noConflict = function(){
    env.Keen = initialKeen;
    return Client;
  };

  Client.prototype.configure = function(obj){
    var config = obj || {};
    this.config = this.config || {
      projectId    : undefined,
      writeKey     : undefined,
      host         : 'api.keen.io',
      protocol     : 'https',
      requestType  : 'jsonp',
      resources    : extend({}, Client.resources)
    };

    // IE<10 request shim
    if ('undefined' !== typeof document && document.all) {
      config.protocol = (document.location.protocol !== 'https:') ? 'http' : 'https';
    }
    if (config.host) {
      config.host.replace(/.*?:\/\//g, '');
    }

    extend(this.config, config);
    return this;
  };

  Client.prototype.masterKey = function(str){
    if (!arguments.length) return this.config.masterKey;
    this.config.masterKey = str ? String(str) : null;
    return this;
  };

  Client.prototype.projectId = function(str){
    if (!arguments.length) return this.config.projectId;
    this.config.projectId = (str ? String(str) : null);
    return this;
  };

  Client.prototype.resources = function(obj){
    if (!arguments.length) return this.config.resources;
    var self = this;
    if (typeof obj === 'object') {
      each(obj, function(value, key){
        self.config.resources[key] = (value ? value : null);
      });
    }
    return self;
  };

  Client.prototype.url = function(name){
    var args = Array.prototype.slice.call(arguments, 1),
        baseUrl = Client.resources.base || '{protocol}://{host}',
        path;

    if (name && typeof name === 'string') {
      if (this.config.resources[name]) {
        path = this.config.resources[name];
      }
      else {
        path = baseUrl + name;
      }
    }
    else {
      path = baseUrl;
    }

    each(this.config, function(value, key){
      if (typeof value !== 'object') {
        path = path.replace('{' + key + '}', value);
      }
    });

    each(args, function(arg, i){
      if (typeof arg === 'string') {
        path += '/' + arg;
      }
      else if (typeof arg === 'object') {
        path += '?';
        each(arg, function(value, key){
          path += key + '=' + value + '&';
        });
        path = path.slice(0, -1);
      }
    });

    return path;
  };

  // Module Definitions
  // --------------------

  // Global
  if (env) {
    env.Keen = Client;
  }

  // CommonJS
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Client;
  }

  // RequireJS
  if (typeof define !== 'undefined' && define.amd) {
    define('keen-Client', [], function(){
      return Client;
    });
  }

}).call(this, typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {});
