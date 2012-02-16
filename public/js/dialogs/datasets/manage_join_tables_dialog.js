chorus.dialogs.ManageJoinTables = chorus.dialogs.Base.extend({
    className: "manage_join_tables",
    additionalClass: "with_sub_header",
    title: t("dataset.manage_join_tables.title"),

    events: {
        "click li":     "tableClicked",
        "click a.join": "joinLinkClicked"
    },

    setup: function() {
        this.model = this.pageModel.schema();
        this.resource = this.collection = this.model.databaseObjects();
        this.collection.fetch();
    },

    postRender: function() {
        var originalId = this.pageModel.get("id");
        this.collection.remove(this.collection.get(originalId));
    },

    tableClicked: function(e) {
        var clickedLi = $(e.target).closest("li");
        this.$("li").removeClass("selected");
        clickedLi.addClass("selected");
    },

    joinLinkClicked: function(e) {
        var clickedId = $(e.target).closest("li").attr("table_id")
        var databaseObject = this.collection.findWhere({ id: clickedId });

        var joinConfigurationDialog = new chorus.dialogs.JoinConfiguration({ destinationObject: databaseObject });
        this.launchSubModal(joinConfigurationDialog);
    },

    additionalContext: function() {
        return { canonicalName: this.model.canonicalName() }
    },

    collectionModelContext: function(model) {
        return {
            isView:  model.metaType() == "view",
            iconUrl: model.iconUrl({ size: "small" })
        };
    }
});
