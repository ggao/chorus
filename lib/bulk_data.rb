module BulkData
  class << self
    WORDS = %w(alias consequatur aut perferendis sit voluptatem accusantium doloremque aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercitationem ullam corporis nemo enim ipsam voluptatem quia voluptas sit suscipit laboriosam nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae et iusto odio dignissimos ducimus qui blanditiis praesentium laudantium totam rem voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident sed ut perspiciatis unde omnis iste natus error similique sunt in culpa qui officia deserunt mollitia animi id est laborum et dolorum fuga et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo porro quisquam est qui minus id quod maxime placeat facere possimus omnis voluptas assumenda est omnis dolor repellendus temporibus autem quibusdam et aut consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur at vero eos et accusamus officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores doloribus asperiores repellat)
    def create_fake_users(csv_file_name, user_count)
      columns = %w(first_name last_name username admin email title dept notes)
      csv_file = File.open(csv_file_name, 'w')
      csv_file.puts(columns.to_csv)

      (1..user_count).each do |num|
        row = []
        row << Faker::Name.first_name
        row << Faker::Name.last_name
        row << Faker::Internet.user_name
        row << 'f'
        row << Faker::Internet.email
        row << Faker::Name.title
        row << Faker::Company.bs
        row << Faker::Company.catch_phrase

        csv_file.puts(row.to_csv)
      end
    ensure
      csv_file.close
    end

    def load_users_from_csv(file_name, admin_user_name)
      current_user = User.find_by_username(admin_user_name)
      CSV.foreach(file_name, :headers => true, :return_headers => false) do |csv_row|
        user = User.new(csv_row.to_hash.merge(:password => 'changeme'))
        user.admin = csv_row["admin"]
        user.save!
        Events::UserAdded.by(current_user).add(:new_user => user)
      end
    end

    def create_workspaces(count)
      user_ids = User.all.collect(&:id)
      count.times do
        owner_id = user_ids.sample
        current_user = User.find(owner_id)
        workspace = Workspace.create!(:name => WORDS.sample, :public => [true, false].sample, :owner_id => owner_id)
        members_added = user_ids.sample([rand(user_ids.count), 1].max)
        workspace.update_attributes!(:member_ids => (members_added + [owner_id]).uniq, :has_added_member => true)
        workspace.public ?
            Events::PublicWorkspaceCreated.by(current_user).add(:workspace => workspace) :
            Events::PrivateWorkspaceCreated.by(current_user).add(:workspace => workspace)
        member = User.find(members_added.first)
        member_added_event = Events::MembersAdded.by(current_user).add(:workspace => workspace, :member => member, :num_added => members_added.count.to_s)
      end
    end

    def create_gpdb_instance(admin_user_name, instance_name)
      current_user = User.find_by_username(admin_user_name)
      params = {:name => instance_name, :host => 'chorus-gpdb42', :port => 5432, :db_username => 'gpadmin',
                :db_password => 'secret', :maintenance_db => 'postgres', :shared => true}
      gpdb_instance = Gpdb::InstanceRegistrar.create!(params, current_user)
      gpdb_instance.refresh_all
    end

    def add_sandboxes(admin_user_name, gpdb_instance_name)
      current_user = User.find_by_username(admin_user_name)
      gpdb_instance = GpdbInstance.find_by_name(gpdb_instance_name)
      database = gpdb_instance.databases.find_by_name("CHORUSANALYTICS")
      if database.nil?
        database = gpdb_instance.create_database("CHORUSANALYTICS", current_user)
      end
      GpdbSchema.refresh(gpdb_instance.account_for_user(current_user), database)
      sandbox = database.schemas.find_by_name("public")
      Workspace.where(:sandbox_id => nil).find_each do |workspace|
        workspace.sandbox = sandbox
        workspace.save!
        Events::WorkspaceAddSandbox.by(current_user).add(
            :sandbox_schema => workspace.sandbox,
            :workspace => workspace)
      end
    end

    def add_workfiles(admin_user_name, workfiles_per_workspace)
      current_user = User.find_by_username(admin_user_name)
      Workspace.find_each do |workspace|
        workfiles_per_workspace.times do
          file = FakeFileUpload.new("select 1;")
          file.content_type = "text/sql"
          file.original_filename = "#{WORDS.sample}.sql"
          workfile_params = {
              :versions_attributes => [
                  {
                      :contents => file,
                      :owner => current_user,
                      :modifier => current_user
                  }
              ]
          }
          workfile = Workfile.new(workfile_params)
          workfile.owner = current_user
          workfile.workspace = workspace
          workfile.save!

          Events::WorkfileCreated.by(current_user).add(
              :workfile => workfile,
              :workspace => workspace
          )
        end
        workspace.has_added_workfile = true
        workspace.save!
      end
    end
  end

  class FakeFileUpload < StringIO
    attr_accessor :content_type, :original_filename
  end
end