INSERT INTO users(username, password)
values
    ('blef', 'blef'),
    ('blof', 'blof'),
    ('blub', 'blub');

INSERT INTO games(users_id, gameName)
values
    (1, 'one'),
    (1, 'two'),
    (2, 'three'),
    (2, 'four'),
    (3, '5'),
    (3, 'g');

INSERT INTO notes(game_id, tab_id, title, contents)
values
    (2, 1, 'one', 'blah'),
    (2, 3, 'two', 'blah'),
    (3, 5, 'three', 'blah'),
    (4, 2, 'four', 'blah'),
    (5, 2, 'five', 'blah'),
    (6, 2, 'six', 'blah');