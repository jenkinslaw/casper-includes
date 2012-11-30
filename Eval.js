
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
* Figures out if there is content given a content selector.
*/
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

/**
* Fetch the text of the first found of given selector.
*/
Eval.fetchFirstText = function(selector) {
  var Arguments = {
    'selector' : selector
  };

  return casper.evaluate(function(selector){
    return $(selector + ':first').text();
  }, Arguments);
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

Eval.assertViewExists = function(view, message) {
  var selector = this.getViewSelector(view);
  return t.assertSelectorExists(selector, message);
}

Eval.getViewSelector = function(view) {
  if (this.isBlockView(view)) {
    return this.getBlockViewSelector(view);
  }
  else {
    return 'div.view.view-' + view;
  }
}

Eval.getBlockViewSelector = function(view) {
 if (typeof view.id != 'undefined' && typeof view.label != 'undefined') {
   var selector = 'views-' + view.id + '-' + view.block;
 }
  return this.getBlockSelector(selector);
}

Eval.assertBlockHasView = function(block, view) {
}

Eval.isBlockView = function(view) {
  return (typeof view.block != "undefined");
}

Eval.assertViewHasContent = function(view, message) {
  var selector = this.getViewFirstRowSelector(view);
  this.dump(selector);
  return t.assertSelectorExists(selector, message);
}

Eval.getViewFirstRowSelector = function(view) {
  var selector = this.getViewContentSelector(view);
  return selector + ' .views-row-first';
}

Eval.getViewContentSelector = function(view) {
  var selector  = this.getViewSelector(view);
  return selector + ' div.view-content';
}

Eval.assertViewContentHasField = function(view, field) {
  var selector = this.getViewFieldSelector(view, field);
}

Eval.getViewFieldSelector = function(view, field) {
  var selector  = this.getViewContentSelector(view);
  return selector + ' div.views-row-1 div.' + field;
}

Eval.assertViewFieldHasLink = function(view, field) {
  var selector = this.getViewFieldLinkSelector(view, field);
}

Eval.getViewFieldLinkSelector = function (view, field) {
  var selector = this.getViewFieldSelector('view', 'field');
  return selector + ' a';
}

Eval.getViewFieldURL = function (view, field) {
  var selector = getViewFieldLinkSelector(view, field);
}

Eval.assertPageHasForm = function(form) {
}

Eval.assertBlockExists = function(block, message) {
  var selector = this.getBlockSelector(block);
  return t.assertSelectorExists(selector, message);
}

Eval.getBlockSelector = function(block) {
  return 'div#block-' + block;
}

Eval.assertBlockTitle = function(block, title) {
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

