//Multiple file upload link
//https://stackoverflow.com/questions/36096805/uploading-multiple-files-with-multer-but-from-different-fields

let http = require('http');
let path = require('path');
let express = require('express');
let bodyparser = require('body-parser');

let hbs = require('hbs');
let md5 = require('md5');
let dbconnection = require('./dbconnection');
var formidable = require('formidable');
var fs = require('fs');
var multer  = require('multer');
const { body,validationResult } = require('express-validator');
hbs.registerPartials(__dirname + '/views', function (err) {});

const app = express();

let hrmsDB =  dbconnection.dbs;

app.set("view engine","hbs");
const publicDirec = path.join(__dirname,"./public");
app.use(express.static(publicDirec));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/:id',(req,res)=>{
  var tempid = req.params.id;
  hrmsDB.query("SELECT * FROM `candidate_interview` WHERE temp_id='"+tempid+"' AND status = '0'",(err,resultval)=>{    
    if(resultval?.length > 0){
        // if(resultval[0]?.["temp_id"] > 0){
          res.render('main', {res: resultval[0]});
          // res.json({'res': 'Candidates Found ID'});
        // }else{          
        //   res.render('error_page', {'msg': 'You are not Authorized! No Candidates Found with this ID'});
        // }      
    }else{
      res.render('error_page',{'msg': 'You are not Authorized! No Candidates Found with this ID'});
    }
  });
});

app.get('/', (req, res)=> {
  res.render('error_page',{'res':'Cannot Found','result':'Loginsuccess'});
});

function getFormattedDate(newdate){
  var today = new Date(newdate);
  var dd = today.getDate();

  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 
  return yyyy+'-'+mm+'-'+dd;
}

var StorageMulter = multer.diskStorage({
  destination: function(req, file, callback) {
      if (file.fieldname === "inputFile") { // if uploading resume
        callback(null, 'public/img/candidates_image/');
      } else { // else uploading image
        callback(null, 'public/img/candidates_resume/');
      }
  },
  // filename: function(req, file, callback) {
  //   console.log(file.fieldname);
  //   var uploadFileName = file.originalname; //Manipulate this variable accordingly
  //   //console.log(file.originalname);
  //   callback(null, uploadFileName);
  // }
});

// const filterVal = (req, file, cb) => {
//   if (file.fieldname === "resumeFile") { // if uploading resume
//     if (
//       file.mimetype === 'application/pdf'
//       // file.mimetype === 'application/msword' ||
//       // file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) { // check file type to be pdf, doc, or docx
//       cb(null, true);
//     } else {
//       cb(null, false); // else fails
//     }
//   } else { // else uploading image
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg' ||
//       file.mimetype === 'image/gif'
//     ) { // check file type to be png, jpeg, or jpg
//       cb(null, true);
//     } else {
//       cb(null, false); // else fails
//     }
//   }
// }; 

var upload = multer({
  storage: StorageMulter,
  // limits:
  //       { 
  //         fileSize:'2mb' 
  //       }, 
      //fileFilter: filterVal
});

var cpUpload = upload.fields([{ name: 'resumeFile'}, { name: 'inputFile' }]);

app.post('/test/:temp_id', cpUpload, (req, res) => {
  const errors = validationResult(req);
  console.log('response',req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    else {
    // Data from form is valid.
        // console.log('response',req.files);
        // console.log(req.body);
    }            
    return false;
  var candid_id = req.body.candid_id;
  var date_of_birth = getFormattedDate(req.body.date_of_birth);
  var gender = req.body.gender;
  var highest_qualification = req.body.highest_qualification;
  var current_address = req.body.current_add+', '+req.body.current_area+', '+req.body.current_city;
  var permanent_address = req.body.per_address+', '+req.body.per_area+', '+req.body.per_city;
  var position_applied_for = req.body.position_applied_for;
  var previous_interview_6 = req.body.previous_interview_6;
  var heard_opening_by = req.body.heared_opening;  
  var internal_ref_emp_name = req.body.internal_emp_ref_name;
  var internal_emp_ref_code = req.body.internal_emp_ref_code;
  var past_company = req.body.company;
  var past_designation = req.body.past_designation;
  var period_from = getFormattedDate(req.body.period_from);
  var period_to = getFormattedDate(req.body.period_to);
  var reason_for_leaving = req.body.reason_for_leaving;
  var overall_exp = req.body.overall_exp;
  var current_company = req.body.current_company;
  var current_designation = req.body.current_designation;
  var current_ctc = req.body.current_ctc;
  var expected_ctc = req.body.expected_ctc;
  var notice_period = req.body.notice_period;
  var expected_date_joining = getFormattedDate(req.body.doj);
  var career_gap = req.body.career_gap;
  var career_gap_reason = req.body.career_gap_reason;
  // var resume = req.files.resumeFile[0]?.filename;
  var ins_name = req.body.ins_name;
  var course_name = req.body.course_name;
  var passed_out = req.body.passed_out;
  var percentage = req.body.percentage;
  //var emp_photo = req.files.inputFile[0]?.filename;
  var empName = req.body.empName;
  var designation = req.body.designation;
  var contact = req.body.contact;
  var status = '0';  

  var temp_id = req.params.temp_id;

  if(req.body){
    hrmsDB.query("UPDATE candidate_interview SET candid_id=?,date_of_birth=?,gender=?,highest_qualification=?,current_address=?, permanent_address=?,position_applied_for=?,previous_interview_6=?,heard_opening_by=?,internal_emp_ref_name=?,internal_emp_ref_code=?,past_company=?,past_designation=?,period_from=?,period_to=?,reason_for_leaving=?, overall_exp=?,current_company=?,current_designation=?,current_ctc=?,expected_ctc=?,notice_period=?,expected_date_joining=?,career_gap=?,career_gap_reason=?,resume=?,ins_name=?,course_name=?,passed_out=?,percentage=?,emp_photo=?,ref_emp_name=?,ref_designation=?,ref_contact_no=?,status=? WHERE temp_id=?",[candid_id,date_of_birth, gender, highest_qualification,current_address,permanent_address,position_applied_for,previous_interview_6,heard_opening_by,internal_ref_emp_name,internal_emp_ref_code,past_company, past_designation, period_from, period_to, reason_for_leaving,overall_exp,current_company,current_designation,current_ctc,expected_ctc,notice_period,expected_date_joining,career_gap,career_gap_reason,resume,ins_name,course_name,passed_out,percentage,emp_photo,empName,designation,contact,status, temp_id],(err,result)=>{
      if(err){
        return res.json({"status":"Failure","msg":err});
      }else{ 
        res.render("success_page", {'res': candid_id});
        // return res.json({"status":"Success","msg":"Updated Successfully"});
        console.log('second', req.file);
      }
    });    
  } else{
    res.render("main");
  }
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

app.post('/reference', (req, res) => {
  res.json({'res': 'success'});
  console.log('appjs file', req.body.reference);
});

app.listen(5000,()=>{console.log('Server Connected');});
