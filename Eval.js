/* global _add_page_title_boilerplate, t, casper */
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
(function(){
  "use strict";
  Eval.callFunctionMultiple = function(func, items){
    var args = [].slice.call(arguments).splice(2);
    for (var item in items){
      args.unshift(items[item]);
      Eval.callFunction(func, args);
      args.shift();
    }
  };

  Eval.callFunction = function(func){
    //build an array of arguments after the req'd initial one
    var args = [].slice.call(arguments).splice(1);
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
    var containsText = (actualText.search(expectedText) !== '-1');
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

  Eval.evalMouseEvent = function(element, test, event, callback, property, message, time){
    var pre =  casper[test](element);
    casper.waitFor(
      function() {
        casper.mouseEvent(event, element);
        if (time === undefined) {
          time = 1;
        }
        return casper.wait(time);
      },
      function then() {
        var post =  casper[test](element);
        return callback(pre, post, property, message );
      });
  };

  Eval.greaterThan = function(pre, post, property, message ){
    t.comment("Testing that " + post[property] + "is greater than " + pre[property]);
    var changed = (post[property] >  pre[property]);
    return t.assert(changed, message );
  };

  Eval.lessThan = function(pre, post, property, message ){
    t.comment("Testing that " + post[property] + "is less than " + pre[property]);
    var changed = (post[property] <  pre[property]);
    return t.assertEquals(changed, message );
  };
  Eval.equals =  function(pre, post, property, message){
    return t.assertEquals(pre, post, message);
  };
}());

String.prototype.toCamel = function(){
  "use strict";
  return this
  .replace(/\[/g, '')
    .replace(/(\][a-z])/g, function($1){return $1.toUpperCase().replace(']','');})
    .replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');})
    .replace(/(\_[a-z])/g, function($1){return $1.toUpperCase().replace('_','');})
    .replace(/\]/g,'');
};

String.prototype.trim = function() {
  "use strict";
  return $.trim(this);
};
