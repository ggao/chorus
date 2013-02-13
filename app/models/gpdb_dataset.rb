require 'stale'

class GpdbDataset < Dataset
  has_many :tableau_workbook_publications, :dependent => :destroy, :foreign_key => :dataset_id
  delegate :definition, :to => :statistics

  has_many :import_schedules, :foreign_key => 'source_dataset_id', :dependent => :destroy
  has_many :imports, :foreign_key => 'source_dataset_id'

  def instance_account_ids
    schema.database.instance_account_ids
  end

  def found_in_workspace_id
    (bound_workspace_ids + schema.workspace_ids).uniq
  end

  def self.total_entries(account, schema, options = {})
    schema.dataset_count account, options
  end

  def self.refresh(account, schema, options = {})
    schema.refresh_datasets account, options
  end

  def self.visible_to(*args)
    refresh(*args)
  end

  def source_dataset_for(workspace)
    schema_id != workspace.sandbox_id
  end

  def check_duplicate_column(user)
    true
  end

  def database_name
    schema.database.name
  end

  def table_description
    DatasetStatistics.for_dataset(self, schema.database.data_source.owner_account).description
  rescue
    nil
  end

  def schema_name
    schema.name
  end

  def column_name
    column_data.map(&:name)
  end

  def column_description
    column_data.map(&:description).compact
  end

  def column_data
    @column_data ||= DatasetColumn.columns_for(schema.database.data_source.owner_account, self)
  end

  def scoped_name
    %Q{"#{schema_name}"."#{name}"}
  end

  def dataset_consistent?(another_dataset)
    another_column_data = another_dataset.column_data
    my_column_data = column_data

    consistent_size = my_column_data.size == another_column_data.size

    consistent_size && my_column_data.all? do |column|
      another_column = another_column_data.find do |another_column|
        another_column.name == column.name
      end

      another_column && another_column.data_type == column.data_type
    end
  end

  def preview_sql
    all_rows_sql
  end

  def all_rows_sql(limit = nil)
    Arel::Table.new(name).project('*').take(limit).to_sql
  end

  def as_sequel
    Sequel.qualify(schema.name, name)
  end

  private

  def create_import_event(params, user)
    workspace = Workspace.find(params[:workspace_id])
    dst_table = workspace.sandbox.datasets.find_by_name(params[:to_table]) unless params[:new_table].to_s == "true"
    Events::DatasetImportCreated.by(user).add(
        :workspace => workspace,
        :source_dataset => self,
        :dataset => dst_table,
        :destination_table => params[:to_table]
    )
  end
end

