let http = require('http');
let path = require('path');
let express = require('express');
let bodyparser = require('body-parser');
let hbs = require('hbs');
let md5 = require('md5');
let dbconnection = require('./dbconnection');
var setTZ = require('set-tz');
// let cookieParser = require('cookie-parser');
// let socketio = require('socket.io');
// var cookie = require('cookie');
// var store = require('store');
// var session = require('express-session')

const app = express();

let hrmsDB =  dbconnection.dbs;

app.set("view engine","hbs");
const publicDirec = path.join(__dirname,"./public")
app.use(express.static(publicDirec))

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',(req,res)=>{
  // res.render('main');
  hrmsDB.query("Select * from users where department='IT'",(err,resultval)=>{
    if(resultval){
      res.render('main',{'emp_id':'IT','res':resultval,'result':'Loginsuccess'});
    }else{
      res.render('main',{'emp_id':'IT','res':resultval,'result':'Failure'});
    }
  });
});

app.get('/signout',(req,res)=>{
  store.remove('user');
   res.redirect("/");
});

app.get('/getuser',(req,res)=>{
  hrmsDB.query("Select * from it_complaint order by status",(err,result_it)=>{
    res.json({'datga':result_it});
  });
});

app.post('/updatestatus',(req,res)=>{
  var id=req.body.indexid;
  var complaintdate=new Date(req.body.complaintdate);
  var status = req.body.status;
  var feed= req.body.itremark;
  var personname = req.body.itperson;
  var currentdate =new Date();
  var diff = complaintdate - currentdate;
  var diffSeconds = diff/1000;
  var HH = Math.floor(diffSeconds/3600);
  var MM = parseInt(Math.floor(diffSeconds%3600)/60);
  var formatted_res= ((HH < 10)?("0" + HH):HH) + ":" + ((MM < 10)?("0" + MM):MM)
  var split_form=formatted_res.split(':');
  if(status == 2){
    if(split_form[0] != '00'){
      var dt = split_form[0]+' Hour: '+split_form[1]+' Minutes';
    }else{
      var dt = split_form[1]+' Minutes';
    }
  }else{
    var dt = '';
  }
  hrmsDB.query("Update  it_complaint set issuecompleted_date=NOW(),status=?,duriation=?,itremark=?,it_person=? where id=?",[status,dt,feed,personname,id],(err,result)=>{
    if(err){
      return res.json({"status":"Failure","msg":err});
    }else{
      return res.json({"status":"Success","msg":"Updated Successfully"});
    }
  });
});

app.listen(5000,()=>{console.log('Server Connected');});
