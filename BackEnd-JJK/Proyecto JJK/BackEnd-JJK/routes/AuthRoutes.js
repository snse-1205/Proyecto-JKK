const auth = require('../auth/auth');

module.exports = (app) =>{
    app.post("/signup",auth.SignUp)
    app.post("/login",auth.login)
    
}