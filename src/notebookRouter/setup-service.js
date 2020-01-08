const NotebookService = {
    getTabs(db){
        return db.select('*').from('tabs');
    }
}

module.exports = NotebookService