const express = require('express') ; 
const app = express() ; 
const dotenv =require('dotenv'); 
dotenv.config() ; 
const cookieparser = require('cookie-parser') ; 
const cors = require('cors') ; 
const connectedDb = require('./src/config/db');
const port = process.env.PORT ; 


app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(cookieparser()) ; 
app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true 
}))


connectedDb();

app.listen(port, () => {
  console.log(`Server Is Running At the Port -${port}`);
});