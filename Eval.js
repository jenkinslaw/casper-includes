
var casperIncludes  = casper.cli.get('casperIncludes');

phantom.injectJs(casperIncludes + '/vendor/jquery.min.js');
phantom.injectJs(casperIncludes + '/functions.js');
phantom.injectJs(casperIncludes + '/src/components.js');
phantom.injectJs(casperIncludes + '/src/blocks.js');
phantom.injectJs(casperIncludes + '/src/menus.js');
phantom.injectJs(casperIncludes + '/src/forms.js');
phantom.injectJs(casperIncludes + '/src/views.js');

/**
* @file
* A place for our domain specific wrappers for casperjs functionality.
*/

var Eval = {};

Eval.callFunctionMultiple = function(func, items){
  args = Array().slice.call(arguments).splice(2);
  for (var item in items){
    args.unshift(items[item]);
    Eval.callFunction(func, args);
    args.shift();
<<<<<<< HEAD
  } 
=======
    console.dir(args);
  }
>>>>>>> 1819c184f468f4e779ba366944f8a6d17ac87d00
};

Eval.callFunction = function(func){
  //build an array of arguments after the req'd initial one
  args = Array().slice.call(arguments).splice(1);
  return func.apply(this, args);
};


/*
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

/**
 * Figures out if there is content given a content selector.
 */
Eval.contentHasItems = function(selector) {
  return $(selector).length >= 1;
};


Eval.itemHasContent = function(selector) {
  var Item = $(selector.item);
  return $(selector.content, Item).length >= 1;
};

Eval.itemHasClass =  function(selector){
  return $(selector.item).hasClass(selector.classname);
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

Eval.assertItemHasClass = function(itemSelector, classSelector, message){
 var Arguments = {
  'selector':
   { 'item' : itemSelector,
     'classname': classSelector
   }
 };
  return t.assertEval(this.itemHasClass, message, Arguments);
};

Eval.assertSelectorHasText = function(selector, expectedText, message){
  var actualText = (Eval.fetchFirstText(selector));
  var containsText = (actualText.search(expectedText) != '-1');
  return t.assert(containsText, message);

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

Eval.getElementValue = function(element){
  return casper.evaluate(
    function(element){
      return $(element).attr('value');
    }, element);
};

Eval.evalMouseEvent = function(element, test, event, callback, property, message){
  var pre =  test(element);
  casper.waitFor( 
     function() {
      return casper.mouseEvent(event, element);
     },
     function then() {
        post =  test(element);
        return callback(pre, post,  message );
     });
};

Eval.greaterThan = function(pre, post, property, message ){
  var changed = (post[property] >  pre[property]);
   return t.assert(changed, message );
};

Eval.lessThan = function(pre, post, property, message ){
  var changed = (post[property] <  pre[property]);
   return t.assertEquals(changed, message );
};
Eval.equals =  function(pre, post, property, message){
    return t.assertEquals(pre, post, message);
};


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


/**
 * Defines a class to handle form assertions.
 */
var Form = function(id, id_type) {
  this.id = id;
  this.setDefaults(id_type);
};

Form.prototype = new Component('form');
Form.prototype.setDefaults = function(id_type) {
  var defaults = this.getDefaults();
  this.id_type = (typeof id_type == 'undefined') ? defaults.id_type : id_type;
  return this;
};


/**
 * Define abstract FormField Class.
 */
var FormField = function(id, id_type) {
  this.id = id;
};

FormField.prototype = new Component('input');

FormField.prototype.getValue = function() {
  selector = this.getSelector();
  if (typeof this.value == 'undefined') {
    return casper.getElementAttribute(selector, 'value');
  }
  else {
    return this.value;
  }
};


FormField.prototype.assertType  =  function(expected, message) {
  var actual = this.getType();
  t.assertEqual(actual, expected, message);
  return this;
};

FormField.prototype.getType  =  function() {

  selector = this.getSelector();

  if (typeof this.type == 'undefined') {
    return casper.getElementAttribute(selector, 'type');
  }
  else {
    return this.type;
  }
};
 
FormField.prototype.assertValue = function (expected, message) {
  var selector = this.getSelector();
  var actual = this.getValue();
  t.assertEqual(actual, expected, message);
  return this;
};





/**
 * Factory for a fully formed form object, fields and all.
 */
var FormFactory = function(id, casper) {
  var form = new Form(id);
  form.fields = {};

  var formValues = casper.getFormValues(form.getSelector());
  for (var key in formValues) {

    var field_selector = '[name="' + key + '"]';
    var field_id = casper.getElementAttribute(field_selector, 'id');
    var field_type = casper.getElementAttribute(field_selector, 'type');

    var fieldKey = key.toCamel();

    form.fields[fieldKey] = new FormField(field_id);
    form.fields[fieldKey].type = field_type;
    form.fields[fieldKey].name = key;
    form.fields[fieldKey].value = formValues[key];
    form.fields[fieldKey].label = form.fields[fieldKey].getLabel();

  }
  return form;
};



String.prototype.toCamel = function(){
  return this
    .replace(/\[/g, '')
    .replace(/(\][a-z])/g, function($1){return $1.toUpperCase().replace(']','');})
    .replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');})
    .replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');})
    .replace(/\]/g,'');
};

String.prototype.trim = function() {
  return $.trim(this);
};

