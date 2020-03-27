'use strict';
const { Client } = require('pg')

const client = new Client({
  // connectionString: connectionString,
  host: 'localhost',
  user: 'postgres',
  password: 'amulu143',
  database: 'yuvi',
  port: 5432,
})
// client.connect();

//self.configureExpress(pool);
client.connect(function (err) {
  if (err) {
    console.log("\n\t *** Cannot establish a connection with the database. ***");
    reconnect(client)
  }
  else {
    console.log("\n\t *** New connection established with the database. ***")
  }
})
// client.end()
function reconnect(connection){
  console.log("\n New connection tentative...");
  //- Destroy the current connection variable
  if(connection) connection.end();
  //- Try to reconnect
  client.connect(function(err){
      if(err) {
          //- Try to connect every 2 seconds.
          setTimeout(reconnect, 2000);
      }else {
          console.log("\n\t *** New connection established with the database. ***")
          return client;
      }
  });
}
// Development specific configuration
// ==================================
module.exports = {
  client,
};