/* global Component: true */
/**
 * Define Drupal Block and casper behaviors.
 */
var Block = {};
(function(){
  "use strict";
   Block = function(id, title) {
    var defaults = {
      id : '',
      title : ''
    };

    this.id = (typeof id === 'undefined') ? defaults.id : id;
    this.title = (typeof title === 'undefined') ? defaults.title : title;
  };

  Block.prototype = new Component('block');

  Block.prototype.assertHasView = function(view) {
  };

  Block.prototype.getSelector = function(id) {
    id = (typeof id === 'undefined') ? this.id : id;
    var selector = (typeof this.selector === 'undefined') ?'div#block-' : this.blockSelector;
    var type = this.getType();

    return selector + type +  id;
  };

  Block.prototype.getType = function() {
    return (typeof this.blockType === 'undefined') ? '' : this.blockType + '-';
  };

  Block.prototype.assertTitle = function(title) {
  };

  Block.prototype.blockSelector = 'div#block-';

}());
