function shoh(el, d) {
  if (!el) return;

  if (typeof el === 'string')
    for (var el = document.querySelectorAll(el), i = 0; i < el.length; i++)
      el[i].style.display = (el[i].style.display === 'none') ? d ? d : 'block' : 'none';
  else if (!el.style)
    for (var i = 0; i < el.length; i++)
      shoh(el[i], d);
  else
    el.style.display = (el.style.display === 'none') ? d ? d : 'block' : 'none';
}

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

options.prototype.save = function (name) {
  storage.set('options:' + name, this[name].v);
}

var opt = new options();
var langList = ['en','es','ru'];

function pageBye() {
  var c = document.getElementById('bye');

  if (arguments[0] === false) {
    document.body.style.overflowY = 'auto';
    c.style.display = 'none';
  } else {
    document.body.style.overflowY = 'hidden';
    c.style.display = 'flex';
    c.style.top = window.pageYOffset + 'px';
    c.style.height = window.innerHeight + 'px';
  }
}

function pageLang() {
  var i, j, c, l;

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

  var mc = [document.getElementById('mc'), document.getElementById('bye')];
  for (var k = 0; k < mc.length; k++) {
    c = mc[k].querySelectorAll('[lang="' + l + '"]');
    if (c.length) {
      for (j = 0; j < c.length; j++)
        c[j].style.display = ((c[j].nodeName === 'A' || c[j].nodeName === 'SPAN') ? 'inline' : 'block');
      for (i = 0; i < langList.length; i++)
        if (langList[i] !== l) {
          c = mc[k].querySelectorAll('[lang="' + langList[i] + '"]');
          for (j = 0; j < c.length; j++)
            c[j].style.display = 'none';
        }
    } else {
      l = '';
      for (i = 0; i < langList.length; i++) {
        c = mc[k].querySelectorAll('[lang="' + langList[i] + '"]');
        if (!l && c.length)
          l = langList[i];

        if (langList[i] === l)
          for (j = 0; j < c.length; j++)
            c[j].style.display = ((c[j].nodeName === 'A' || c[j].nodeName === 'SPAN') ? 'inline' : 'block');
        else
          for (j = 0; j < c.length; j++)
            c[j].style.display = 'none';
      }
    }
  }
}

function init() {
  var i, j, c;

  if (typeof window.matchMedia === 'function' && window.matchMedia('screen').matches)
    for (i = 0; i < 40; i++)
      if (!window.matchMedia('(min-resolution: ' + (96 + i * 24) + 'dpi)').matches) {
        document.body.style['font-size'] = (1 + (i - 1) * 0.15) + 'em';
        break;
      }

  c = document.getElementsByTagName('A');
  for (i = 0; i < c.length; i++) {
    if (c[i].href.length > 1 && (c[i].href.indexOf(document.domain) === -1
      || c[i].href.slice(0, 23) === 'https://github.com/slr/'))  // FIXME temp
      c[i].setAttribute('onclick', 'pageBye();');
  }

  opt.add('lang', 'auto');

  var langSelect = document.getElementById('langSelect');
  for (i = 0; i < langList.length; i++)
    if (document.querySelector('[lang="' + langList[i] + '"]') !== null) {
      c = document.createElement('A');
      c.textContent = langList[i];
      c.setAttribute('onclick', 'pageLang(\'' + langList[i] + '\');');
      langSelect.appendChild(c);
    }

  var c = document.getElementById('mc'), ft = c.querySelector('article footer');
  if (ft)
    c = ft.parentNode;
  else if (c.getElementsByTagName('article').length)
    c = c.getElementsByTagName('article');

  for (i = 0; i < langList.length; i++)
    if (c.querySelector('[lang="' + langList[i] + '"]') === null)
      c.insertBefore(document.getElementById('temp-no-lang').querySelector('[lang="' + langList[i] + '"]'), ft);

  document.body.setAttribute('onpageshow', 'pageBye(false);');

  document.body.style.display = 'block';

  pageLang();

  c = document.getElementsByClassName('img-ph');
  for (i = 0; i < c.length; i++)
    if ((j = c[i].getAttribute('data-src')) !== null) {
      c[i].outerHTML = '<img src="' + j + '"'
        + ' alt="' + ((j = c[i].getAttribute('data-alt')) !== null ? j : '') + '"'
        + (j !== null ? ' title="' + j + '"' : '')
        + ' class="' + c[i].className.replace('img-ph', '').trim() + '"'
        + ' style="' + ((j = c[i].style.width) !== '' ? 'width:' + j + ';' : '')
        + ((j = c[i].style.height) !== '' ? 'height:' + j + ';' : '') + '" />';
      i--;
    }

  c = document.getElementsByClassName('vid-ph');
  for (i = 0; i < c.length; i++)
    if ((j = c[i].getAttribute('data-src')) !== null) {
      c[i].outerHTML = '<div class="vid ' + c[i].className.replace('vid-ph', '').trim() + '">'
        + '<iframe src="' + j + '"'
        + ((j = c[i].style.width) !== '' ? ' width="' + j + '"' : '')
        + ((j = c[i].style.height) !== '' ? ' height="' + j + '"' : '')
        + ' frameborder="0" allowfullscreen></iframe></div>';
      i--;
    }
}
