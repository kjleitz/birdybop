Rails.application.routes.draw do
  resources :sessions, only: [:create, :destroy]

  resources :users
end
