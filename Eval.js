
/**
* @file
* A place for our domain specific wrappers for casperjs functionality.
*/

var Eval = {};

/**
* A wrapper for casper's dump function.
*/
Eval.dump = function(element) {
  return require('utils').dump(element);
}

/**
* A Jenkins specific wrapper to title assertions.
*/
Eval.assertTitle = function(title, message) {
  title = _add_page_title_boilerplate(title);
  return t.assertTitle(title, message);
}

Eval.loginRequired = function(message){
  return Eval.assertTitle('Login Required', message);
}

// Figures out if there is content given a content selector.
Eval.contentHasItems = function(selector) {
  return $(selector).length >= 1;
}


Eval.itemHasContent = function(selector) {
  var Item = $(selector.item);
  return $(selector.content, Item).length >= 1;
}

Eval.assertContentHasItems = function(selector, message) {
  var Arguments = {
    'selector' : selector
  };
  return t.assertEval(this.contentHasItems, message, Arguments);
}

Eval.assertItemHasContent = function(itemSelector, contentSelector, message) {
  var Arguments = {
    'selector': {
      'item' : itemSelector,
      'content' : contentSelector
    }
  };

  return t.assertEval(this.itemHasContent, message, Arguments);
}

Eval.getHref = function(selector) {
  var Arguments = {
    'selector' : selector
  };

  return casper.evaluate(function(selector){
    return $(selector).attr('href');
  }, Arguments);
}

Eval.assertPageHasForm = function(form) {
}

Eval.assertFormHasField = function(form, field) {
}

Eval.assertSecondaryMenuExists = function(menu, message) {
  var selector = this.getSecondaryMenuSelector(menu);
  return t.assertSelectorExists(selector, message);
}

Eval.getSecondaryMenuSelector = function(menu) {
  var selector = this.getBlockSelector('menu-secondary-links');
  return selector + ' a.menu-' + menu;
}


Eval.assertSecondaryMenuName = function (menu, name, message) {
  var selector = this.getSecondaryMenuSelector(menu);
  return t.assertSelectorHasText(selector, name, message);
}

Eval.assertPrimaryMenuExists = function(menu) {
}

// Fetch the text of the first found of given selector.
Eval.fetchFirstText = function(selector) {
  var Arguments = {
    'selector' : selector
  };

  return casper.evaluate(function(selector){
    return $(selector + ':first').text();
  }, Arguments);
}

/**
 * Define Drupal Block and casper behaviors.
 */
Block = function(id, title) {
  var defaults = {
    id : '',
    title : ''
  };

  this.selector = 'div#block-';
  this.id = (typeof id === 'undefined') ? defaults.id : id;
  this.title = (typeof title === 'undefined') ? defaults.title : title;
}

Block.assertExists = function() {
  var selector = this.getBlockSelector(block);
  return t.assertSelectorExists(selector, message);
}

Block.assertHasView = function(view) {
}

Block.getSelector = function(block_id) {
  var id = (typeof block_id === 'undefined') ? this.id : block_id;
  return this.selector + this.id;
}

Block.assertTitle = function(title) {
}


/**
 * Define Drupal View and casper behaviours.
 */
View = function(id, display, fields, items, isBox, isTable){
  var defaults = {
    fields : {},
    items : {},
    display : '',
    isBox : false,
    isTable : true
  };

  this.id = id;
  this.fields = (typeof fields === 'undefined') ? defaults.fields : fields;
  this.items = (typeof items === 'undefined') ? defaults.fields : fields;
  this.isBox = (typeof isBox == 'undefined') ? defaults.isBox : isBox;
  this.isTable = (typeof isTable == 'undefined') ? defaults.isTable : isTable;
}

View.getBlockSelector = function() {
  var selector = 'views-' + view.id + '-' + this.display;
  return Block.getSelector(selector);
}

View.assertExists = function(view, message) {
  var selector = this.getSelector();
  return t.assertSelectorExists(selector, message);
}

View.getSelector = function(view) {
  if (this.isBlock) {
    return this.getBlockViewSelector(view);
  }
  else {
    return 'div.view.view-' + view;
  }
}

View.assertHasContent = function(view, message) {
  var selector = this.getFirstRowSelector(view);
  return t.assertSelectorExists(selector, message);
}

View.getFirstRowSelector = function(view) {
  var selector = this.getContentSelector(view);
  return selector + ' .views-row-first';
}

View.getContentSelector = function() {
  var selector  = this.getSelector();
  return selector + ' div.view-content';
}

View.assertContentHasField = function(field) {
  var selector = this.getFieldSelector(field);
}

View.getFieldSelector = function(field) {
  var selector  = this.getContentSelector(view);
  return selector + ' div.views-row-1 div.' + field;
}

View.assertFieldHasLink = function(field) {
  var selector = this.getFieldLinkSelector(field);
}

View.getFieldLinkSelector = function (field) {
  var selector = this.getFieldSelector('view', 'field');
  return selector + ' a';
}

View.getFieldURL = function (view, field) {
  var selector = this.getFieldLinkSelector(view, field);
}

