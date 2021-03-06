var {Pool, types} = require('pg');

/*
class Database {
  constructor(){
    this._pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'jobsnstuff',
      password: 'password',
      port: 5432,
    });

    this._pool.on('error', (err, client)=>{
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });
  }

  query(query, ...args){
    this._pool.connect((err, client, done)=>{
      if(err) throw err;
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];

      client.query(query, params, (err, res)=>{
          done();
          if(err){
            console.log(err.stack);
            return callback({error: 'Database error.'}, null);
          }
          callback({}, res.rows);
      });
    });
  }

  end(){
    this._pool.end();
  }
}

module.exports = new Database();
*/
const TYPE_DATESTAMP = 1082;
types.setTypeParser(TYPE_DATESTAMP, date => date);
types.setTypeParser(20, 'text', parseInt) //COUNT IN POSTGRESQL RETURNS BIGINT WHICH JAVASCRIPT DOES NOT SUPPORT, CHANGE PARSER TO RETURN JAVASCRIPT INT


const productionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const developmentPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employmee_development',
  password: 'password',
  port: 5432,
});

module.exports = (process.env.NODE_ENV === 'production') ? productionPool : developmentPool
