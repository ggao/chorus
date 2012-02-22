describe("chorus.views.Activity", function() {
    beforeEach(function() {
        this.model = fixtures.activities.NOTE_ON_WORKSPACE();
        this.view = new chorus.views.Activity({ model: this.model });
    });

    describe("#render", function() {
        context("isNotification", function() {
            beforeEach(function() {
                this.presenter = new chorus.presenters.Activity(this.view.model);
                this.view.model = fixtures.activities.NOTE_ON_WORKSPACE();
                this.view.options.isNotification = true;
                this.view.render();
            });

            it("should not render comments", function() {
                expect(this.view.$(".comment_list")).not.toExist();
            });

            it("should not render the links", function() {
                expect(this.view.$(".links")).not.toExist();
            });

            it("should not have a DeleteNoteConfirmAlert", function() {
                expect(this.view.$("a[data-alert=DeleteNoteConfirmAlert]")).not.toExist();
            });

            it("should have a NotificationDeleteAlert", function() {
                expect(this.view.$("a[data-alert=NotificationDeleteAlert]")).toExist();
            });
        });

        context("type: MEMBERS_ADDED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.MEMBERS_ADDED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderWorkspaceDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))

            context("when only one member was added", function() {
                beforeEach(function() {
                    this.view.model.set({ user: [this.view.model.get("user")[0]] });
                    this.presenter = new chorus.presenters.Activity(this.view.model)
                    this.view.render();
                })

                it("calls out the user", function() {
                    expect(this.view.$(".activity_header a")).toContainText(this.view.model.get("user")[0].name)
                })
            })

            context("when more than one member was added", function() {
                it("calls out the first user", function() {
                    expect(this.view.$(".activity_header a")).toContainText(this.view.model.get("user")[0].name)
                })
            })
        });

        context("type: MEMBERS_DELETED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.MEMBERS_DELETED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderWorkspaceDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();

            context("when only one member was added", function() {
                beforeEach(function() {
                    this.view.model.set({ user: [this.view.model.get("user")[0]] });
                    this.presenter = new chorus.presenters.Activity(this.view.model)
                    this.view.render();
                })

                it("calls out the user", function() {
                    expect(this.view.$(".activity_header a")).toContainText(this.view.model.get("user")[0].name)
                })
            })

            context("when more than one member was added", function() {
                it("calls out the first user", function() {
                    expect(this.view.$(".activity_header a")).toContainText(this.view.model.get("user")[0].name)
                })
            })
        });

        context("type: WORKSPACE_CREATED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_CREATED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: USER_DELETED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.USER_DELETED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: false});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: INSTANCE_CREATED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.INSTANCE_CREATED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: WORKSPACE_DELETED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_DELETED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: false});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: WORKSPACE_MAKE_PRIVATE", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_MAKE_PRIVATE();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: WORKSPACE_MAKE_PUBLIC", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_MAKE_PUBLIC();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: WORKSPACE_ARCHIVED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_ARCHIVED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: WORKSPACE_UNARCHIVED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_UNARCHIVED();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
            itShouldNotRenderAnInsightLink();
        });

        context("type: NOTE", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.NOTE_ON_WORKSPACE();
                this.collection = new chorus.collections.ActivitySet();
                this.collection.add(this.view.model);

                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderWorkspaceDetails({checkLink: true});
            itShouldRenderACommentLink("comment", t("comments.title.NOTE"))

            it("displays the object type", function() {
                expect(this.view.$(".activity_header").text()).toMatch("commented on the workspace");
            })

            it("displays the comment body", function() {
                expect(this.view.$(".body").eq(0).text().trim()).toBe(this.view.model.get("text"));
            });

            it("displays the timestamp", function() {
                expect(this.view.$(".timestamp").text()).not.toBeEmpty();
            });

            context("when the current user is an admin", function() {
                beforeEach(function() {
                    setLoggedInUser({admin: true});
                    this.view.render();
                });

                it("displays a delete link", function() {
                    expect(this.view.$(".delete_link")).toExist();
                })
            })

            context("when the current user is not an admin", function() {
                context("and is not the author of the note", function() {
                    it("does not display a delete link if user is not the owner", function() {
                        expect(this.view.$(".delete_link")).not.toExist();
                    })
                })

                context("and is the author of the note", function() {
                    beforeEach(function() {
                        setLoggedInUser({name: "Lenny", lastName: "lalala", id: this.view.model.author().id});
                        this.view.render();
                    });

                    it("displays a delete link", function() {
                        expect(this.view.$(".delete_link")).toExist();
                    })
                })
            })

            context("when the delete link appears", function() {
                beforeEach(function() {
                    setLoggedInUser({name: "Lenny", lastName: "lalala", id: this.view.model.author().id});

                    // put view in page for correct alert click handling
                    this.page = new chorus.pages.Base();
                    chorus.bindModalLaunchingClicks(this.page);
                    this.page.mainContent = this.view;
                    this.page.render();
                });

                it("displays a hidden delete link", function() {
                    var deleteLink = this.view.$(".delete_link");
                    expect(deleteLink).toExist();
                    expect(deleteLink.text()).toContainTranslation("actions.delete")
                    expect(deleteLink).toBeHidden();
                });

                context("clicking delete note/comment", function() {
                    beforeEach(function() {
                        this.collection.attributes.entityType = "workspace";
                        this.collection.attributes.entityId = 10000;
                        stubModals();
                        this.view.$(".delete_link").click();
                    });

                    it("launches a delete note confirm alert", function() {
                        expect(chorus.modal).toBeA(chorus.alerts.DeleteNoteConfirmAlert);
                        expect(chorus.modal.model).toBeA(chorus.models.Comment);
                        expect(chorus.modal.model.id).toBe(this.model.id)
                        expect(chorus.modal.model.attributes.entityId).toBe(10000)
                        expect(chorus.modal.model.attributes.entityType).toBe("workspace")
                    });
                });

                context("clicking delete note/comment trashcan icon", function() {
                    beforeEach(function() {
                        this.collection.attributes.entityType = "workspace";
                        this.collection.attributes.entityId = 10000;
                        stubModals();
                        this.view.$(".delete_link img").click();
                    });

                    it("launches a delete note confirm alert", function() {
                        expect(chorus.modal).toBeA(chorus.alerts.DeleteNoteConfirmAlert);
                        expect(chorus.modal.model).toBeA(chorus.models.Comment);
                        expect(chorus.modal.model.id).toBe(this.model.id)
                        expect(chorus.modal.model.attributes.entityId).toBe(10000)
                        expect(chorus.modal.model.attributes.entityType).toBe("workspace")
                    });
                });
            });

            it("renders items for the sub-comments", function() {
                expect(this.model.get("comments").length).toBe(1);
                expect(this.view.$(".comments li").length).toBe(1);
            });

            it("has a link to promote the note to an insight", function() {
                expect(this.view.$(".links a.promote").text()).toMatchTranslation("activity_stream.promote");
            });

            describe("clicking the 'promote to insight' link", function() {
                beforeEach(function() {
                    this.view.$(".links a.promote").trigger("click");
                });

                it("posts to the comment insight api", function() {
                    expect(this.server.lastCreate().url).toBe("/edc/commentinsight/" + this.view.model.get("id") + "/promote");
                });

                describe("when the post completes", function() {
                    it("re-fetches the activity's collection", function() {
                        this.server.lastCreate().succeed();
                        expect(this.collection).toHaveBeenFetched();
                    });
                });
            });
        });

        context("type: INSIGHT_CREATED", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.INSIGHT_CREATED();
                this.collection = new chorus.collections.ActivitySet();
                this.collection.add(this.view.model);

                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            it("should have a ribbon", function() {
                expect(this.view.$(".insight_ribbon")).toExist();
                expect(this.view.$(".insight_ribbon")).toContainTranslation("insight.title");
            });

            it("adds the insight class to the view's element", function() {
                expect($(this.view.el)).toHaveClass("insight");
            });

            it("should say who promoted it and when", function() {
                expect(this.view.$(".promoted_by").html()).toMatchTranslation("insight.promoted_by", {
                    promoterLink: chorus.helpers.userProfileLink(new chorus.models.User(this.view.model.get("promotionActioner"))),
                    relativeTimestamp: chorus.helpers.relativeTimestamp(this.view.model.get("promotionTime"))
                });
            });

            itShouldRenderACommentLink("comment", t("comments.title.ACTIVITY"));

            context("when the current user in an admin", function() {
                beforeEach(function() {
                    setLoggedInUser({admin: true});
                    this.view.render();
                });

                itShouldRenderPublishOrUnpublishLinks();
            });

            context("when the current user is the creator of the insight", function() {
                beforeEach(function() {
                    setLoggedInUser({name: "Lenny", lastName: "lalala", id: this.view.model.author().id});
                    this.view.render();
                });

                itShouldRenderPublishOrUnpublishLinks();
            });

            context("when the current user is not an admin or the creator of the insight", function() {
                beforeEach(function() {
                    setLoggedInUser({name: "Johnny", lastName: "nobody", id: this.view.model.author().id + 1});
                    this.view.render();
                });

                it("should not show publish/unpublish links", function() {
                    expect(this.view.$("a.publish")).not.toExist();
                    expect(this.view.$("a.unpublish")).not.toExist();
                });
            });
        });

        context("type: WORKSPACE_ADD_SANDBOX", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKSPACE_ADD_SANDBOX();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderAuthorDetails();
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
        });

        context("type: WORKFILE_UPGRADED_VERSION", function() {
            beforeEach(function() {
                this.view.model = fixtures.activities.WORKFILE_UPGRADED_VERSION();
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            itShouldRenderVersionDetails({checkLink: true })
            itShouldRenderObjectDetails({checkLink: true});
            itShouldRenderWorkspaceDetails({checkLink: true});
            itShouldRenderACommentLink("activitystream", t("comments.title.ACTIVITY"))
        })

        context("when the type is unknown", function() {
            beforeEach(function() {
                this.view.model.set({type: "DINNER_TIME"});
                this.presenter = new chorus.presenters.Activity(this.view.model)
                this.view.render();
            });

            it("returns a default header", function() {
                this.model.set({ type: "GEN MAI CHA" });
                expect(this.view.render().$(".activity_header .author")).toExist();
            });
        });
    });

    function itShouldRenderAuthorDetails() {
        it("renders the author's icon", function() {
            expect(this.view.$('img').attr('src')).toBe(this.view.model.author().imageUrl());
        });

        it("contains the author's name", function() {
            expect(this.view.$("a.author").text()).toContain(this.view.model.author().displayName());
        });

        it("contains the author's url", function() {
            expect(this.view.$('a.author').attr('href')).toBe(this.view.model.author().showUrl());
        });
    }

    function itShouldRenderObjectDetails(options) {
        options || (options = {});

        it("contains the object's name", function() {
            expect(this.view.$(".activity_header")).toContainText(this.presenter.objectName);
        });

        if (options.checkLink) {
            it("contains the object's url", function() {
                expect(this.view.$('.activity_header a[href="' + this.presenter.objectUrl + '"]')).toExist();
            });
        }
    }

    function itShouldRenderWorkspaceDetails(options) {
        options || (options = {});

        it("contains the workspace's name", function() {
            expect(this.view.$(".activity_header")).toContainText(this.presenter.workspaceName);
        });

        if (options.checkLink) {
            it("contains the workspace's url", function() {
                expect(this.view.$('.activity_header a[href="' + this.presenter.workspaceUrl + '"]')).toExist();
            });
        }
    }

    function itShouldRenderVersionDetails(options) {
        options || (options = {});

        it("contains the version's name", function() {
            expect(this.view.$(".activity_header")).toContainText(this.presenter.versionName);
        });

        if (options.checkLink) {
            it("contains the version's url", function() {
                expect(this.view.$('.activity_header a[href="' + this.presenter.versionUrl + '"]')).toExist();
            });
        }
    }

    function itShouldNotRenderAnInsightLink() {
        it("does *not* have a link to promote the activity to a comment", function() {
            expect(this.view.$(".links a.promote")).not.toExist();
        });
    }

    function itShouldRenderACommentLink(entityType, entityTitle) {
        it("sets the correct entityType on the comment dialog link", function() {
            expect(this.view.$("a.comment").data("entity-type")).toBe(entityType);
        })

        it("sets the correct entityTitle on the comment dialog link", function() {
            expect(this.view.$("a.comment").data("entity-title")).toBe(entityTitle)
        })
    }

    function itShouldRenderPublishOrUnpublishLinks() {
        context("when it is published", function() {
            beforeEach(function() {
                this.view.model.set({isPublished: true});
                this.view.render();
            });

            it("should have a link to unpublish", function() {
                expect(this.view.$("a.unpublish")).toExist();
                expect(this.view.$("a.unpublish").text()).toMatchTranslation("insight.unpublish.link");
            });

            context("when the unpublish link is clicked", function() {
                beforeEach(function() {
                    stubModals();
                    spyOn(chorus.Modal.prototype, 'launchModal').andCallThrough();
                    this.view.$("a.unpublish").click();
                });

                it("launches the confirmation alert", function() {
                    expect(chorus.Modal.prototype.launchModal).toHaveBeenCalled();
                });

                context("when the unpublish completes", function() {
                    beforeEach(function() {
                        this.view.model.unpublish();
                        this.server.lastCreate().succeed();
                    });

                    it("re-fetches the activity's collection", function() {
                        expect(this.collection).toHaveBeenFetched();
                    });
                });
            });
        });

        context("when it is unpublished", function() {
            it("should have a link to publish", function() {
                expect(this.view.$("a.publish")).toExist();
                expect(this.view.$("a.publish").text()).toMatchTranslation("insight.publish.link");
            });

            context("when the publish link is clicked", function() {
                beforeEach(function() {
                    stubModals();
                    spyOn(chorus.Modal.prototype, 'launchModal').andCallThrough();
                    this.view.$("a.publish").click();
                });

                it("launches the confirmation alert", function() {
                    expect(chorus.Modal.prototype.launchModal).toHaveBeenCalled();
                });

                context("when the publish completes", function() {
                    beforeEach(function() {
                        this.view.model.publish();
                        this.server.lastCreate().succeed();
                    });

                    it("re-fetches the activity's collection", function() {
                        expect(this.collection).toHaveBeenFetched();
                    });
                });
            });
        });
    }
});
