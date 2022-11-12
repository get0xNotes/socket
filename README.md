# 0xNotes Socket
A Socket.IO server that saves and relay notes.

## Setting up development environment
1. Clone the repository `git clone git@github.com:get0xNotes/socket.git`
2. Run `cd socket && yarn`
3. Create a `.env` file containing the following:
```env
POSTGREST_ENDPOINT = "https://pg.example.com/rest/v1"
POSTGREST_APIKEY = "A bearer token to access the endpoint"
SERVER_JWK = '{"alg":"EdDSA","kty":"OKP","crv":"Ed25519","x":"","d":""}'

# Make sure to change the origin to your domain on production
ORIGIN = '*'
```
4. Run `yarn start`

## License
MIT License
