// Initializing steps.
var utils          = require('utils');
var t              = casper.test;
var system         = require('system');
var casperTestsDir = system.env._casper_tests;
var Test           = function(){};
var testSlow       = casper.cli.get('testSlow');


casper.start();
casper.then(function() {Test.Component();});
casper.then(function() {Test.Field();});
casper.then(function() {Test.Menu();});
casper.then(function() {Test.View();});
casper.then(function() {if (testSlow == 'yes') Test.Slow();});
casper.run(function(){t.done();});


Test.Component = function() {
  t.comment('------------------------');
  t.comment('Testing the Component object.');
  t.comment('------------------------');

  var component = new Component();
  t.assert(component instanceof Object, 'The Component object is defined.');
  t.assertEqual(component.type, 'div', 'The default component type is a div.');
};

Test.Field = function() {
  t.comment('------------------------');
  t.comment('Testing the Field object.');
  t.comment('------------------------');
  var field = new Field('field-selector');
  t.assertEqual(field.selector, 'field-selector', 'The field selector is set properly.');

  t.assertEqual(field.getItemSelector('item'), 'field-selector .item', 'Field#geItemSelector works as expected.');
  t.assert(field instanceof Component, 'Fields are components.');
};

Test.Menu = function() {
  t.comment('------------------------');
  t.comment('Testing the Menu object.');
  t.comment('------------------------');

  var menu = new Menu('secondary-menu');

  t.assert(menu instanceof Component, 'Menus are components.');
  t.assert(menu instanceof Block, 'The menu is a type of block.');
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-menu', 'Menu#getSelector works.');
  t.assert('assertExists' in menu, 'Menu#assertExists is available.');
  t.assertEqual(menu.getItemSelector('my-menu'), 'div#block-menu-secondary-menu a.menu-my-menu', 'Menu#getItemSelector works.');
  t.assert('assertItemExists' in menu, 'Menu#assertItemExists is available.');
  t.assert('assertItemName' in menu, 'Menu#assertItemName is available.');

  menu = new Menu();
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-links', 'The default menu is the secondary menu.');
  t.comment('');
};

Test.View = function() {
  t.comment('------------------------');
  t.comment('Testing the View object.');
  t.comment('------------------------');

  var view = new View('whats-new');
  t.assert(view instanceof Component, 'Views are components.');

  t.assertEqual(view.getSelector(), 'div.view.view-whats-new', 'View returns correct view selector when passed a string.');

  view = new View('testview', 'block_2', true);
  t.assert(view.isBlock, 'This view is a block.');
  t.assertEqual(view.getSelector(), 'div#block-views-testview-block_2.block-views', 'View returns correct block selector.');
  t.comment('');
};


Test.Block = function() {
  t.comment('------------------------');
  t.comment('Testing the Block object.');
  t.comment('------------------------');

  var block = new Block('my-block');
  t.assert(block instanceof Component, 'Blocks are components.');
};

// Loading a page take time.
// We can disable these test when we don't need them.
Test.Slow = function() {
  t.comment('-------------------------------------');
  t.comment('Testing page dependant functionality.');
  t.comment('-------------------------------------');

  casper.open(casperTestsDir + '/includes/View.html').then(function() {
    Test.Slow.View();
  });

};

Test.Slow.View = function() {
  t.comment('### Tesing file dependant View stuff. ###');
  var view = new View('whats-new');
  view.assertHasContent('There are items in the "Of Interest" view.');
  view.assertExists('The of interest views list is present.');
  view.assertContentHasField('pic', 'The content has a pic field.');
  view.assertContentHasField('date', 'The content has a date field.')
    .assertHasItem('month-day', 'The date has a month-day field.');
  view.assertContentHasField('content','The content has a content field')
    .assertHasItem('h3 a', 'The cotent field has a link.');
};

