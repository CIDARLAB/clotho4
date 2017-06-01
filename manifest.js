'use strict';
const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
  env: process.env.NODE_ENV
};


const manifest = {
  $meta: 'This file defines the plot device.',
  server: {
    debug: {
      request: ['error']
    },
    connections: {
      routes: {
        security: true
      }
    }
  },
  connections: [{
    port: Config.get('/port/web'),
    labels: ['web']
  }],
  registrations: [
    {
      plugin: 'hapi-auth-basic'
    },
    {
      plugin: 'lout'
    },
    {
      plugin: 'inert'
    },
    {
      plugin: 'vision'
    },
    {
      plugin: {
        register: 'visionary',
        options: {
          engines: {handlebars: 'handlebars'},
          path: './server/web'
        }
      }
    },
    {
      plugin: {
        register: 'hapi-mongo-models',
        options: {
          mongodb: Config.get('/hapiMongoModels/mongodb'),
          models: {
            Account: './server/models/account',
            AdminGroup: './server/models/admin-group',
            Admin: './server/models/admin',
            Annotation: './server/models/annotation',
            Assembly: './server/models/assembly',
            AuthAttempt: './server/models/auth-attempt',
            BasicModules: './server/models/basic-module',
            BioDesign: './server/models/bio-design',
            CompositeModule: './server/models/composite-module',
            Feature: './server/models/feature',
            Part: './server/models/part',
            Sequence: './server/models/sequence',
            Session: './server/models/session',
            User: './server/models/user'
          },
          autoIndex: Config.get('/hapiMongoModels/autoIndex')
        }
      }
    },
    {
      plugin: './server/auth'
    },
    {
      plugin: './server/mailer'
    },
    {
      plugin: './server/api/accounts',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/admin-groups',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/admins',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/auth-attempts',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/contact',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/index',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/login',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/logout',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/sequences',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/sessions',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/signup',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/api/users',
      options: {
        routes: {prefix: '/api'}
      }
    },
    {
      plugin: './server/web/index'
    }
  ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

  return store.get(key, criteria);
};


exports.meta = function (key) {

  return store.meta(key, criteria);
};
