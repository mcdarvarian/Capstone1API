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
            users_id: 1, 
            gamename: 'one'
        },
        {
            users_id: 2, 
            gamename: 'two'
        },
        {
            users_id: 3, 
            gamename: 'three'
        },
        {
            users_id: 1, 
            gamename: 'four'
        },
        {
            users_id: 2, 
            gamename: 'five'
        },
        {
            users_id: 3, 
            gamename: 'six'
        },
    ]
}

function makeNotes() {
    return [
        {
            id: 1,
            game_id: 1, 
            tab_id: 1,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            id: 2,
            game_id: 2, 
            tab_id: 1,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            id: 3,
            game_id: 3, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            id: 4,
            game_id: 1, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            id: 5,
            game_id: 2, 
            tab_id: 5,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
    ]
}
    
module.exports = {makeGames, makeNotes, makeUsers}