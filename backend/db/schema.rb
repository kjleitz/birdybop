# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_01_09_190013) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", precision: 6, null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "comment_votes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "comment_id", null: false
    t.boolean "upvote", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["comment_id", "user_id"], name: "index_comment_votes_on_comment_id_and_user_id", unique: true
    t.index ["comment_id"], name: "index_comment_votes_on_comment_id"
    t.index ["user_id", "comment_id"], name: "index_comment_votes_on_user_id_and_comment_id", unique: true
    t.index ["user_id"], name: "index_comment_votes_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body", null: false
    t.integer "section", null: false
    t.bigint "author_id"
    t.bigint "parent_id"
    t.bigint "source_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "karma", default: 0
    t.index ["author_id"], name: "index_comments_on_author_id"
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["source_id"], name: "index_comments_on_source_id"
  end

  create_table "source_pages", force: :cascade do |t|
    t.bigint "source_id", null: false
    t.text "document", null: false
    t.text "url", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["source_id"], name: "index_source_pages_on_source_id"
  end

  create_table "source_votes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "source_id", null: false
    t.boolean "upvote", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["source_id", "user_id"], name: "index_source_votes_on_source_id_and_user_id", unique: true
    t.index ["source_id"], name: "index_source_votes_on_source_id"
    t.index ["user_id", "source_id"], name: "index_source_votes_on_user_id_and_source_id", unique: true
    t.index ["user_id"], name: "index_source_votes_on_user_id"
  end

  create_table "sources", force: :cascade do |t|
    t.string "path", null: false
    t.bigint "submitter_id"
    t.integer "karma", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", null: false
    t.text "description", default: ""
    t.index ["path"], name: "index_sources_on_path", unique: true
    t.index ["submitter_id"], name: "index_sources_on_submitter_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "password_digest"
    t.text "about", default: ""
    t.integer "role", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "comment_votes", "comments"
  add_foreign_key "comment_votes", "users"
  add_foreign_key "comments", "comments", column: "parent_id"
  add_foreign_key "comments", "sources"
  add_foreign_key "comments", "users", column: "author_id", on_delete: :nullify
  add_foreign_key "source_pages", "sources"
  add_foreign_key "source_votes", "sources"
  add_foreign_key "source_votes", "users"
  add_foreign_key "sources", "users", column: "submitter_id", on_delete: :nullify
end
