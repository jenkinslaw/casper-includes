
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
};

/**
* A Jenkins specific wrapper to title assertions.
*/
Eval.assertTitle = function(title, message) {
  title = _add_page_title_boilerplate(title);
  return t.assertTitle(title, message);
};

Eval.loginRequired = function(message){
  return Eval.assertTitle('Login Required', message);
};

// Figures out if there is content given a content selector.
Eval.contentHasItems = function(selector) {
  return $(selector).length >= 1;
};


Eval.itemHasContent = function(selector) {
  var Item = $(selector.item);
  return $(selector.content, Item).length >= 1;
};

Eval.assertContentHasItems = function(selector, message) {
  var Arguments = {
    'selector' : selector
  };
  return t.assertEval(this.contentHasItems, message, Arguments);
};

Eval.assertItemHasContent = function(itemSelector, contentSelector, message) {
  var Arguments = {
    'selector': {
      'item' : itemSelector,
      'content' : contentSelector
    }
  };

  return t.assertEval(this.itemHasContent, message, Arguments);
};

Eval.getHref = function(selector) {
  var Arguments = {
    'selector' : selector
  };

  return casper.evaluate(function(selector){
    return $(selector).attr('href');
  }, Arguments);
};

Eval.assertPageHasForm = function(form) {
};

Eval.assertFormHasField = function(form, field) {
};


// Fetch the text of the first found of given selector.
Eval.fetchFirstText = function(selector) {
  var Arguments = {
    'selector' : selector
  };

  return casper.evaluate(function(selector){
    return $(selector + ':first').text();
  }, Arguments);
};

/**
 * Define Drupal Block and casper behaviors.
 */
var Block = function(id, title) {
  var defaults = {
    id : '',
    title : ''
  };

  this.id = (typeof id === 'undefined') ? defaults.id : id;
  this.title = (typeof title === 'undefined') ? defaults.title : title;
};

Block.prototype.assertExists = function(message) {
  var selector = this.getSelector();
  return t.assertSelectorExists(selector, message);
};

Block.prototype.assertHasView = function(view) {
};

Block.prototype.getSelector = function(block_id) {
  var id = (typeof block_id === 'undefined') ? this.id : block_id;
  var selector = (typeof this.selector === 'undefined') ?'div#block-' : this.blockSelector;

  return selector + this.blockType +  id;
};

Block.prototype.assertTitle = function(title) {
};

Block.prototype.blockSelector = 'div#block-';



/**
 * Define Drupal Menu and casper behaviors.
 */
var Menu = function(id){
  this.id = (typeof id === 'undefined') ? this.getDefaults().id : id;
  this.blockType = 'menu-';
};

Menu.prototype = new Block('menu');

Menu.prototype.assertItemExists = function(item, message) {
  var selector = this.getItemSelector(item);
  Eval.dump(selector);
  return t.assertSelectorExists(selector, message);
};

Menu.prototype.getItemSelector = function(item) {
  var selector = this.getSelector();
  return selector + ' a.menu-' + item;
};


Menu.prototype.assertItemName = function (item, name, message) {
  var selector = this.getItemSelector(item);
  return t.assertSelectorHasText(selector, name, message);
};

Menu.prototype.getDefaults  = function() {
  return {
    id : 'secondary-links'
  };
};

/**
 * Definition for a View Field.
 */
Fields = function(name, items) {
  var defaults = {
   'items' : []
  };

  if (typeof name == 'Array') {
    this.setFields(name);
  }
  else {
    this.setField(name, items);
  }

  this.setFields = function(names) {
    for (var i = 0; i < names.length; i++) {
      this.setField(name);
    }
  };

  this.setField = function(name, items) {
    items = (typeof items == 'undefined' ? defaults.items : items);
    this.name = items;
  };

  this.getField = function(name) {
    return this.name;
  };

  return this;
};


/**
 * Define Drupal View and casper behaviours.
 */
var View = function(id, display, fields, items, isBox, isTable) {

  this.id = id;
  this.setDefaults(display, fields, isBox, isTable);

  this.setFields = function(fields) {
    this.fields = (fields instanceof Fields) ? fields : defaults.fields;
  };

  this.assertDefaults = function() {
    var defaults = this.getDefaults();
  };

  this.getDefaults = function() {
  };

};


View.prototype.setDefaults = function(display, fields, isBox, isTable) {
  var defaults = this.getDefaults();

  this.display  = (typeof display === 'undefined') ? defaults.display : display ;
  this.fields  = (typeof fields === 'undefined') ? defaults.fields : fields;
  this.isBox   = (typeof isBox === 'undefined') ? defaults.isBox : isBox;
  this.isTable = (typeof isTable === 'undefined') ? defaults.isTable : isTable;
};

View.prototype.getDefaults = function() {
  return  {
    'fields' : {},
    'display' : '',
    'isBox' : false,
    'isTable' : true
  };
};


View.prototype.getBlockSelector = function() {
  var selector = 'views-' + view.id + '-' + this.display;
  return Block.getSelector(selector);
};

View.prototype.assertExists = function(message) {
  var selector = this.getSelector();
  return t.assertSelectorExists(selector, message);
};

View.prototype.getSelector = function() {
  if (this.isBlock) {
    return this.getBlockViewSelector();
  }
  else {
    return 'div.view.view-' + this.id;
  }
};

View.prototype.assertHasContent = function(view, message) {
  var selector = this.getFirstRowSelector(view);
  return t.assertSelectorExists(selector, message);
};

View.prototype.getFirstRowSelector = function(view) {
  var selector = this.getContentSelector(view);
  return selector + ' .views-row-first';
};

View.prototype.getContentSelector = function() {
  var selector  = this.getSelector();
  return selector + ' div.view-content';
};

View.prototype.assertContentHasField = function(field, message) {
  var selector = this.getFieldSelector(field);
  t.assertSelectorExists(selector, message);
  return this.getField(field);
};

View.prototype.getFieldSelector = function(field) {
  var selector  = this.getContentSelector();
  return selector + ' div.views-row-1 div.' + field;
};

View.prototype.assertFieldHasLink = function(field) {
  var selector = this.getFieldLinkSelector(field);
  return t.assertSelectorExists(selector);
};

View.prototype.getFieldLinkSelector = function (field) {
  var selector = this.getFieldSelector(field);
  return selector + ' a';
};

View.prototype.getFieldURL = function (view, field) {
  var selector = this.getFieldLinkSelector(view, field);
};

