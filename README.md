## Please be sure that you have installed Docker at your pc.

1. `npm i`
2. Add `.env` variables

   - `PORT = 3010` # port where app will start
   - `MONGODB_URL = "mongodb://127.0.0.1:27017/test"`url to connect for mongp. (/test) - name of db
   - `SALT_ROUNDS = 10` - standart for hashing
   - `JWT_SECRET = "MySecret"` - any string
   - `REDIS_HOST = '127.0.0.1'` - standart host for redis
   - `REDIS_PORT = 6379` - standart port for Redis
   - `REDIS_PASSWORD = ''` - not needs but must be `

3. Run `npm run start:first` and wait until the server will opens. It will init 2 db with some data!
4. Use
