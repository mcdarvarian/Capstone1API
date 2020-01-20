const app = require('./app');
const knex = require('knex');

const { PORT, DATABASE_URL } = require('./config'); //change all TEST_DATABASE_URL TO DATABASE_URL

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});