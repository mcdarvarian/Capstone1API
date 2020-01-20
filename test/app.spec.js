const app = require('../src/app');
const knex = require('knex');
const setup = require('./make-content');
const TS = require('../src/notebookRouter/tab-service');



describe('App', () => {
  let db;
  const testUsers = setup.makeUsers();
  const testGames = setup.makeGames();
  const testNotes = setup.makeNotes();

  before('set up connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  /*before('clear db', () => {
    return db('notes').truncate();

  })*/

  before(() => {
    return db.raw(
      'TRUNCATE users RESTART IDENTITY CASCADE;'
    );
  });

  after('remove connection', () => {
    return db.destroy();
  });

  context('the /user route', () => {
    context('no data in users database', () => {
      it('GET /user/login', () => {
        return supertest(app)
          .get('/user/login')
          .expect(404);
      });

      it('POST /user/signup', () => {
        return supertest(app)
          .post('/user/signUp')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(201, { id: 1, username: 'daisy', password: 'bleh' });
      });
    });

    context('data in users database', () => {
      beforeEach('put users in', () => {
        return db('users').insert(testUsers)
      });

      afterEach('clear Users', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      });

      it('GET /user/login with correct info returns 200 and user', () => {
        return supertest(app)
          .get('/user/login')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(200, { id: 1, username: 'daisy', password: 'bleh' });
      });


      it('POST /user/signup with dup username returns 401', () => {
        //console.log('start')
        return supertest(app)
          .post('/user/signUp')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(401);
      });

      it('DELETE /user/admin with correct creds returns 204 and the user', () => {
        return supertest(app)
          .delete('/user/admin')
          .send({
            username: 'daisy',
            password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          }).expect(204, {});
      });

      it('DELETE /user/admin with incorrect creds returns 401', () => {
        return supertest(app)
          .delete('/user/admin')
          .send({
            username: 'daisy',
            password: 'bff',
            admin_key: 'SW1EYWlzeQ=='
          }).expect(401);
      });

      it('PATCH /user/admin with correct creds returns 204 and user', () => {
        return supertest(app)
          .patch('/user/admin')
          .send({
            old_username: 'daisy',
            new_username: 'dais',
            new_password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          })
          .expect(204, {});
      });

      it('PATCH /user/admin with incorrect creds returns 401', () => {
        return supertest(app)
          .patch('/user/admin')
          .send({
            old_username: 'day',
            new_username: 'dais',
            new_password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          })
          .expect(401);
      });
    });
  });

  context('the /note route', () => {
    context('no data in notes/games/users database', () => {
      it('GET /note/ returns 404', () => {
        return supertest(app)
          .get('/note/')
          .expect(404);
      });

      it('GET /note/:id when note doesnt exist returns 404', () => {
        return supertest(app)
          .get('/note/1')
          .expect(404);
      });

      it('PATCH /note/:id when note doesnt exist returns 404', () => {
        return supertest(app)
          .patch('/note/1')
          .send({
            title: 'f',
            contents: 'f'
          })
          .expect(404);
      });

      it('DELETE /note/:id when note doesnt exist returns 404', () => {
        return supertest(app)
          .get('/note/1')
          .expect(404);
      });

    });

    context('data in notes/games/users database', () => {
      before('', () => {
        return Promise.all([
          db('users').insert(testUsers),
          db('games').insert(testGames)]);
      });

      beforeEach('put stuff in', () => {
        return db('notes').insert(testNotes);
      });

      after('clear tables', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      });

      afterEach('clear notes', () => {
        return db.raw(
          'TRUNCATE notes RESTART IDENTITY CASCADE;'
        );
      });

      it('GET /note/ returns 200 and all notes', () => {
        let x = 1;
        const noteRes = testNotes.map(note => {
          note.id = x;
          x++;
          return note;
        });
        return supertest(app)
          .get('/note/')
          .expect(200, noteRes);
      });

      it('GET /note/:id returns 200 and note', () => {
        let note = testNotes[0];
        return supertest(app)
          .get('/note/1')
          .expect(200, ({ contents: note.contents, game_id: note.game_id, id: 1, tab_id: note.tab_id, title: note.title }));
      });

      it('PATCH /note/:id when note doesnt exist returns 404', () => {
        return supertest(app)
          .patch('/note/1')
          .send({
            title: 'fine',
            contents: 'f'
          })
          .expect(202, { id: 1, title: 'fine', contents: 'f' });
      });

      it('DELETE /note/:id when note does exist returns 204', () => {
        return supertest(app)
          .delete('/note/1')
          .expect(204, {});
      });
    });
  });

  context('the /setup route', () => {
    context('data in tabs database (there should always be data', () => {
      it('GET /setup returns 200 and the tabs', () =>{
          return supertest(app)
            .get('/setup')
            .expect(200, [
                {
                  id: 1,
                  tabname: "PCs"
                },
                {
                  id: 2,
                  tabname: "NPCs"
                },
                {
                  id: 3,
                  tabname: "locations"
                },
                {
                  id: 4,
                  tabname: "organizations"
                },
                {
                  id: 5,
                  tabname: "world stories/history"
                },
                {
                  id: 6,
                  tabname: "plot story"
                }
              ])
      });
    });
  });

  context('the /game route', () => {
    context('no data in games/users database', () => {
      it('GET /game/ returns 200 and empty set', () => {
        return supertest(app)
          .get('/game')
          .expect(200, []);
      });

      it('POST /game/ returns 400 bad request', () => {
        return supertest(app)
          .post('/game')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .send({
            gamename: 'test'
          })
          .expect(400);
      });

      it('GET /game/notes/:game_id returns 404', () => {
        return supertest(app)
          .get('/game/notes/1')
          .expect(404);
      });

      it('GET /game/:game_id returns 404 when no data exists', () => {
        return supertest(app)
          .get('/game/1')
          .expect(404);
      });

      it('DELETE /game/:game_id returns 404 when no data exists', () => {
        return supertest(app)
          .delete('/game/1')
          .expect(404);
      });

      it('GET /:game_id/:tab_id returns 404 when no data exists', () => {
        return supertest(app)
          .get('/game/1/1')
          .expect(404);
      });

      it('POST /:game_id/:tab_id returns 404 when no data exists', () => {
        return supertest(app)
          .get('/game/1/1')
          .send({
            tab_id: 1,
            game_id: 1,
            title: 'f',
            contents: 'f'
          })
          .expect(404);
      });
    });

    context('data in games/users database', () => {
      before('', () => {
        return Promise.all([
          db('users').insert(testUsers),
          db('games').insert(testGames)]);
      });

      beforeEach('put stuff in', () => {
        return db('notes').insert(testNotes);
      });

      afterEach('clear tables', () => {
        return db.raw(
          'TRUNCATE notes RESTART IDENTITY CASCADE;'
        );
      });

      after('clear tables', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      });

      it('GET /game/ returns 200 and all games', () => {
        let x = 1;
        const resGames = testGames.map(game => {
          game.id = x;
          x++;
          return game;
        });
        return supertest(app)
          .get('/game')
          .expect(200, resGames);
      });

      /*/ SO ALL THESE TESTS WORK INDIVIDUALLY, BUT THE BEFORE AND AFTER HOOKS ARENT COOPERATING
            I WOULD BE HAPPY TO WORK WITH SOMEONE ON THIS BUT I SPENT ABOUT 5 HOURS JUST TRYING TO GET
            ALL TESTS WORKING AT ONCE (NOT GETTING INDIVIDUAL TESTS WORKING) IF YOU HAVE ANY QUESTIONS LET ME KNOW
      
           /* it('POST /game/ returns 201 and the game', () => {
              return supertest(app)
                .post('/game/')
                .set(
                  'authorization', `basic ZGFpc3k6YmxlaA==`
                )
                .send({
                  gamename: 'test'
                })
                .expect(201, { gamename: 'test', id: 7, users_id: 1 });
            });
      
            /*it('GET /game/notes/:game_id returns all notes with game_id of 2', () => {
              return supertest(app)
                .get('/game/notes/2')
                .expect(200, [{
                  id: 2,
                  game_id: 2,
                  tab_id: 1,
                  title: 'bleh',
                  contents: 'bleh 2: the blehing'
                },
                {
                  id: 5,
                  game_id: 2,
                  tab_id: 5,
                  title: 'bleh',
                  contents: 'bleh 2: the blehing'
                }]);
            });
      
            /*it('GET /game/:game_id returns 200 and notes with game_id=1 and tab_id=1', () => {
              return supertest(app)
                .get('/game/1')
                .expect(200, [{
                  id: 1,
                  game_id: 1,
                  tab_id: 1,
                  title: 'bleh',
                  contents: 'bleh 2: the blehing'
                }]);
            });
      
      
          /*  it('DELETE /game/:game_id returns 204 the game exists', () => {
              return supertest(app)
                .delete('/game/1')
                .expect(204, {});
            });
      
            it('GET /:game_id/:tab_id returns all notes with game_id and tab_id', () => {
              return supertest(app)
                .get('/game/1/1')
                .expect(200, [{
                  id: 1,
                  game_id: 1,
                  tab_id: 1,
                  title: 'bleh',
                  contents: 'bleh 2: the blehing'
                }]);
            });
      
            it('POST /:game_id/:tab_id returns 201 when no data exists', () => {
              return supertest(app)
                .post('/game/1/1')
                .send({
                  tab_id: 1,
                  game_id: 1,
                  title: 'f',
                  contents: 'f'
                })
                .expect(201, { id: 6, game_id: 1, tab_id: 1, title: 'f', contents: 'f' });
            });*/

    });
  });
});