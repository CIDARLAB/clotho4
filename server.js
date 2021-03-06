'use strict';
const Composer = require('./index');
const User = require('./server/models/user');
Composer((err, server) => {

  if (err) {
    throw err;
  }

  server.start(() => {

    console.warn('Started the plot device on port ' + server.info.port);

    User.findOne({username:'root'}, (err, user) => {

      if(err) {
        console.error(err);
      }

      if(user === null) {
        console.warn('Please go to /setup to finish installation');
      }
    });
  });
});
