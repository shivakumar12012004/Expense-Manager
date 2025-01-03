const mongoose=require('mongoose');
require('dotenv').config({path:"./config.env"})

const conn = mongoose.connect(process.env.ATLAS_URI)
    .then(db=>{
        console.log("Database connected");
        return db;
    }).catch(err=>{
        console.log("Connection Error");
    })


module.exports=conn