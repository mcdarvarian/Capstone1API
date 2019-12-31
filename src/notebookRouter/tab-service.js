const NotebookService = {
   getGames(db){
        return db.select('*').from('games');
    },

    getGamebyId(db, id){
        return db.select('*').from('games').where('id', id).first();
    },

    getTabNotes(db, tab_id){

        return db.select('*').from('notes').where('tab_id', tab_id);
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
    }

    

    
}

module.exports = NotebookService;