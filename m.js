var locStor = function () {};

locStor.prototype.set = function () {
  if(typeof arguments[1] === 'object')
    window.localStorage.setItem(arguments[0], JSON.stringify(arguments[1]));
  else
    window.localStorage.setItem(arguments[0], arguments[1]);
}

locStor.prototype.get = function () {
  try {
    return JSON.parse(window.localStorage.getItem(arguments[0]));
  } catch(e) {
    return window.localStorage.getItem(arguments[0]);
  }
}

locStor.prototype.isSet = function () {
  var v = this.get(arguments[0]);

  if (v !== null && typeof v !== 'undefined')
    return true;
  else
    return false;
}

var storage = new locStor();

var options = function () {};

options.prototype.add = function (name, v) {
  this[name] = {};
  this[name].vDefault = v;

  var keyName = 'options:' + name;
  if (storage.isSet(keyName))
    this[name].v = storage.get(keyName);
  else {
    this[name].v = v;
    storage.set(keyName, v);
  }
}

options.prototype.set = function (name, v) {
  this[name].v = v;
  storage.set('options:' + name, v);

  return v;
}

var opt = new options();
var langList = ['en','es','ru'];

function pageLang() {
  var l;

  if (arguments.length > 0) {
    l = opt.set('lang', arguments[0]);
  } else {
    if (opt.lang.v === 'auto') {
      l = window.navigator.userLanguage || window.navigator.language || 'en';
      if (langList.indexOf(l) === -1) {
        if (langList.indexOf(l.split('-')[0]) > -1)
          l = l.split('-')[0];
        else
          l = 'en';
      }
    } else
        l = opt.lang.v;
  }

  var c = document.getElementsByClassName(l);
  if (c.length) {
    for (var j = 0; j < c.length; j++)
      c[j].style.display = 'block';
    for (var i = 0; i < langList.length; i++) {
      if (langList[i] !== l) {
        var c = document.getElementsByClassName(langList[i]);
        for (var j = 0; j < c.length; j++)
          c[j].style.display = 'none';
      }
    }
  } else {
    l = '';
    for (var i = 0; i < langList.length; i++) {
      var c = document.getElementsByClassName(langList[i]);
      if (!l && c.length)
        l = langList[i];
      if (langList[i] === l) {
        for (var j = 0; j < c.length; j++)
          c[j].style.display = 'block';
      } else {
        for (var j = 0; j < c.length; j++)
          c[j].style.display = 'none';
      }
    }
  }
}

function init() {
  opt.add('lang', 'auto');

  var langSelect = document.getElementById('langSelect');
  for (var i = 0; i < langList.length; i++) {
    c = document.getElementsByClassName(langList[i]);
    if (c.length) {
      for (var j = 0; j < c.length; j++)
        c[j].lang = langList[i];
      c = document.createElement('A');
      c.textContent = langList[i];
      c.setAttribute('href', 'javascript:pageLang(\'' + langList[i] + '\');');
      c.style.margin = '4px';
      langSelect.appendChild(c);
    } else {
      langList.splice(i, 1);
      i--;
    }
  }
  if (langSelect.children.length < 2)
    langSelect.style.display = 'none';

  pageLang();

  document.body.style.display = 'block';
};
