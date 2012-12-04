var utils = require('utils');
var menu = new Menu('secondary-menu');
var t = casper.test;

t.comment('Testing the Menu object.');
t.assert(menu instanceof Block, 'The menu is a type of block.');
t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-menu', 'Menu#getSelector works.');
t.assert('assertExists' in menu, 'Menu#assertExists is available.');
t.assertEqual(menu.getItemSelector('my-menu'), 'div#block-menu-secondary-menu a.menu-my-menu', 'Menu#getItemSelector works.');
t.assert('assertItemExists' in menu, 'Menu#assertItemExists is available.');
t.assert('assertItemName' in menu, 'Menu#assertItemName is available.');
t.comment('');

t.comment('Testing the Block object.');
t.done();
