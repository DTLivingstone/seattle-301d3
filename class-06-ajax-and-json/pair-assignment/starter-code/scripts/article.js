function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

// DONE: Instead of a global `articles = []` array, let's track this list of all articles directly on the
// constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves
// objects, which means we can add properties/values to them at any time. In this case, we have
// a key/value pair to track, that relates to ALL of the Article objects, so it does not belong on
// the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// DONE: There are some other functions that also relate to articles across the board, rather than
// just single instances. Object-oriented programming would call these "class-level" functions,
// that are relevant to the entire "class" of objects that are Articles.

// DONE: This function will take our data, how ever it is provided,
// and use it to instantiate all the articles. This code is moved from elsewhere, and
// encapsulated in a simply-named function for clarity.
Article.loadAll = function(dataPassedIn) {
  dataPassedIn.sort(function(a,b) {
  });

  dataPassedIn.forEach(function(ele) {
    Article.all.push(new Article(ele));
  });
};

// This function below will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
Article.fetchAll = function() {
  $.ajax({
    type: 'HEAD',
    url: 'data/hackerIpsum.json',
    success: function(data, message, xhr){
      var eTag = xhr.getResponseHeader('eTag');
      if (eTag === localStorage.eTag){
        Article.loadAll(JSON.parse(localStorage.savedHackerIpsum));
        articleView.initIndexPage();
      } else {
        $.getJSON('data/hackerIpsum.json', function(data) {
          Article.loadAll(data);
          localStorage.savedHackerIpsum = JSON.stringify(data);
          localStorage.eTag = eTag;
          articleView.initIndexPage();
        });
      }
    }
  });
};
