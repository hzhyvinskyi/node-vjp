module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            next();
        } else {
            req.flash('error_msg', 'Not Authenticated');
            res.redirect('/users/login');
        }
    }
};