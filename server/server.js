const express=require('express')
const app=express();
const cors=require('cors');


require('dotenv').config({path:"/config.env"});
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection
const conn=require('./db/connection')



//using routes
app.use(require('./routes/route'));


conn.then(db=>{
    if(!db)return process.exit(1);

    //listen to server
    app.listen(port,()=>{
        console.log(`server is running on port:http://localhost:${port}`)
    })

    app.on('error',err => console.log(`Failed to connect Error:${err}`));
    
    //if error in db connection
}).catch(error=>{
    console.log(`connection failed ${error}`)
})




