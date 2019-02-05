const express = require('express')
const router = express.Router();
const {ensureAuthenticated} = require('../../helpers/auth');
const IdeaController = require('../controllers/idea');

router.get('/', ensureAuthenticated, IdeaController.idea_index);

router.get('/add', ensureAuthenticated, IdeaController.idea_create);

router.post('/', ensureAuthenticated, IdeaController.idea_store);

router.get('/edit/:id', ensureAuthenticated, IdeaController.idea_edit);

router.put('/:id', ensureAuthenticated, IdeaController.idea_update);

router.delete('/:id', ensureAuthenticated, IdeaController.idea_delete);

module.exports = router;