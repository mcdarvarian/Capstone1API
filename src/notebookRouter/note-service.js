const NotebookService = {

    getAllNotes(db){ 
        return db.select('*').from('notes');
    },

    getNoteById(db, id) {
        return db.select('*').from('notes').where({id: id}).first();
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