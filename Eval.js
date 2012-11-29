
/**
 * @file 
 * A place to hold general external evaluations.
 */

var Eval = {};

/**
 * Figures out if there is content given a content selector.
 */
Eval.contentHasItems = function(selector) {
  return $(selector).length >= 1;
}


Eval.itemHasContent = function(itemSelector, contentSelector) {
  var Item = $(itemselector);
  return $(contentSelector, Item).length >= 1;
}

Eval.assertContentHasItems = function(selector, message) {
  var Arguments = { 
    'selector' : selector 
  };
  return t.assertEval(this.contentHasItems, message, Arguments);
}

Eval.assertItemHasCotent = function(itemSelector, contentSelector, message) {
  var Arguments = {
    'itemSelector' : itemSelector,
    'contentSelector' : contentSelector
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
  return Eval.assertTitle('Login Required', message)
}

Eval.assertViewExists = function(view) {
  var viewSelector = this.getViewSelector(view);
}

Eval.getViewSelector = function(view) {
   if (blockView = this.isBlockView(view)) {
     view = '';   
   } else {
      view = '';
   }
   return view;
}

Eval.assertViewHasContent = function(view) {
  var selector  = this.getViewSelector(view);
}

Eval.assertBlockHasView = function(block, view) {
}

Eval.isBlockView = function(block, view) {
}

Eval.assertViewHasContent = function(view) {
  var selector = this.getViewSelector(view);
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
  return selector + ' div.views-row-1 div.';
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
  t.assertSelectorExists(selector, message);
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
  t.assertSelectorExists(selector, message);
}

Eval.getSecondaryMenuSelector = function(menu) {
  var selector = this.getBlockSelector('menu-secondary-links');
  return selector + ' a.menu-' + menu;
}


Eval.assertSecondaryMenuName = function (menu, name, message) {
  var selector = this.getSecondaryMenuSelector(menu);
  t.assertSelectorHasText(selector, name, message);
}

Eval.assertPrimaryMenuExists = function(menu) {
}

