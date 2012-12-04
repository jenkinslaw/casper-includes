var utils = require('utils');
var t = casper.test;
var system = require('system');
var casperTestsDir = system.env._casper_tests;


casper.start(casperTestsDir + '/includes/Eval.xhtml', function() {
  t.comment('Testing the Menu object.');
  var menu = new Menu('secondary-menu');

  t.assert(menu instanceof Block, 'The menu is a type of block.');
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-menu', 'Menu#getSelector works.');
  t.assert('assertExists' in menu, 'Menu#assertExists is available.');
  t.assertEqual(menu.getItemSelector('my-menu'), 'div#block-menu-secondary-menu a.menu-my-menu', 'Menu#getItemSelector works.');
  t.assert('assertItemExists' in menu, 'Menu#assertItemExists is available.');
  t.assert('assertItemName' in menu, 'Menu#assertItemName is available.');

  menu = new Menu();
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-links', 'The default menu is the secondary menu.');
  t.comment('');

});

casper.then(function() {
  t.comment('Testing the View object.');
  var view = new View('whats-new');

  t.assertEqual(view.getSelector(), 'div.view.view-whats-new', 'View returns correct view selector when passed a string');
  view.assertExists('The of interest views list is present.');
  view.assertHasContent('There are items in the "Of Interest" view.');
  view.assertContentHasField('pic');
  view.assertContentHasField('date');
  view.assertContentHasField('month');
  view.assertContentHasField('content');

});



casper.run(function(){
  t.done();
});







