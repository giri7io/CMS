/**
 * Created by Preneesh on 12-06-2016.
 */
var multer     = require('multer');
var path       = require('path');
var fs         = require('fs');
var Sub =  require('../schemas/submissions');
var User   = require('../schemas/users');






module.exports.list = function (req, res){
  if(req.query.unassigned)
    Sub.find({reviewer:{$exists:false}},function (err,result) {res.send(result)})
  else
    Sub.find(function (err,result) {res.send(result)})
};

module.exports.getSublist = function (req, res){
  console.log("Getting the Submission List for User");
  var conditions = {author_id: req.query.author_id};
  Sub.find(conditions, function(err, result){
    if(err){throw err}
    else {
      res.json(result);
    }
  });
};

module.exports.getSub = function (req, res) {
  console.log("getting sub details");
  var conditions = {_id: req.query.submissionId};
  Sub.findOne(conditions, function (err,result) {
    if(err){throw err}
    res.json(result);
  });
};

module.exports.uploadSub = function (req, res){
  console.log('inside file upload');

  //Multer Disk Storage Settings
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = './uploads/'+req.query.username+'/';
       if (!fs.existsSync(dir)){
         fs.mkdirSync(dir);
       }
      console.log(dir);
      cb(null, dir);
  
      var conditions = {_id: req.query.submission};
      var fileName = file.fieldname + file.originalname;
      var url = './api'+dir.toString().slice(1)+fileName.toString();
      console.log(url);
      var update = {$set: {path: url}};
      Sub.findOneAndUpdate(conditions, update, function (err1, result) {
        if (err1) {
          throw err1;
        }
        else {
          console.log('url updated..');
        }
      });
    },
    filename: function (req, file, cb) {
      var fileName = file.fieldname +  file.originalname;
      cb(null, fileName)
    }
  });


  //Upload Files API
  var upload = multer({
    storage: storage
  }).single('file');
  upload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({error_code:0,err_desc:null});
  })
};

module.exports.postSub = function (req, res) {
  console.log("Received sub post req..");
  var add = new Sub(req.body);
  add.save(function (err,result1) {
    if(err) { throw err; }
    else {
      res.send(result1);
      console.log("submission was successful");
      var conditions = {username: req.query.username};
      var update = {$push: {submissions: result1}};
      User.findOneAndUpdate(conditions, update, {new: true}, function (err1, result) {
        if (err1) {
          throw err1;
        }
        else {
          console.log(result);
        }
      });
    }
  });
};

module.exports.updateSub = function (req, res) {
  console.log("Received sub update req..");
  var condition = {_id : req.body._id};
  var update = req.body;
  Sub.findOneAndUpdate(condition, update, function(err, result1){
    if(err) { throw err; }
    else {
      res.send(result1);
      console.log("submission was successful");
    }
  });
};

