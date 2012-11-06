function _login_user(casper, username){
  user = _get_roleuser(casper, username);
  _fill_submit_login_form(casper, user);
}

function _get_roleuser(casper, username) {
  username = _roleuser_name_lower(username);
  roleusers = casper.getGlobal('Drupal').settings.roleusers;
  user = roleusers[username];
  return user;
}

function _fill_submit_login_form(casper, user_object){
  casper.fill('#user-login-form',{
   'name' : user_object.name,
   'pass' : user_object.pass,
   'pass-fake' : user_object.pass
   }, true
   );
  }

function _logout_user(casper) {
  logout_selector = ".wb-logout-link";
  casper.click(logout_selector);
}

function _roleuser_name_lower(username) {
  username = username.toLowerCase();
  return username;
}

function _add_page_title_boilerplate(title) {
  title += " | Jenkins Law Library";
  return title;
}
