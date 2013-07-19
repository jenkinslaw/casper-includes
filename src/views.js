

/**
 * Define Drupal View and casper behaviours.
 */
var View = function(id, display, isBlock, isTable, fields) {

  this.id = id;
  this.setDefaults(display, isBlock, isTable, fields);

  this.setFields = function(fields) {
    this.fields = (fields instanceof Fields) ? fields : defaults.fields;
  };

  this.assertDefaults = function() {
    var defaults = this.getDefaults();
  };

};

View.prototype = new Component('view');


View.prototype.setDefaults = function(display, isBlock, isTable, fields) {
  var defaults = this.getDefaults();

  this.display = (typeof display === 'undefined') ? defaults.display : display ;
  this.isBlock = (typeof isBlock === 'undefined') ? defaults.isBlock : isBlock;
  this.isTable = (typeof isTable === 'undefined') ? defaults.isTable : isTable;
  this.fields  = (typeof fields === 'undefined') ? defaults.fields : fields;

  return this;
};

View.prototype.getDefaults = function() {
  return  {
    'fields' : {},
    'display' : '',
    'isBlock' : false,
    'isTable' : false
  };
};

View.prototype.getSelector = function() {
  if (this.isBlock) {
    return this.getBlockSelector();
  }
  else {
    return 'div.view.view-' + this.id;
  }
};

View.prototype.getBlockSelector = function() {
  var display = this.getDisplay();
  var selector = 'views-' + this.id + display + '.block-views';

  var block = new Block(selector);
  return block.getSelector();
};

View.prototype.getDisplay = function() {
  return (this.dislplay !== '') ? '-' + this.display : this.display;
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
  return new Field(selector);
};

View.prototype.getFieldSelector = function(field) {
  var selector  = this.getContentSelector();
  return selector + ' div.views-row-1 div.' + field;
};

View.prototype.assertFieldHasLink = function(field) {
  var selector = this.getFieldLinkSelector(field);
  t.assertSelectorExists(selector);
  return this;
};

View.prototype.getFieldLinkSelector = function (field) {
  var selector = this.getFieldSelector(field);
  return selector + ' a';
};

View.prototype.getFieldURL = function (field) {
  var selector = this.getFieldLinkSelector(field);
  return Eval.getHref(selector);
};

/**
 * Factory for a fully formed view object.
 */
var ViewFactory = function(id, casper) {
  var view = new View(id);

  var viewInfo = casper.getElementInfo('.view');
  var viewContentInfo = casper.getElementInfo('.view-content');
  Eval.dump(viewInfo);
  Eval.dump(viewContentInfo);

  return view;
};

