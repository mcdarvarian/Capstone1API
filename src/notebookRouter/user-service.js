const NotebookService = {

    loginUser(db, username, password){
        return db('users').select('*').where({username: username, password: password}).first();
    },

    makeUser(db, newUser){
        return db.insert(newUser).into('users').returning('*').then(rows =>{
            return rows[0];
        });
    },

    findUserByName(db, username){
        return db('users').select('*').where({username: username}).first();
    },

    deleteUser(db, username, password){
        return db('users').where({username: username, password: password}).first().del();
    },

    updateUser(db, oldUN, newUN, newPass){
        return db('users').where({username: oldUN}).update({
            username: newUN,
            password: newPass
        }, ['id', 'username', 'password']);
    },
};

module.exports =  NotebookService;