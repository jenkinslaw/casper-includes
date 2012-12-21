phantom.injectJs('casper-includes/vendor/jquery.min.js');
phantom.injectJs('casper-includes/functions.js');
phantom.injectJs('casper-includes/src/components.js');
phantom.injectJs('casper-includes/src/blocks.js');
phantom.injectJs('casper-includes/src/menus.js');
phantom.injectJs('casper-includes/src/forms.js');
phantom.injectJs('casper-includes/src/views.js');

/**
* @file
* A place for our domain specific wrappers for casperjs functionality.
*/

var Eval = {};

Eval.callFunctionMultiple = function(func, items){
  args = Array().slice.call(arguments).splice(2);
  for (var item in items){
    console.dir(args);
    args.unshift(items[item]);
    console.dir(args);
    Eval.callFunction(func, args);
    console.dir(args);
    args.shift();
    console.dir(args);
  }
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

Eval.evalMouseEvent = function(element, test, event, callback, property, message){
  var pre =  casper[test](element);
  casper.waitFor(
    function() {
      return casper.mouseEvent(event, element);
    },
    function then() {
        post =  casper[test](element);
        return callback(pre, post, property, message );
    });
};

Eval.greaterThan = function(pre, post, property, message ){
  var changed = (post[property] >  pre[property]);
   return t.assert(changed, message );
};

Eval.lessThan = function(pre, post, property, message ){
  var changed = (post[property] <  pre[property]);
   return t.assert(changed, message );
};


/*
 * More operator based functions coudl go here
 */


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

