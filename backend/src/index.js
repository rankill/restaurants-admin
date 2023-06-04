const { port } = require('./config/config');
const app = require('./config/app');
const db = require('./config/db');

// open mongoose connection
db.connect();

// listen to requests
app.listen(port, () => console.log(`server started on port ${port}`));

