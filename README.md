App Name:
Table Top Role Playing Game Notebook

Live Link to app:

https://capstone-client.pupeljack.now.sh/

Technology used:
React, CSS, Node, Express, PostgreSQL

Screenshots live at: 
![game selection](https://gyazo.com/2bc3d97251906ac6b36c83786366534d)
![note selection](https://gyazo.com/50621164a9468f9a2fe8a7d924ee2792)
![individual note page](https://gyazo.com/92144ec6e236727b89a10c40e0f29204)

Summary:
Its a notebook for any table top role playing games you may play, designed to be quick at getting between notes, planning on adding additional features in the future but for now you can make games, and make notes within a game's tabs. Its not super complex cause I wanted to focus on speed instead

Server Documentation

/game -> gets you any information that requires a game id, all games, notes within a game or notes that belong to a user

GET /game/ -> gets every game that exists

GET /game/user ->  gets every game related to a particular user

GET /game/notes/:game_id -> gets every note within a game

GET /game/:game_id -> gets every note within a tab, defaults to tab 1

DELETE /game/:game_id -> deletes a game and all associated notes

GET /game/:game_id/:tab_id -> gets all the notes within a tab, does not have a built in default

POST /game/:game_id/:tab_id -> makes a new note within a tab

/user -> used for creating, loging in, deleting or changing a user

GET /user/login -> used to log into an existing account

POST /user/signup -> used to create a new account

DELETE /user/admin -> used to delete an account, must have secret admin key to access

PATCH /user/admin -> used to change password on an account, must have secret admin password

/setup -> used for getting setup information to the client

-One GET route, used in initialization of the project

/note -> used for getting/making/updating specific notes 

GET /note/ -> gets all notes that exist

GET /note/user -> gets all notes for a user

GET /note/:note_id -> gets a particular note with id = note_id

PATCH /note/:note_id -> updates a particular note

DELETE /note/:note_id -> deletes a particular note



