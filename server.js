var http = require('http');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyparser = require('body-parser');
var client = require("./development").client;
var async = require("async");
app.use(cors());
app.use(bodyparser.json({}));

app.post('/login', function(req,res) {
    console.log(req.body);
    client.query('SELECT * FROM users.userinfo WHERE username=$1 AND pswd=$2',[req.body.username,req.body.password],function(err,response) {
        if(err) {
            console.log(err);
            res.status(400).send({message:'Something Went Wrong !!!'});
        } else {
            console.log(response.rows[0]);
            if(response && response.rows && response.rows[0]) {
                res.status(201).send({username:response.rows[0].username,userrole:response.rows[0].userrole,firstname:response.rows[0].firstname});   
            } else {
              res.status(200).send({message:"User doesn't Exists !!!"});
            }
        }
    })
})


app.post('/usercreate', function(req,res) {
        console.log(req.body);
        req.body.userrole = "police";
        var { fields, values } = extratValues(req.body)
        client.query('INSERT INTO users.userinfo ('+fields+') VALUES ('+values+') RETURNING *',function (err,response) {
            if(err) {
                console.log(err);
                if(err && err.code === '23505') {
                 res.status(200).send({message:'Username Alrerady Exists !!!'})
                } else {
                    res.status(400).send({message:"Something Went Wrong !!!"})
                }
            } else {
                console.log(response.rows[0]);
                res.status(201).send({username:response.rows[0].username,userrole:response.rows[0].userrole,firstname:response.rows[0].firstname});
            }
        })
     
})



app.post('/createcomplain',function(req,res) {
    req.body.status = 'pending';

    client.query('SELECT * FROM users.userinfo WHERE userrole=$1 AND active=$2',['police',true],async function(err,response) {
        if(err) {
           console.log(err);
           res.status(400).send({message:"Something Went Wrong !!!"});
        } else {
          if(response && response.rows && response.rows.length) {
           req.body.policeID = response.rows[0].username;
          } else {  
            req.body.policeID = null;
          }
          var { fields, values } = extratValues(req.body);
         await client.query('INSERT INTO users.complaints ('+fields+') VALUES ('+values+') RETURNING *',function(err,response1) {
            if (err) {
                console.log(err);
                res.status(400).send({message:'Something Went Wrong !!!'});
            } else {
                if(response && response.rows && response.rows.length) {
                    console.log(response.rows[0]);
                    client.query('UPDATE users.userinfo SET active=$1 WHERE username=$2',[false,response.rows[0].username],function(err,response3){
                    });
                }
                        res.status(201).send({message:'success'});
            }
        
            })
        }
    })

    
})


app.get('/paginationrcds/:id',function(req,res) {
    console.log(req.params.id)
    client.query('SELECT * FROM users.complaints WHERE userid=$1 OR policeid=$1',[req.params.id],function(err,response) {
        if(err) {
            console.log(err);
            res.status(400).send({message:"Something went wrong while fetching complaints !!!"});
        } else {
         res.status(200).send(response.rows);
        }
    })
})

app.post('/resolvecase',function(req,res) {
    client.query('UPDATE users.userinfo SET active=$1 WHERE username=$2',[true,req.body.policeid],function(err,response1){
        if(err) {
            console.log(err);
            res.status(400).send({message:'something Went Wrong !!!'});
        } else {
            client.query('UPDATE users.complaints SET status=$1 WHERE policeid=$2',['Resolved',req.body.policeid],function(err,response2){
                if(err) {
                    console.log(err);
                    res.status(400).send({message:'something Went Wrong !!!'});
                } else {
              
client.query('SELECT * FROM users.userinfo WHERE userrole=$1 AND active=$2',['police',true],function(err,response3) {
    if(err) {
        console.log(err);
        res.status(400).send({message:'something Went Wrong !!!'});
    } else {
       if(response3 && response3.rows && response3.length) {
           async.each(response3.rows,function(item,callback) {
              console.log(item.username);
           client.query('SELECT * FROM users.complaints WHERE policeid=$1 AND status=$3',[null,'pending'],function(err,response4){
               if(err){
                   console.log("@@@@@@@@@@");
               } else {
                   if (response4 && response4.rows && response4.rows.length) {
                    client.query('UPDATE users.complaints SET policeid=$1 WHERE recordid=$2',[item.username,response4.rows[0].recordid],function(err,response5){
                   if(err) {

                   } else {
                    client.query('UPDATE users.userinfo SET active=$1 WHERE username=$2',[false,item.username],function(err,response6){
                    })
                   }
                    })
                   }
               }
           })
            callback();
           })
       }
    }
})

                    res.status(200).send({message:'success'});
                }
            })
        }
    })
})

/*
Convert object to fields and values to insert data
  obj: Objact To Convert 
  OutPut :- Object with fields and values
*/
function extratValues(obj) {
    var fields = ' ';
    var values = ' ';
    Object.keys(obj).forEach(function(key) {
        fields += key + ',';
        if (typeof obj[key] == 'string') values += "'" + obj[key] + "',";
        else values += obj[key] + ',';
    });
    return { fields: fields.slice(0, -1), values: values.slice(0, -1) }
}


const server = http.createServer(app);

server.listen(9000,'0.0.0.0',function(err,response) {
    if(err) {
        console.log(err)
    } else {
        console.log("server started listening in 9000 port")
    }
})

