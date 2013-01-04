
/**
 * Defines a generic component class.
 * All our page components inherit behaviours from this class.
 */
var Component = function(nodeType){
  this.setDefaults(nodeType);
};

Component.prototype.setDefaults = function(nodeType) {
  var defaults  = this.getDefaults();
  this.nodeType = (typeof nodeType == 'undefined') ? defaults.nodeType : nodeType;
  return this;
};

Component.prototype.getDefaults = function() {
  return {nodeType : 'div'};
};

Component.prototype.getSelector = function() {
  var nodeType = this.nodeType;
  var id       = this.id;
  var id_type  = this.getIdType();

  return nodeType + id_type + id;
};

Component.prototype.getIdType = function() {
  var id_type = (typeof this.id === 'undefined') ? '.' : '#';
  return id_type;
};

Component.prototype.getLabel = function() {
  if (typeof this.label == 'undefined') {
    var labelSelector = this.getLabelSelector();
    return casper.fetchText(labelSelector);
  }
  return this.label;
};

Component.prototype.getLabelSelector = function() {
  var id = this.id;
  return 'label[for=' + id + ']';
};

Component.prototype.getName = function() {
  var selector = this.getSelector();
  return casper.getElementAttribute(selector, 'name');
};

Component.prototype.assertLabel  =  function(expected, message) {
  var actual = this.getLabel();
  t.assertEqual(actual, expected, message);
  return this;
};

Component.prototype.assertExists = function(message) {
  var selector = this.getSelector();
  t.assertSelectorExists(selector, message);
  return this;
};


/**
 * Definition Field.
 * Can be used to follow and assert any item.
 */
var Field = function(selector, items) {
  this.setSelector(selector);
  this.setDefaults(items);

  this.getField = function(name) {
    return this;
  };

  return this;
};

Field.prototype = new Component('div');

Field.prototype.setSelector = function(selector) {
  this.selector = selector;
  return this;
};

Field.prototype.setDefaults = function(items) {
  var defaults = this.getDefaults();
  this.items = (typeof items == 'undefined') ? defaults.items : items;
};

Field.prototype.getDefaults = function() {
  return {
   'items' : []
  };
};

Field.prototype.assertHasItem = function(itemGlob, message) {
  var selector = this.getItemSelector(itemGlob);
  t.assertSelectorExists(selector, message);
  return this;
};

Field.prototype.assertFollowHasItem = function(itemGlob, message) {
  var selector = this.getItemSelector(itemGlob);
  this.setSelector(selector);
  t.assertSelectorExists(selector, message);
  return this;
};

Field.prototype.getItemSelector = function (itemGlob) {
  // We assume itemGlob is a class if it has no special characters.
  if (/^[A-Za-z0-9\-]+$/.test(itemGlob)) {
    itemGlob = '.' + itemGlob;
  }

  return this.selector + ' ' + itemGlob;
};

