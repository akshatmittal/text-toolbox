var Main = function() {
  this.options = {
    elements: {
      textarea: Helper.$("#select-textarea"),
      words: Helper.$("#select-words"),
      uniqueWords: Helper.$("#select-u-words"),
      characters: Helper.$("#select-characters"),
      noSpaceCharacters: Helper.$("#select-s-characters"),
      twitter: Helper.$("#select-count-twitter"),
      google: Helper.$("#select-count-google"),
      facebook: Helper.$("#select-count-facebook"),
      sentences: Helper.$("#select-sentences"),
      paragraphs: Helper.$("#select-paragraphs"),
      pages: Helper.$("#select-pages"),
      readingTime: Helper.$("#select-reading"),
      speakingTime: Helper.$("#select-speaking"),
      writingTime: Helper.$("#select-writing"),
      readability: Helper.$("#select-readability")
    },
    buttons: {
      buttonClear: Helper.$("#button-clear"),
      buttonShare: Helper.$("#button-share"),
      buttonLoad: Helper.$("#button-load"),
      buttonCloseShare: Helper.$("#button-close-share")
    },
    speed: {
      reading: 275,
      speaking: 180,
      writing: 90
    },
    arrays: {
      words: null,
      sentences: null
    },
    misc: {
      gist: "Saved from Handy Text Toolbox",
      permalink: "https://akshatmittal.com/text-toolbox/"
    }
  };
  this.values = {
    words: 0,
    uniqueWords: 0,
    characters: 0,
    noSpaceCharacters: 0,
    twitter: 0,
    google: 0,
    facebook: 0,
    sentences: 0,
    paragraphs: 0,
    pages: 0,
    readingTime: 0,
    speakingTime: 0,
    writingTime: 0,
    readability: 0
  };
  this.text = "";
}
Main.prototype.trackPage = function(e) {
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
  ga('create', 'UA-50190232-8', 'auto');
  ga('require', 'displayfeatures');
  ga('send', 'pageview', {
    'page': location.pathname + location.search + location.hash
  });

  if (window.location.protocol != "https:") window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
  if (self != top) top.location = self.location;
}
Main.prototype.getText = function() {
  return 'value' in this.options.elements.textarea ? this.options.elements.textarea.value : this.options.elements.textarea.innerText;
}
Main.prototype.updateText = function(e) {
  this.options.elements.textarea.value = e;
  this.updateAll();
};
Main.prototype.populate = function() {
  for (var key in this.options.elements) {
    if (key == "textarea") continue;
    this.options.elements[key].textContent = this.values[key];
  }
}
Main.prototype.updateAll = function() {
  this.text = this.getText();
  localStorage.setItem("text", this.text);
  this.basic();
  this.writer();
  this.social();
  this.time();
  this.readability();
  this.populate();
}
Main.prototype.basic = function() {
  this.options.arrays.words = this.text.match(/\b[-?(\w+)?]+\b/gi);
  this.options.arrays.uniqueWords = this.text.match(/(\w+\b)(?!.*\1\b)/gi);

  this.values.words = Helper.l(this.options.arrays.words);
  this.values.uniqueWords = Helper.l(this.options.arrays.uniqueWords);
  this.values.characters = Helper.l(this.text);
  this.values.noSpaceCharacters = Helper.l(this.text.replace(/\s/g, ''));
}
Main.prototype.writer = function() {
  this.options.arrays.sentences = this.text.split(/[.|!|?]+/g);

  this.values.sentences = Helper.l(this.options.arrays.sentences);
  this.values.paragraphs = 1 + (this.text.match(/\n+/gi) ? this.text.match(/\n+/gi).length : 0);
  this.values.pages = (this.values.words / 400).toFixed(2);
}
Main.prototype.social = function() {
  this.values.twitter = Helper.s(this.values.characters, 140);
  this.values.google = Helper.s(this.values.characters, 160);
  this.values.facebook = Helper.s(this.values.characters, 250);
}
Main.prototype.time = function() {
  this.values.readingTime = Helper.t(this.values.words, this.options.speed.reading);
  this.values.speakingTime = Helper.t(this.values.words, this.options.speed.speaking);
  this.values.writingTime = Helper.t(this.values.noSpaceCharacters, this.options.speed.writing);
}
Main.prototype.readability = function() {
  if (this.values.words < 15) {
    this.values.readability = "Minimum 15 words required.";
  } else {
    var syllables = this.text.match(/[aiouy]+e*|e(?!d$|ly).|[td]ed|le[\.!\?,\s]+ +/g);
    this.values.readability = Helper.n(206.835 - (1.015 * (this.values.words / this.values.sentences)) - (84.6 * (Helper.l(syllables) / this.values.words))).toFixed(2);
    this.values.readability += " — " + Helper.flesch(this.values.readability);
  }
}
Main.prototype.share = function() {
  if (this.text == "") {
    alert("Empty text!");
    return;
  }
  var el = Helper.$("#button-share");
  if (el.classList.contains("isLoading")) return;
  el.classList.add("isLoading");
  var gist = {
    "public": true,
    "description": this.options.misc.gist + " (" + this.options.misc.permalink + ")",
    "files": {
      "shared.txt": {
        "content": this.text
      }
    }
  };
  Helper.post("https://api.github.com/gists", JSON.stringify(gist), function(e) {
    e = JSON.parse(e);
    var ID = e.html_url.split("https://gist.github.com/")[1];
    history.pushState(null, null, "#!/" + ID);
    el.classList.remove("isLoading");
    document.body.classList.add("shareLink");
    Helper.$("#select-shareable").value = Main.options.misc.permalink + "#!/" + ID;
  });
};
Main.prototype.loadGist = function(id) {
  Helper.get("https://api.github.com/gists/" + id, {}, function(e) {
    e = JSON.parse(e);
    var files = e.files;
    if (files && "shared.txt" in files) {
      Main.updateText(files['shared.txt'].content);
    } else {
      alert("Invalid Save");
      if (localStorage.getItem("text")) {
        Main.updateText(localStorage.getItem("text"));
      }
    }
    document.body.classList.remove("gistLoad");
  });
}
Main.prototype.init = function() {
  this.trackPage();
  var gid = location.hash.split("!/")[1];
  if (gid) {
    document.body.classList.add("gistLoad");
    this.loadGist(gid);
  } else {
    if (localStorage.getItem("text")) {
      Main.updateText(localStorage.getItem("text"));
    }
  }
  this.options.elements.textarea.onkeyup = function() {
    Main.updateAll();
  }
  this.options.buttons.buttonClear.onclick = function(e) {
    Main.updateText("");
  }
  this.options.buttons.buttonShare.onclick = function() {
    Main.share();
  };
  this.options.buttons.buttonCloseShare.onclick = function() {
    document.body.classList.remove("shareLink");
  };
  this.options.buttons.buttonLoad.onclick = function() {
    var reader = new FileReader();
    var el = Helper.$("#load-hidden");
    reader.onload = function(e) {
      Main.updateText(e.target.result);
    };
    el.click();
    el.onchange = function(e) {
      if (el.files[0]) reader.readAsText(el.files[0]);
    }
  }
}
Main = new Main;
Main.init();