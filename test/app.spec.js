const app = require('../src/app')
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

  before('clear db', () => {
    return db('notes').truncate();

  })

  before(() => {
    return db.raw(
      'TRUNCATE users RESTART IDENTITY CASCADE;'
    )
  });

  after('remove connection', () => {
    return db.destroy();
  })

  context('the /user route', () => {
    context('no data in users database', () => {
      it('GET /user/login', () => {
        return supertest(app)
          .get('/user/login')
          .expect(404);
      })

      it('POST /user/signup', () => {
        return supertest(app)
          .post('/user/signUp')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(201, { id: 1, username: 'daisy', password: 'bleh' })
      })
    })

    context('data in users database', () => {
      beforeEach('put users in', () => {
        return db('users').insert(testUsers)
      })

      afterEach('clear Users', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      })

      it('GET /user/login with correct info returns 200 and user', () => {
        return supertest(app)
          .get('/user/login')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(200, { id: 1, username: 'daisy', password: 'bleh' })
      })


      it('POST /user/signup with dup username returns 401', () => {
        //console.log('start')
        return supertest(app)
          .post('/user/signUp')
          .set(
            'authorization', `basic ZGFpc3k6YmxlaA==`
          )
          .expect(401)
      })

      it('DELETE /user/admin with correct creds returns 204 and the user', () => {
        return supertest(app)
          .delete('/user/admin')
          .send({
            username: 'daisy',
            password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          }).expect(204, {})
      })

      it('DELETE /user/admin with incorrect creds returns 401', () => {
        return supertest(app)
          .delete('/user/admin')
          .send({
            username: 'daisy',
            password: 'bff',
            admin_key: 'SW1EYWlzeQ=='
          }).expect(401)
      })

      it('PATCH /user/admin with correct creds returns 204 and user', () => {
        return supertest(app)
          .patch('/user/admin')
          .send({
            old_username: 'daisy',
            new_username: 'dais',
            new_password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          })
          .expect(204, {})
      })

      it('PATCH /user/admin with incorrect creds returns 401', () => {
        return supertest(app)
          .patch('/user/admin')
          .send({
            old_username: 'day',
            new_username: 'dais',
            new_password: 'bleh',
            admin_key: 'SW1EYWlzeQ=='
          })
          .expect(401)
      })
    })
  })

  context.only('the /note route', () => {
    context('no data in notes/games/users database', () => {

    })

    context('data in notes/games/users database', () => {
      beforeEach('put stuff in', () => {
        Promise.all([
          db('users').insert(testUsers),
          db('games').insert(testGames),
          db('notes').insert(testNotes)
        ])
      })

      afterEach('clear tables', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      })

      it('GET /note/ returns all notes',() =>{
        return supertest(app)
        .get('/note/')
        .expect(200, testNotes)
      })
    })
  })

  context('the /setup route', () => {
    context('data in tabs database', () => {

    })
  })

  context('the /game route', () => {
    context('no data in games/users database', () => {
      beforeEach('put stuff in', () => {
        Promise.all([
          db('users').insert(testUsers),
          db('games').insert(testGames),
          db('notes').insert(testNotes)
        ])
      })

      afterEach('clear tables', () => {
        return db.raw(
          'TRUNCATE users RESTART IDENTITY CASCADE;'
        );
      })
    })

    context('data in games/users database', () => {

    })
  })

  /*context('with no data in the database', () => {
    it('GET / responds with 200 and an empty array', () => {
      return supertest(app)
        .get('/', {
          'authorization': `basic ${TokenService.getAuthToken()}`
        })
        .expect(200, [])
    })

    it('GET /:game_id responds with 404 and game not found', () => {
      return supertest(app)
        .get('/1')
        .expect(404, 'game not found')
    })

    it('GET /game_id/tab_id responds with 404 and game not found', () => {
      return supertest(app)
        .get('/1/1')
        .expect(404, 'game not found');
    })

    it('GET /note/:note_id response with 404 and note not found', () =>{
      console.log('trying');
      return supertest(app)
        .get('/note/1')
        .expect(404, 'note not found');
    })

    
    
  })
  context('with data in the database', () =>{
    beforeEach(() =>{
      return db.insert(testNotes).into('notes').returning('*').then(rows =>{ console.log('rows: ', rows)})
  })

    afterEach('empty the database (except tabs)', () =>{
      return db('notes').truncate();
      
    })
    
    it('POST / inserts the game and returns it properly', () =>{
      const newGame =  {
        id: 1,
        users_id: 1, 
        gamename: 'bleh',
      }

      return supertest(app)
        .post('/')
        .send({
          users_id: '1', 
          gamename: 'bleh',
        })
        .expect(201, newGame)
    })

    it('POST /:game_id/:tab_id responds with 201 and an the new note', () =>{
      const newNote =  {
        id: 1,
        game_id: 1, 
        tab_id: 1,
        title: 'bleh',
        contents: 'bleh',
      }

      return supertest(app)
        .post('/1/1')
        .send({
          tab_id: '1',
          game_id: '1', 
          title: 'bleh',
          contents: 'bleh',
        })
        .expect(201, newNote);
    })
  })*/

  /*it('does the thing', () =>{
      console.log(TS.confirmTabExists(db, 6))
      
  })*/
})