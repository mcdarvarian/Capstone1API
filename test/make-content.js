function makeUsers() {
    return [ 
        {
            username: 'daisy', 
            password: 'bleh'
        },
        {
            username: 'two', 
            password: 'bleh'
        },
        {
            username: 'three', 
            password: 'bleh'
        },
        {
            username: 'four', 
            password: 'bleh'
        },
        {
            username: 'five ', 
            password: 'bleh'
        },
        {
            username: 'six', 
            password: 'bleh'
        },
    ];
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
    ];
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
            game_id: 3, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            game_id: 1, 
            tab_id: 2,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
        {
            game_id: 2, 
            tab_id: 5,
            title: 'bleh',
            contents: 'bleh 2: the blehing'
        },
    ];
}
    
module.exports = {makeGames, makeNotes, makeUsers};