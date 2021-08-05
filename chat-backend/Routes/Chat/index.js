const { request, response } = require("express");

const router=require("express").Router();

router.get("/",(request,response)=>{
    response.send("Hi lol");
});

module.exports=router;