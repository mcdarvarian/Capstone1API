function makeUsers() {
    return [ 
        {
            //id: 1,
            username: 'daisy', 
            password: 'bleh'
        },
        {
           // id: 6,
            username: 'two', 
            password: 'bleh'
        },
        {
            //id: 7,
            username: 'three', 
            password: 'bleh'
        },
        {
            //id: 8,
            username: 'four', 
            password: 'bleh'
        },
        {
            //id: 9,
            username: 'five ', 
            password: 'bleh'
        },
        {
            //id: 10,
            username: 'six', 
            password: 'bleh'
        },
    ]
}

function makeGames() {
    return [
        {
            //id: 7,
            users_id: 1, 
            gamename: 'one'
        },
        {
            //id: 2,
            users_id: 2, 
            gamename: 'two'
        },
        {
            //id: 3,
            users_id: 3, 
            gamename: 'three'
        },
        {
            //id: 4,
            users_id: 1, 
            gamename: 'four'
        },
        {
            //id: 5,
            users_id: 2, 
            gamename: 'five'
        },
        {
            //id: 6,
            users_id: 3, 
            gamename: 'six'
        },
    ]
}

function makeNotes() {
    return [
        {
            
            game_id: 1, 
            tab_id: 1,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
           
            game_id: 2, 
            tab_id: 1,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
           // id: 3,
            game_id: 3, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            //id: 4,
            game_id: 1, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
           // id: 5,
            game_id: 2, 
            tab_id: 5,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
    ]
}
    
module.exports = {makeGames, makeNotes, makeUsers}