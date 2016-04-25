(function(module) {
  var adminController = {};

  adminController.index = function() {
    Article.fetchAll(articleView.initAdminPage);
    $('main > section').hide();
    $('#blog-stats').show();
  };

  module.adminController = adminController;
})(window);
