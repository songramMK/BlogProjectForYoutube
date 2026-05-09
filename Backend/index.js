const express = require('express') ; 
const app = express() ; 
const dotenv =require('dotenv'); 
dotenv.config() ; 
const cookieparser = require('cookie-parser') ; 
const cors = require('cors') ; 
const port = process.env.PORT ; 

app.use(express.json()) ; 


app.listen(port, () => {
  console.log(`Server Is Running At the Port -${port}`);
});