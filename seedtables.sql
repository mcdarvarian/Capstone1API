INSERT INTO users(username, password)
values
    ('blef', 'blef'),
    ('blof', 'blof'),
    ('blub', 'blub');

INSERT INTO games(users_id, gameName)
values
    (2, 'one'),
    (2, 'two'),
    (3, 'three'),
    (3, 'four'),
    (4, '5'),
    (4, 'g');

INSERT INTO notes(game_id, tab_id, title, contents)
values
    (2, 1, 'one', 'blah'),
    (2, 3, 'two', 'blah'),
    (3, 5, 'three', 'blah'),
    (4, 2, 'four', 'blah'),
    (5, 2, 'five', 'blah'),
    (6, 2, 'six', 'blah');