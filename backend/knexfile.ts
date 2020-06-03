module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: './data/dev.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
  }
}
