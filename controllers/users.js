var User = require('../models/user');
var Game = require('../models/game');
var passport = require('passport');

module.exports = {
    index,
    show,
    delete: destroy,
    newLibItem,
    addLibItem,
    removeLibItem,
    update,
    profile
}

// Index
function index(req, res, next) {
    console.log(req.user);
    if (req.user && !req.user.username) {
        res.redirect('/users/edit');
    } else {
        res.render('index', { user: req.user });
    }
}

// Update
function update(req, res, next) {
    var body = req.body;
    if (!body.platforms) {
        body.platforms = []
    }
    console.log('*********************************');
    console.log(body.platforms);
    console.log('*********************************');
    User.findByIdAndUpdate(req.session.passport.user, body, {new: true}, function(err, user) {
        if (err) return res.status(404).json(err);
        res.render('users/show', {user});
    });
    // console.log(user);
}

// Profile
function profile(req, res, next) {
    console.log(req.user);
    res.render('users/edit', {user: req.user});
}

// Show
function show(req, res, next) {
    User.findById(req.params.id).populate('games').exec(function(err, user) {
        if (err) return res.render('users/index');
        res.render('users/show', {user});
    });
}

// Delete
function destroy(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        user.remove();
        res.redirect('/users');
    });
}

// New Library Item
function newLibItem(req, res) {
    Game.find({}).where('users').nin([req.params.id]).populate('users')
    .exec(function(err, games) {
        var user = req.params.id;
        res.render('users/library', {
            games,
            user,
            userId: req.params.id
        });
    });
}

// Add Item to Library
function addLibItem(req, res, next) {
    User.findById(req.params.userId, (err, user) => {
        user.games.push(req.params.gameId);
        user.save(() => {
            Game.findById(req.params.gameId, (err, game) => {
                game.users.push(req.params.userId);
                game.save(() => {
                    res.redirect(`/users/${user.id}`);
                });
            });
        });
    });
}

// Remove Item from Library
function removeLibItem(req, res) {
    User.findById(req.params.userId, (err, user) => {
        user.games.remove(req.params.gameId);
        user.save(() => {
            Game.findById(req.params.gameId, (err, game) => {
                game.users.remove(req.params.userId);
                game.save(() => {
                    res.redirect(`/users/${user.id}`);
                });
            });
        });
    })
}