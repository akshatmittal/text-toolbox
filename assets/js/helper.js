var Helper = function() {};
Helper.prototype = {
  $: function(e) {
    return document.querySelector(e);
  },
  $$: function(e) {
    return document.querySelectorAll(e);
  },
  l: function(e) {
    return (e != null) ? e.length : 0;
  },
  s: function(e, f) {
    return (e != null) ? ((e < 300) ? (f - e) : "X") : 0;
  },
  t: function(e, f) {
    x = (e != null) ? (parseFloat((e / f).toFixed(2))) : 0;
    return Math.floor(x) + " Minutes, " + Math.floor((x % 1) * 60) + " Seconds";
  },
  n: function(e) {
    return (isNaN(e)) ? 0 : e;
  },
  flesch: function(e) {
    if (e < 30)
      return "Very Confusing";
    if (e < 50)
      return "Difficult";
    if (e < 60)
      return "Fairly Difficult";
    if (e < 70)
      return "Standard";
    if (e < 80)
      return "Fairly Easy";
    if (e < 90)
      return "Easy";
    return "Very Easy";
  },
  post: function(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
      function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
      }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3) {
        success(xhr.responseText);
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
  },
  get: function(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
      function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
      }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState > 3) {
        success(xhr.responseText);
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(params);
    return xhr;
  }
}
Helper = new Helper;