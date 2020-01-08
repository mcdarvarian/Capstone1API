function requireAuth(req, res, next) {
    const authToken = req.get('authorization') || ''

    

   let basicToken
    if (!authToken.toLowerCase().startsWith('basic ')) {
      return res.status(401).json({ error: 'Missing basic token' })
   } else {
     basicToken = authToken.slice('basic '.length, authToken.length)
   }

   const [tokenUserName, tokenPassword] = Buffer
    .from(basicToken, 'base64')
     .toString()
     .split(':')
   
   if (!tokenUserName || !tokenPassword) {
     return res.status(401).json({ error: 'Unauthorized request' })
   }

   req.app.get('db').select('*').from('users').where({username: tokenUserName, password: tokenPassword}).first()
        .then(response =>{
            if(!response){
                return res.status(401).json({error: 'user Not found'});
            }
            next();
        })
   

   // next()
}


  module.exports = {
    requireAuth,
  }