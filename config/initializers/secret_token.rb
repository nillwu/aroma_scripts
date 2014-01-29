# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,# no regular words or you'll be exposed to dictionary attacks.# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private# if you're sharing your code publicly.require 'securerandom'
#AromaScripts::Application.config.secret_key_base = '021e5fb893aff05441aac48b2c5dd294d62558594571973c2b5b19759eeb88a8b06b654c8a702ac116b33fa6595ade5cd7dc2883f660e9dd232f0819fd979038'


# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
#SampleApp::Application.config.secret_key_base = '74cb10d80be25d515e7810099901543ea22feeac8777bbc795cb55c69c33e70cbf53f53d7c3d4ce3e77875cb430426c48ee2f567f6a313fdff10a143ab9a7018'

require 'securerandom'

def secure_token
  token_file = Rails.root.join('.secret')
  if File.exist?(token_file)
    # Use the existing token.
    File.read(token_file).chomp
  else
    # Generate a new token and store it in token_file.
    token = SecureRandom.hex(64)
    File.write(token_file, token)
    token
  end
end

AromaScripts::Application.config.secret_key_base = secure_token
