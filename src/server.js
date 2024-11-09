const {PORT} = require('./secret.js')

const app = require('./app.js');
const connectDB = require('./config/db.js');

app.listen(PORT, async()=>{
  console.log(`App running on port ${PORT}`);
await connectDB()
})