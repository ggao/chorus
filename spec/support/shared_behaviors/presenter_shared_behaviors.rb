shared_examples "dataset presenter" do |dataset_factory_name|
  before do
    gpdb_data_source = FactoryGirl.build(:gpdb_data_source, :id => 123, :name => "instance1")
    database = FactoryGirl.build(:gpdb_database, :id => 789, :name => "db1", :data_source => gpdb_data_source)
    schema = FactoryGirl.build(:gpdb_schema, :id => 456, :name => "abc", :database => database)
    @dataset = FactoryGirl.build(dataset_factory_name,
      :id => 321,
      :name => "object1",
      :schema => schema
    )
  end

  let(:presenter) { described_class.new(@dataset, view) }
  let(:hash) { presenter.to_hash }

  it "includes schema, database and instance object fields" do
    hash[:id].should == 321
    hash[:object_name].should == "object1"
    hash[:entity_subtype].should == "SOURCE_TABLE"
    hash[:associated_workspaces].should_not be_nil

    schema = hash[:schema]
    schema[:id].should == 456
    schema[:name].should == "abc"

    database = schema[:database]
    database[:id].should == 789
    database[:name].should == "db1"

    instance = database[:instance]
    instance[:id].should == 123
    instance[:name].should == "instance1"
  end

  it "checks if the user is allowed to access" do
    hash[:has_credentials].should_not be_nil
  end

  context "when the 'workspace' option is not passed" do
    it "does not include the 'workspace' key" do
      hash.should_not have_key(:workspace)
    end
  end
end

shared_examples "dataset presenter with workspace" do |dataset_factory_name|
  before do
    gpdb_data_source = FactoryGirl.build(:gpdb_data_source, :id => 123, :name => "instance1")
    database = FactoryGirl.build(:gpdb_database, :id => 789, :name => "db1", :data_source => gpdb_data_source)
    schema = FactoryGirl.build(:gpdb_schema, :id => 456, :name => "abc", :database => database)
    @dataset = FactoryGirl.build(dataset_factory_name,
                                 :id => 321,
                                 :name => "object1",
                                 :schema => schema
    )
  end

  let(:presenter) { described_class.new(@dataset, view) }
  let(:hash) { presenter.to_hash }

  context "when the 'workspace' option is passed" do
    let(:workspace) { FactoryGirl.build(:workspace) }
    let(:presenter) { described_class.new(@dataset, view, :workspace => workspace) }

    before do
      stub(ActiveRecord::Base).current_user { FactoryGirl.build(:user) }
    end

    it "includes the given workspace" do
      hash[:workspace].should == Presenter.present(workspace, view)
    end
  end
end

shared_examples "activity stream instance presenter" do
  context "outside of activity Stream" do
    let(:options) { {:activity_stream => false} }

    it "sets complete_json" do
      presenter.presentation_hash[:complete_json].should be_true
    end
  end

  context "For activity Stream" do
    let(:options) { {:activity_stream => true} }

    it "does not present the owner" do
      presenter.presentation_hash[:owner].should be_nil
    end

    it "sets complete_json to false" do
      presenter.presentation_hash[:complete_json].should be_false
    end
  end
end

shared_examples "oracle dataset presenter" do |dataset_factory_name|
  before do
    data_source = FactoryGirl.build(:oracle_data_source, :id => 123, :name => "instance1")
    schema = FactoryGirl.build(:oracle_schema, :id => 456, :name => "abc", :data_source => data_source)
    @dataset = FactoryGirl.build(dataset_factory_name,
                                 :id => 321,
                                 :name => "object1",
                                 :schema => schema
    )
  end

  let(:presenter) { described_class.new(@dataset, view) }
  let(:hash) { presenter.to_hash }

  it "includes schema and data sourceobject fields" do
    hash[:id].should == 321
    hash[:object_name].should == "object1"
    hash[:entity_subtype].should == "SOURCE_TABLE"
    hash[:associated_workspaces].should_not be_nil

    schema = hash[:schema]
    schema[:id].should == 456
    schema[:name].should == "abc"

    instance = schema[:instance]
    instance[:id].should == 123
    instance[:name].should == "instance1"
  end

  it "checks if the user is allowed to access" do
    hash[:has_credentials].should_not be_nil
  end

  context "when the 'workspace' option is not passed" do
    it "does not include the 'workspace' key" do
      hash.should_not have_key(:workspace)
    end
  end
end
