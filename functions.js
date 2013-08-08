function _login_user(casper, username){
  "use strict";
  var user = _get_roleuser(casper, username);
  _fill_submit_login_form(casper, user);
}

function _get_roleuser(casper, username) {
  "use strict";
  username = _roleuser_name_lower(username);
  var roleusers = casper.getGlobal('Drupal').settings.roleusers;
  var user = roleusers[username];
  return user;
}

function _fill_submit_login_form(casper, user_object){
  "use strict";
  casper.fill('#user-login-form',{
    'name' : user_object.name,
    'pass' : user_object.pass,
    'pass-fake' : user_object.pass
  }, true
  );
}

function _logout_user(casper) {
  "use strict";
  var logout_selector = ".wb-logout-link";
  casper.click(logout_selector);
}

function _roleuser_name_lower(username) {
  "use strict";
  username = username.toLowerCase();
  return username;
}

function _add_page_title_boilerplate(title) {
  "use strict";
  title += " | Jenkins Law Library";
  return title;
}
