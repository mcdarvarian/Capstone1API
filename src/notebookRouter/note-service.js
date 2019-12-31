const NotebookService = {
    getNoteById(db, id) {
        return db.select('*').from('notes').where('id', id).first();
    }
}

module.exports = NotebookService;