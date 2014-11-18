chorus.views.JobTaskItem = chorus.views.Base.extend({
    constructorName: "JobTaskItemView",
    templateName:"job_task_item",

    events: {
        "click .down_arrow": "moveJobTaskDown",
        "click .up_arrow"  : "moveJobTaskUp"
    },

    iconMap: {
//          run_work_flow: "/images/jobs/afm-task.png",
            run_work_flow: "/images/jobs/task-afm.svg",
//          run_sql_workfile: "/images/workfiles/large/sql.png",
            run_sql_workfile: "/images/jobs/task-sql.svg",
//          import_source_data: "/images/jobs/data_import.png"
            import_source_data: "/images/jobs/task-data_import.svg"
    },

    additionalContext: function () {
        var action = this.model.get("action");
        var collection = this.model.collection;
        return {
            checkable: false,
            url: this.model.showUrl(),
            actionKey: "job_task.action." + action,
            iconUrl: this.iconUrlForType(action),
            firstItem: collection.indexOf(this.model) === 0,
            lastItem: collection.indexOf(this.model) === collection.length - 1
        };
    },

    iconUrlForType: function (action) {
        return this.iconMap[action];
    },

    moveJobTaskDown: function() { chorus.page.model.moveTaskDown(this.model); },
    moveJobTaskUp:   function() { chorus.page.model.moveTaskUp(this.model); }
});
