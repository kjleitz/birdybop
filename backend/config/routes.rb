Rails.application.routes.draw do
  resources :sessions, only: [:create, :destroy] do
    collection do
      get :refresh
    end
  end

  resources :users

  resources :sources do
    resources :comments, shallow: true
  end
end
