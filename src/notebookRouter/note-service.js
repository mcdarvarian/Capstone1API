const NotebookService = {

    getAllNotes(db){ 
        return db.select('*').from('notes');
    },

    getNoteById(db, id) {
        return db.select('*').from('notes').where({id: id}).first();
    },

    getNoteByUser(db, users_id) {
        return db.raw(`
            SELECT n.* FROM notes n JOIN games g ON n.game_id = g.id WHERE g.users_id = ${users_id};
        `).then(res =>{
            return res.rows;
        })
    },

    updateNotebyId(db, id, newNote){
        return db('notes').where('id', id).update({
            game_id: newNote.game_id,
            tab_id: newNote.tab_id,
            title: newNote.title,
            contents: newNote.contents
        }, ['id', 'title', 'contents']);
    },

    deleteNote(db, id){
        return db('notes').where('id', id).del()
    }
}

module.exports = NotebookService;