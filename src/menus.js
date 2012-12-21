
/**
 * Define Drupal Menu and casper behaviors.
 */
var Menu = function(id){
  this.id = (typeof id === 'undefined') ? this.getDefaults().id : id;
  this.blockType = 'menu';
};

Menu.prototype = new Block('menu');

Menu.prototype.assertItemExists = function(item, message) {
  var selector = this.getItemSelector(item);
  t.assertSelectorExists(selector, message);
  return this;
};

Menu.prototype.getItemSelector = function(item) {
  var selector = this.getSelector();
  return selector + ' a.menu-' + item;
};


Menu.prototype.assertItemName = function (item, name, message) {
  var selector = this.getItemSelector(item);
  t.assertSelectorHasText(selector, name, message);
  return this;
};

Menu.prototype.getDefaults  = function() {
  return {
    id : 'secondary-links'
  };
};
