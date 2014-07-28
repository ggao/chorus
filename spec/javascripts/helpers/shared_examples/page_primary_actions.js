jasmine.sharedExamples.aPageWithPrimaryActions = function(actions) {
    function itBehavesLikeALink(selector, url){
        it("clicking the " + selector + " link navigates to " + url, function () {
            expect(this.navigationSpy).not.toHaveBeenCalledWith(url);
            this.$panel.find(selector).click();
            expect(this.navigationSpy).toHaveBeenCalledWith(url);
        });
    }

    describe("primary actions", function() {
        beforeEach(function () {
            this.$panel = this.page.$('.primary_action_panel');
            this.navigationSpy = this.navigationSpy || spyOn(chorus.router, "navigate");
            this.modalSpy = this.modalSpy || stubModals();
            this.model = this.page.primaryActionPanel.model;
            this.model.loaded = true;
            spyOn(this.model, 'canUpdate').andReturn(true);
            spyOn(this.model, 'isActive').andReturn(true);

            this.page.render();
        });

        it("has only these actions: " + _.pluck(actions, 'name'), function () {
            expect(this.$panel.find('.action').length).toEqual(actions.length);
        });


        _.each(actions, function (action) {
            var name = action.name;
            var target = action.target;
            var selector = "a." + name;

            it("contains an " + name + " link", function () {
                expect(this.$panel.find(selector)).toExist();
            });

            it(name + " has the correct translation", function () {
                expect(this.$panel.find(selector)).toContainTranslation("actions." + name);
            });

            (target instanceof Function) ? itBehavesLike.aDialogLauncher(selector, target) : itBehavesLikeALink(selector, target);
        }, this);
    });
};
