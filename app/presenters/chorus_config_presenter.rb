class ChorusConfigPresenter < Presenter
  def to_hash
    {
        :external_auth_enabled => LdapClient.enabled?,
        :gpfdist_configured => model.gpfdist_configured?,
        :tableau_configured => model.tableau_configured?,
        :file_sizes_mb_workfiles => model['file_sizes_mb.workfiles'],
        :file_sizes_mb_csv_imports => model['file_sizes_mb.csv_imports'],
        :file_sizes_mb_user_icon => model['file_sizes_mb.user_icon'],
        :file_sizes_mb_workspace_icon => model['file_sizes_mb.workspace_icon'],
        :file_sizes_mb_attachment => model['file_sizes_mb.attachment'],
        :visualization_overlay_string => model['visualization.overlay_string'].try(:[], 0...40),
        :kaggle_configured => model.kaggle_configured?,
        :gnip_configured => model.gnip_configured?,
        :execution_timeout_in_minutes => model['execution_timeout_in_minutes'],
        :default_preview_row_limit => model['default_preview_row_limit'] || 100,
        :oracle_configured => model.oracle_configured?,
        :work_flow_configured => model.work_flow_configured?,
        :work_flow_url => model['work_flow.url']

    }.merge(alpine_config)
  end

  private

  def alpine_config
    if model.alpine_configured?
      {
          :alpine_url => model['alpine.url'],
          :alpine_api_key => model['alpine.api_key']
      }
    else
      {}
    end
  end
end