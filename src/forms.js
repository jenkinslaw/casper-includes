
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


FormField.prototype.isSelector = function() {return (this.nodeType == 'selector');};


FormField.prototype.assertValue = function (expected, message) {
  var selector = this.getSelector();
  var actual = this.getValue();
  t.assertEqual(actual, expected, message);
  return this;
};


/**
 * The Selector field requires it's own definition because
 * we need a place to add methods for handling options.
 */
var SelectField = function(id, id_type) {
  this.nodeType = 'select';
  this.type = 'select';
  this.id = id;
};

SelectField.prototype = new FormField();


/**
 * We need a serealized version of the select options to work with.
 */
SelectField.prototype.getOptions = function() {
  var options = {};
  if (typeof this.info.tag != 'undefined' && this.info.tag) {
    $('option', this.info.tag).each(function(index){
       var value = $(this).val();
       var label = $(this).text();
       var option = new SelectField.Option(value, label);

       options[option.key] = option;
    });
  }
  return options;
};



/**
 * Define an option class to handle option assertions.
 */
SelectField.Option = function(value, label) {
  this.key =  value.trim().toCamel();
  this.value = escape(value);
  this.label = escape(label);
};


/**
 * These options are built by the FieldFactory.
 * So assertions assume an option is already present.
 */
SelectField.Option.prototype.assertValue = function(expected, message) {
  var actual = this.value;
  t.assertEqual(actual, expected, message);
  return this;
};


SelectField.Option.prototype.assertLabel = function(expected, message) {
  var actual = this.label;
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
    var fieldKey = key.toCamel();
    form.fields[fieldKey] = FieldFactory(key, formValues, casper);
  }

  return form;
};


/**
 * Let's mitigate a little of the complexity of buildin the
 * correct field for the job using a FieldFactory.
 */
var FieldFactory = function(key, formValues, casper) {

    var field_selector =  '[name="' + key + '"]';
    var field_info     =  casper.getElementInfo(field_selector);
    var field_id       =  field_info.attributes.id;
    var field_type     =  field_info.attributes.type;

    var field = (field_info.nodeName == 'select') ?
    new SelectField(field_id) : new FormField(field_id);

    field.name     = key;
    field.field_id = key.toCamel();
    field.value    = formValues[key];
    field.label    = field.getLabel();
    field.type     = (field_type) ? field_type : field.type;
    field.info     = field_info;

    if (field.type == 'select') {
      field.options = field.getOptions();
    }

    return field;
};

