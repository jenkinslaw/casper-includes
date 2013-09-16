/*global Eval, Component, Menu, Field, Form, Field */
/*global FormField, Block, View, FormFactory, casper */

// Initializing steps.
var t              = casper.test;
var system         = require('system');
var casperIncludes = casper.cli.get('casperIncludes');
var casperTestsDir = casperIncludes + '/tests';
var Test           = function(){};
var testSlow       = casper.cli.get('testSlow');


casper.start();
(function(){
  "use strict";
  casper.then(function() {Test.Component();});
  casper.then(function() {Test.Field();});
  casper.then(function() {Test.Form();});
  casper.then(function() {Test.FormField();});
  casper.then(function() {Test.Menu();});
  casper.then(function() {Test.View();});
  casper.then(function() {if (testSlow === 'yes') Test.Slow(this);});
  casper.run(function(){t.done();});
}());

(function(){
  "use strict";
  Test.Component = function() {
    t.comment('-----------------------------');
    t.comment('Testing the Component object.');
    t.comment('-----------------------------');

    var component = new Component();
    t.assert(component instanceof Object, 'The Component object is defined.');
    t.assertEqual(component.nodeType, 'div', 'The default component type is a div.');
    t.comment('');
  };

  Test.Field = function() {
    t.comment('------------------------');
    t.comment('Testing the Field object.');
    t.comment('------------------------');
    var field = new Field('field-selector');
    t.assertEqual(field.selector, 'field-selector', 'The field selector is set properly.');

    t.assertEqual(field.getItemSelector('item'), 'field-selector .item', 'Field#geItemSelector works as expected.');
    t.assert(field instanceof Component, 'Fields are components.');
    t.comment('');
  };

  Test.Form = function() {
    t.comment('------------------------');
    t.comment('Testing the Form object.');
    t.comment('------------------------');
    var form = new Form('my-form');

    var actual = form.getSelector();
    var expected = 'form#my-form';
    t.assertEqual(actual, expected, 'Form#getSelector works as exptected.');
    t.comment('');
  };

  Test.FormField = function() {
    t.comment('-----------------------------');
    t.comment('Testing the FormField object.');
    t.comment('-----------------------------');

    var formField = new FormField('myFormFieldID');
    var actual = formField.getSelector();
    var expected = 'input#myFormFieldID';
    t.assertEqual(actual, expected, 'FormField#Selector works as expected.');

    actual = formField.getLabelSelector();
    expected = 'label[for=myFormFieldID]';
    t.assertEqual(actual, expected, 'FormField#getLabelSelector works correctly.');

    t.comment('');
  };


Test.Menu = function() {
  t.comment('------------------------');
  t.comment('Testing the Menu object.');
  t.comment('------------------------');

  var menu = new Menu('secondary-menu');

  t.assert(menu instanceof Component, 'Menus are components.');
  t.assert(menu instanceof Block, 'The menu is a type of block.');
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-menu', 'Menu#getSelector works.');
  t.assert('assertExists' in menu, 'Menu#assertExists is available.');
  t.assertEqual(menu.getItemSelector('my-menu'), 'div#block-menu-secondary-menu a.menu-my-menu', 'Menu#getItemSelector works.');
  t.assert('assertItemExists' in menu, 'Menu#assertItemExists is available.');
  t.assert('assertItemName' in menu, 'Menu#assertItemName is available.');

  menu = new Menu();
  t.assertEqual(menu.getSelector(), 'div#block-menu-secondary-links', 'The default menu is the secondary menu.');
  t.comment('');
};

Test.View = function() {
  t.comment('------------------------');
  t.comment('Testing the View object.');
  t.comment('------------------------');

  var view = new View('whats-new');
  t.assert(view instanceof Component, 'Views are components.');

  t.assertEqual(view.getSelector(), 'div.view.view-whats-new', 'View returns correct view selector when passed a string.');

  view = new View('testview', 'block_2', true);
  t.assert(view.isBlock, 'This view is a block.');
  t.assertEqual(view.getSelector(), 'div#block-views-testview-block_2.block-views', 'View returns correct block selector.');

  var link = view.getFieldLinkSelector('content');
  var link_expected = 'div#block-views-testview-block_2.block-views div.view-content div.views-row-1 div.content a';
  t.assertEqual(link, link_expected, 'View#getFieldLinkSelector works as expected.');
  t.comment('');
};


Test.Block = function() {
  t.comment('------------------------');
  t.comment('Testing the Block object.');
  t.comment('------------------------');

  var block = new Block('my-block');
  t.assert(block instanceof Component, 'Blocks are components.');
  t.comment('');
};
}());

