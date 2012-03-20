chorus.pages.HdfsEntryIndexPage = chorus.pages.Base.include(
    chorus.Mixins.InstanceCredentials.page
).extend({
    helpId: "instances",

    setup:function (instanceId, path) {
        this.path = "/" + path;
        this.instance = new chorus.models.Instance({id: instanceId});
        this.instance.fetch();
        this.bindings.add(this.instance, "loaded", this.entriesFetched);

        this.collection = new chorus.collections.HdfsEntrySet([], {instance: this.instance, path: this.path});
        this.collection.fetch();

        chorus.PageEvents.subscribe("hdfs_entry:selected", this.entrySelected, this)

        this.mainContent = new chorus.views.MainContentList({
            modelClass: "HdfsEntry",
            collection: this.collection
        });

        this.sidebar = new chorus.views.HdfsEntrySidebar({
            rootPath: this.path,
            instanceId: instanceId
        });

        var pathLength = _.compact(this.path.split("/")).length
        var mainCrumbs = [
            { label: t("breadcrumbs.home"), url: "#/" },
            { label: t("breadcrumbs.instances"), url: "#/instances" }
        ];

        this.breadcrumbs = new chorus.views.ModelBoundBreadcrumbsView({model: this.instance});
        this.breadcrumbs.getLoadedCrumbs = function () {
            return mainCrumbs.concat([
                { label: this.model.get("name") + (pathLength > 0 ? " (" + pathLength + ")" : "") }
            ]);
        };
        this.breadcrumbs.getLoadingCrumbs = function () {
            return mainCrumbs.concat([
                { label: "..."}
            ]);
        };
    },

    entriesFetched: function() {
        this.mainContent.contentHeader.options.title = this.instance.get("name") + ": " + this.ellipsizePath();
        this.render();
    },

    postRender: function() {
        if (this.path === "/") {
            return;
        }

        var $content = $("<ul class='hdfs_link_menu'/>");

        var $li = $("<li/>");
        $li.append(chorus.helpers.linkTo(this.instance.showUrl(), this.instance.get("name")).toString());
        $content.append($li);

        var pathSegments = this.collection.hdfsEntry().pathSegments();
        var maxLength = 20

        _.each(pathSegments, function(hdfsEntry) {
            var link = $("<a></a>").attr('href', hdfsEntry.showUrl()).text(_.truncate(hdfsEntry.get('name'), maxLength));
            $content.append($("<li></li>").append(link));
        });

        chorus.menu(this.$(".breadcrumb").eq(2), {
            content: $content,

            qtipArgs: {
                show: { event: "mouseenter"},
                hide: { event: "mouseleave", delay: 500, fixed: true }
            }
        });
    },

    ellipsizePath: function() {
        var folders = this.path.split('/')
        if (folders.length > 3) {
            return "/" + folders[1] + "/.../" + folders[folders.length-1]
        } else {
            return this.path
        }
    },

    entrySelected : function(model) {
        this.model = model;
    }
});
