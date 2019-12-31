CREATE TABLE games(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    gameName TEXT 
);