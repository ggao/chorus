chorus.views.BreadcrumbsView = chorus.views.Base.extend({
    constructorName: "BreadcrumbsView",
    templateName:"breadcrumbs",

    additionalContext: function () {
       /* jshint ignore:start */
       console.log ("BreadcrumbsView - > called additionalContext");
       /* jshint ignore:end */
        return { breadcrumbs: _.result(this.options, 'breadcrumbs') };
    },

    postRender: function() {
        var $crumb = this.$(".breadcrumb");
        _.each(this.context().breadcrumbs, function(breadcrumb, index){
            if (breadcrumb.data) {
                $crumb.eq(index).find('a').data(breadcrumb.data);
            }
        });
    }
});