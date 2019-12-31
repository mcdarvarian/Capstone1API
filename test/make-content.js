function makeUsers() {
    return [ 
        {
            id: 1,
            username: 'one', 
            password: 'bleh'
        },
        {
            id: 2,
            username: 'two', 
            password: 'bleh'
        },
        {
            id: 3,
            username: 'three', 
            password: 'bleh'
        },
        {
            id: 4,
            username: 'four', 
            password: 'bleh'
        },
        {
            id: 5,
            username: 'five ', 
            password: 'bleh'
        },
        {
            id: 6,
            username: 'six', 
            password: 'bleh'
        },
    ]
}

function makeGames() {
    return [
        {
            user_id: 1, 
            gameName: 'one'
        },
        {
            user_id: 2, 
            gameName: 'two'
        },
        {
            user_id: 3, 
            gameName: 'three'
        },
        {
            user_id: 1, 
            gameName: 'four'
        },
        {
            user_id: 2, 
            gameName: 'five'
        },
        {
            user_id: 3, 
            gameName: 'six'
        },
    ]
}

function makeNotes() {
    return [
        {
            game_id: 1, 
            tab_id: 1,
            title: 'bleh',
            content: 'bleh 2: the blehing'
        },
        {
            game_id: 2, 
            tab_id: 1,
            title: 'bleh',
            content: 'bleh 2: the blehing'
        },
        {
            game_id: 3, 
            tab_id: 2,
            title: 'bleh',
            content: 'bleh 2: the blehing'
        },
        {
            game_id: 1, 
            tab_id: 2,
            title: 'bleh',
            content: 'bleh 2: the blehing'
        },
        {
            game_id: 2, 
            tab_id: 5,
            title: 'bleh',
            content: 'bleh 2: the blehing'
        },
    ]
}
    
module.exports = {makeGames, makeNotes, makeUsers}