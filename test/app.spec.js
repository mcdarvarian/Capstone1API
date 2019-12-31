const app = require('../src/app')
const knex = require('knex');
const setup = require('./make-content');



describe('App', () => {
  let db;
  const testUsers = setup.makeUsers();
  const testGames = setup.makeGames();
  const testNotes = setup.makeNotes();

  before('set up connection', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_URL
    });
    app.set('db', db);
  });

  before('clear db', () =>{
    return  db('notes').truncate();
    
  })

  /*before(() =>{
    return db('games').truncate();
  })*/

  after('remove connection', () => {
    return db.destroy();
  })
  context('with no data in the database', () => {
    it('GET / responds with 200 and an empty array', () => {
      return supertest(app)
        .get('/')
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
    /*beforeEach(() =>{
      return db.insert(testNotes).into('notes').returning('*').then(rows =>{ console.log('rows: ', rows)})
  })*/

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
          id: '1',
          users_id: '1', 
          gamename: 'bleh',
        })
        .expect(201, newGame)
    })

    it.only('POST /:game_id/:tab_id responds with 201 and an the new note', () =>{
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
          id: '1',
          tab_id: '1',
          game_id: '1', 
          title: 'bleh',
          contents: 'bleh',
        })
        .expect(201, newNote);
    })
  })
})