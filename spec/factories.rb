FactoryGirl.define do
  factory :user do
    sequence(:name)  { |n| "Person #{n}" }
    sequence(:email) { |n| "person_#{n}@example.com"}
    password "foobar"
    password_confirmation "foobar"

    factory :admin do
      admin true
    end
  end
  
  
  
  factory :eco do
    sequence(:name)  { |n| "Person #{n}" }
  end
  
  
  factory :aroma_effect do
    sequence(:name)  { |n| "Person #{n}" }
  end

  factory :baseoil do
    sequence(:name)  { |n| "Person #{n}" }
  end

  factory :effect_eco do
    eco
    aroma_effect
  end
 
  factory :recipe do
    sequence(:name)  { |n| "Person #{n}" }
    ml 1000
    mol 5
    baseoil
  end
 
  factory :oil do
    effect_eco
    opercentage 5
    ospot 1000
    recipe
  end
  
end
