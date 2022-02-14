const env = process.env;

//  NODE 2
const config = {
  db1: {
    host: env.DB_HOST || 'node-1.cvxzrzpy1aj2.ap-southeast-1.rds.amazonaws.com',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'jL1rC0mhbvXMsU7AOXCs',
    database: env.DB_NAME || 'node1_movies',
    waitForConnections: true,
    connectionLimit: env.DB_CONN_LIMIT || 3,
    queueLimit: 0,
    debug: env.DB_DEBUG || false
    
  },

  db2: {
    host: env.DB_HOST || 'node-2.cvxzrzpy1aj2.ap-southeast-1.rds.amazonaws.com',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'jL1rC0mhbvXMsU7AOXCs',
    database: env.DB_NAME || 'node2_movies',
    waitForConnections: true,
    connectionLimit: env.DB_CONN_LIMIT || 3,
    queueLimit: 0,
    debug: env.DB_DEBUG || false
    
  },

  db3: {
    host: env.DB_HOST || 'node-3.cvxzrzpy1aj2.ap-southeast-1.rds.amazonaws.com',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || 'jL1rC0mhbvXMsU7AOXCs',
    database: env.DB_NAME || 'node3_movies',
    waitForConnections: true,
    connectionLimit: env.DB_CONN_LIMIT || 3,
    queueLimit: 0,
    debug: env.DB_DEBUG || false
    
  },
};
  
module.exports = config;