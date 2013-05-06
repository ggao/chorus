describe("chorus.pages.DataSourceIndexPage", function() {
    beforeEach(function() {
        this.page = new chorus.pages.DataSourceIndexPage();
        this.dataSourceSet = new chorus.collections.DataSourceSet([], {all: true});
        this.hdfsDataSourceSet = new chorus.collections.HdfsDataSourceSet();
        this.gnipDataSourceSet = new chorus.collections.GnipDataSourceSet();
    });

    describe("calls the handleFetchErrorsFor function", function() {
        beforeEach(function() {
            this.originalhandleFetchErrorsFor = chorus.pages.DataSourceIndexPage.handleFetchErrorsFor;
            spyOn(chorus.pages.DataSourceIndexPage.prototype, 'handleFetchErrorsFor');
        });

        it("handleFetchErrorsFor the data sources", function() {
            var page = new chorus.pages.DataSourceIndexPage();
            expect(page.handleFetchErrorsFor.calls.length).toEqual(3);
            expect(page.handleFetchErrorsFor.calls[0].args[0].constructor).toBe(chorus.collections.DataSourceSet);
            expect(page.handleFetchErrorsFor.calls[1].args[0].constructor).toBe(chorus.collections.HdfsDataSourceSet);
            expect(page.handleFetchErrorsFor.calls[2].args[0].constructor).toBe(chorus.collections.GnipDataSourceSet);
        });

        afterEach(function() {
            chorus.pages.DataSourceIndexPage.handleFetchErrorsFor = this.originalhandleFetchErrorsFor;
        });
    });

    it("has a helpId", function() {
        expect(this.page.helpId).toBe("instances");
    });

    it("fetches all data sources", function() {
        expect(this.dataSourceSet).toHaveBeenFetched();
    });

    it('fetches all hadoop data sources', function() {
        expect(this.hdfsDataSourceSet).toHaveBeenFetched();
    });

    it('fetches all gnip data sources', function() {
        expect(this.gnipDataSourceSet).toHaveBeenFetched();
    });

    it('passes the data sources and hadoop data sources to the content details view', function() {
        var contentDetails = this.page.mainContent.contentDetails;
        expect(contentDetails.options.hdfsDataSources).toBeA(chorus.collections.HdfsDataSourceSet);
        expect(contentDetails.options.dataSources).toBeA(chorus.collections.DataSourceSet);
        expect(contentDetails.options.gnipDataSources).toBeA(chorus.collections.GnipDataSourceSet);
    });

    it('passes the data sources, hadoop and gnip data sources to the list view', function() {
        var list = this.page.mainContent.content;
        expect(list.options.hdfsDataSources).toBeA(chorus.collections.HdfsDataSourceSet);
        expect(list.options.dataSources).toBeA(chorus.collections.DataSourceSet);
        expect(list.options.gnipDataSources).toBeA(chorus.collections.GnipDataSourceSet);
    });

    describe('#render', function(){
        beforeEach(function(){
            chorus.bindModalLaunchingClicks(this.page);
            this.page.render();
        });

        it('launches a new data source dialog', function() {
            var modal = stubModals();
            this.page.mainContent.contentDetails.$("button").click();
            expect(modal.lastModal()).toBeA(chorus.dialogs.DataSourcesNew);
        });

        it("sets the page model when a 'data_source:selected' event is triggered", function() {
            var dataSource = rspecFixtures.gpdbDataSource();
            expect(this.page.model).not.toBe(dataSource);
            chorus.PageEvents.trigger('data_source:selected', dataSource);
            expect(this.page.model).toBe(dataSource);
        });

        it("clears the page model when a 'clear_selection' event is triggered", function() {
            var dataSource = rspecFixtures.gpdbDataSource();
            chorus.PageEvents.trigger('data_source:selected', dataSource);
            chorus.PageEvents.trigger('clear_selection');
            expect(this.page.model).toBeUndefined();
        });

        it("clears the sidebar when a 'clear_selection' event is triggered", function() {
            spyOn(this.page.sidebar, 'clear');
            chorus.PageEvents.trigger('clear_selection');
            expect(this.page.sidebar.clear).toHaveBeenCalled();
        });

        it("displays the loading text", function() {
            expect(this.page.mainContent.contentDetails.$(".loading_section")).toExist();
        });
    });

    describe("when the data sources are fetched", function() {
        beforeEach(function() {
            this.server.completeFetchAllFor(this.dataSourceSet, [
                rspecFixtures.oracleDataSource(),
                rspecFixtures.gpdbDataSource()
            ]);

            this.server.completeFetchAllFor(this.hdfsDataSourceSet, [
                rspecFixtures.hdfsDataSource(),
                rspecFixtures.hdfsDataSource()
            ]);
            this.server.completeFetchAllFor(this.gnipDataSourceSet, [
                rspecFixtures.gnipDataSource(),
                rspecFixtures.gnipDataSource()
            ]);
        });

        it("doesn't display the loading text", function() {
            expect(this.page.mainContent.contentDetails.$(".loading_section")).not.toExist();
        });

        it('displays the data source count', function(){
            expect(this.page.mainContent.contentDetails.$(".number").text()).toBe("6");
        });

        it("fetches all datasets", function() {
            expect(this.server.lastFetchFor(this.dataSourceSet).params().all).toBe("true");
        });

        describe("multiple selection", function() {
            beforeEach(function() {
                this.page.render();
            });

            context("when nothing is checked", function() {
                it("does not display the multiple selection section", function() {
                    expect(this.page.$(".multiple_selection")).toHaveClass("hidden");
                });
            });

            context("when a row has been checked", function() {
                beforeEach(function() {
                    var dataSources = new chorus.collections.DataSourceSet([rspecFixtures.gpdbDataSource()]);
                    chorus.PageEvents.trigger("data_source:checked", dataSources);
                });

                it("displays the multiple selection section", function() {
                    expect(this.page.$(".multiple_selection")).not.toHaveClass("hidden");
                });

                it("has an action to edit tags", function() {
                    expect(this.page.$(".multiple_selection a.edit_tags")).toExist();
                });

                describe("clicking the 'edit_tags' link", function() {
                    beforeEach(function() {
                        this.modalSpy = stubModals();
                        this.page.$(".multiple_selection a.edit_tags").click();
                    });

                    it("launches the dialog for editing tags", function() {
                        expect(this.modalSpy).toHaveModal(chorus.dialogs.EditTags);
                        expect(this.modalSpy.lastModal().collection).toBe(this.page.multiSelectSidebarMenu.selectedModels);
                    });
                });
            });
        });
    });
});
