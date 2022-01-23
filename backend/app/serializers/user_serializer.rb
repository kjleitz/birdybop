class UserSerializer
  include JSONAPI::Serializer

  set_key_transform :camel_lower

  attributes(*%i[
    username
    bio
    role
    created_at
    updated_at
  ])
end
