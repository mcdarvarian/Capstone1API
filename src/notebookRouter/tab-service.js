const NotebookService = {
   getGames(db){
        return db.select('*').from('games');
    },

    getGamebyId(db, id){
        return db.select('*').from('games').where({id: id}).first();
    },

    getNotesByGameAndTab(db, game_id, tab_id){
        return db.select('*').from('notes').where({tab_id: tab_id, game_id: game_id});
    },

    getNotesByGame(db, game_id){
        return db.select('*').from('notes').where('game_id', game_id);
    },

    getNotesByTab(db, tab_id){
        return db.select('*').from('notes').where('tab_id', tab_id);
    },

    getTabs(db){
        return db.select('*').from('tabs');
    },

    makeNote(db, newNote){
        return db.insert(newNote).into('notes').returning('*').then(rows =>{
            return rows[0];
        })
    },

    makeGame(db, newGame){
        return db.insert(newGame).into('games').returning('*').then(rows =>{
            return rows[0];
        })
    },

    deleteGame(db, id){
        return db('games').where('id', id).del()
    }

    

    
}

module.exports = NotebookService;