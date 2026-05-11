const express = require('express') ; 
const app = express() ; 
const dotenv =require('dotenv'); 
dotenv.config() ; 
const cookieparser = require('cookie-parser') ; 
const cors = require('cors') ; 
const connectedDb = require('./src/config/db');
const port = process.env.PORT ; 


const AuthRouter = require('./src/routes/auth.route');
const UpdateRouter = require('./src/routes/user.route');
const PostRouter = require('./src/routes/post.route'); 

app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(cookieparser()) ; 
app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true 
}))


connectedDb();

app.use("/api/auth" ,AuthRouter) ;
app.use('/api/user' , UpdateRouter);
app.use("/api/post", PostRouter);



app.use((err , req, res, next)=>{
  const StatusCode = err.statusCode  || 500 ; 
  const Message = err.message  || "INTERNAL SERVER ERROR";
  res.status(StatusCode).json({ Message , success: false });  
})

app.listen(port, () => {
  console.log(`Server Is Running At the Port -${port}`);
});