// Loading a page takes time.
// We can disable these test when we don't need them.
(function(){
  "use strict";
  Test.Slow = function(casper) {
    t.comment('-------------------------------------');
    t.comment('Testing page dependant functionality.');
    t.comment('-------------------------------------');
    t.comment('');

    Eval.dump(casperTestsDir);

    casper.open(casperTestsDir + '/includes/View.html').then(function() {
      Test.Slow.View(this);
    });

    casper.thenOpen(casperTestsDir + '/includes/Form.html', function() {
      Test.Slow.Form(this);
    });

    casper.then(function(){Test.Slow.FormField(this);});
  };

  Test.Slow.View = function(casper) {
    t.comment('### Tesing file dependant View stuff. ###');
    var view = new View('whats-new');
    view.assertHasContent('There are items in the "Of Interest" view.');
    view.assertExists('The of interest views list is present.');
    view.assertContentHasField('pic', 'The content has a pic field.');
    view.assertContentHasField('date', 'The content has a date field.')
    .assertHasItem('month-day', 'The date has a month-day field.');
    view.assertContentHasField('content','The content has a content field')
    .assertHasItem('h3 a', 'The cotent field has a link.');
    t.comment('');
  };

  Test.Slow.Form = function(casper) {
    t.comment('### Tesing file dependant Form stuff. ###');
    t.comment('The following tests were automatically generated using ecto.vim');
    t.comment('');
    t.comment('-------------------------------------');
    t.comment('Testing FormFactory and FieldFactory.');
    t.comment('-------------------------------------');

    var nodeForm = new FormFactory("node-form", casper);
    var fields = nodeForm.fields;
    nodeForm.assertExists("The form: node-form exists.");

    var fieldAskAddress0Additional = fields.fieldAskAddress0Additional;
    fieldAskAddress0Additional
    .assertExists("The field - field_ask_address[0][additional] is present.")
    .assertLabel("Address Line 2: ", "The field label is: Address Line 2: ")
    .assertType("text", "The field type is: text")
    .assertValue("Test Value", "The field value is: Test Value");
    casper.echo('');

    var fieldAskAddress0Street = fields.fieldAskAddress0Street;
    fieldAskAddress0Street
    .assertExists("The field - field_ask_address[0][street] is present.")
    .assertLabel("Address Line 1: ", "The field label is: Address Line 1: ")
    .assertType("text", "The field type is: text")
    .assertValue("", "The field value is: ");
    casper.echo('');

    var fieldAskClientFileNo0Value = fields.fieldAskClientFileNo0Value;
    fieldAskClientFileNo0Value
    .assertExists("The field - field_ask_client_file_no[0][value] is present.")
    .assertLabel("Client File #: ", "The field label is: Client File #: ")
    .assertType("text", "The field type is: text")
    .assertValue("", "The field value is: ");
    casper.echo('');

    var fieldAskDateNeeded0ValueDate = fields.fieldAskDateNeeded0ValueDate;
    fieldAskDateNeeded0ValueDate
    .assertExists("The field - field_ask_date_needed[0][value][date] is present.")
    .assertType("text", "The field type is: text")
    .assertValue("", "The field value is: ");
    casper.echo('');

    var fieldAskDeliveryTypevalue = fields.fieldAskDeliveryTypevalue;
    fieldAskDeliveryTypevalue
    .assertExists("The field - field_ask_delivery_type[value] is present.")
    .assertLabel("Mode of Delivery: *", "The field label is: Mode of Delivery: *")
    .assertType("select", "The field type is: select")
    .assertValue("Blank ", "The field value is: Blank ");

    fieldAskDeliveryTypevalue.options.Blank.assertValue("Blank%20", "The option value is: Blank%20")
    .assertLabel("%20-%20Blank%20-", "The option label  is: %20-%20Blank%20-");
    fieldAskDeliveryTypevalue.options.courier.assertValue("courier", "The option value is: courier")
    .assertLabel("Courier", "The option label  is: Courier");
    fieldAskDeliveryTypevalue.options.email.assertValue("email", "The option value is: email")
    .assertLabel("Email", "The option label  is: Email");
    fieldAskDeliveryTypevalue.options.fax.assertValue("fax", "The option value is: fax")
    .assertLabel("Fax", "The option label  is: Fax");
    fieldAskDeliveryTypevalue.options.fedex.assertValue("fedex", "The option value is: fedex")
    .assertLabel("FedEx", "The option label  is: FedEx");
    fieldAskDeliveryTypevalue.options.usps.assertValue("usps", "The option value is: usps")
    .assertLabel("USPS", "The option label  is: USPS");
    fieldAskDeliveryTypevalue.options.ups.assertValue("ups", "The option value is: ups")
    .assertLabel("UPS", "The option label  is: UPS");
    fieldAskDeliveryTypevalue.options.pickup.assertValue("pickup", "The option value is: pickup")
    .assertLabel("Pickup%20at%20Jenkins%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20", "The option label  is: Pickup%20at%20Jenkins%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20");
    casper.echo('');

    var op = fields.op;
    op
    .assertExists("The field - op is present.")
    .assertType("submit", "The field type is: submit")
    .assertValue("Submit", "The field value is: Submit");
    casper.echo('');


    t.comment('');
    t.comment('');
  };

  Test.Slow.FormField = function(casper) {
    t.comment('### Tesing file dependant FormField stuff. ###');
    var formField = new FormField('edit-field-ask-address-0-additional');
    var actual = formField.getLabel();
    var expected ='Address Line 2: ';
    t.assertEqual(actual, expected, 'Component#getLabel works from FormField.');

    formField.assertLabel('Address Line 2: ', 'Component#assertLabel works from FormField.');

    actual = formField.getValue();
    expected = 'Test Value';
    t.assertEqual(actual, expected, 'FormField#getValue works as expected.');

    formField.assertValue('Test Value', 'FormField#assertValue works as exptected');

    actual = formField.getName();
    expected ='field_ask_address[0][additional]';
    t.assertEqual(actual, expected, 'Component#getName works from FormField.');
    t.comment('');
  };
}());
