
module.exports = (app) => {
  const pers = require('../controllers/controller');

  app.post('/personne', pers.create);
  app.get('/database', pers.findAll);
  app.get('/contacts',pers.getAll);
  //app.post('/contacts',pers.postZoho);
}