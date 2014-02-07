namespace :db do
  desc "Fill database with sample data"
  task populate: :environment do
    make_users
    make_eco
    make_baseoil
    make_effect
    make_effect_ecos
  end
end

def make_users
  admin = User.create!(name:     "Example User",
                       email:    "example@railstutorial.org",
                       password: "foobar",
                       password_confirmation: "foobar",
                       admin: true)
  99.times do |n|
    name  = Faker::Name.name
    email = "example-#{n+1}@railstutorial.org"
    password  = "password"
    User.create!(name:     name,
                 email:    email,
                 password: password,
                 password_confirmation: password)
  end
end

def make_eco
  50.times do
    econtent = Faker::Name.name
    Eco.create!(name: econtent) 
  end
end

def make_effect
  50.times do
    efcontent = Faker::Name.name
    AromaEffect.create!(name: efcontent) 
  end
end

def make_baseoil
  50.times do
    bcontent = Faker::Name.name
    Baseoil.create!(name: bcontent) 
  end
end

def make_effect_ecos
  effects = AromaEffect.all(limit: 12)
  ecos = Eco.all(limit: 12)
  effects.each do |effect|
      ecos.each do |eco|
        EffectEco.create!(eco_id: eco.id, aroma_effect_id: effect.id, elevel: 3) 
      end
  end
end
