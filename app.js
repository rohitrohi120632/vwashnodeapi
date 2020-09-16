require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

const port = process.env.PORT || 3000




app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

  app.set('view engine','ejs')




const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}


app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => res.render('pages/index'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))




app.get('/good', isLoggedIn, (req, res) =>{
    res.render("pages/profile",{
        name:req.user.displayName,
        pic:req.user.photos[0].value,
        email:req.user.emails[0].value})
})






app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logOut(),
    res.redirect('/');
})















app.listen(port, () => {
    console.log ('server is up on port' + port)
});