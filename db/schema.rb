# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140204120136) do

  create_table "aroma_effects", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "baseoils", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ecos", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "effect_ecos", force: true do |t|
    t.integer  "aroma_effect_id"
    t.integer  "eco_id"
    t.integer  "elevel"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "effect_ecos", ["aroma_effect_id", "eco_id"], name: "index_effect_ecos_on_aroma_effect_id_and_eco_id", unique: true

  create_table "oils", force: true do |t|
    t.float    "opercentage"
    t.integer  "ospot"
    t.integer  "effect_eco_id"
    t.integer  "recipe_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "recipes", force: true do |t|
    t.string   "name"
    t.float    "mol"
    t.integer  "ml"
    t.text     "remark"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "baseoil_id"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
    t.string   "remember_token"
    t.boolean  "admin",           default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["remember_token"], name: "index_users_on_remember_token"

end
