Rails.application.routes.draw do
  resources :sessions, only: [:create] do
    collection do
      get :refresh
      delete :destroy
    end
  end

  resources :users

  resources :sources do
    resources :source_votes, only: [:create] do
      collection do
        delete :destroy
      end
    end

    resources :source_pages, shallow: true

    resources :comments, shallow: true do
      resources :comment_votes, only: [:create] do
        collection do
          delete :destroy
        end
      end
    end
  end
end
