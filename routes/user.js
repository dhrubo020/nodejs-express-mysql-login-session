
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var email= post.user_email;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`,`email`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + email + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {
         if(err){
            message = "Something went wrong!!";
            res.render('signup.ejs',{message: message});
         }else{
         message = "Succesfully! Your account has been created. Now you can log in.";
         res.render('index.ejs',{message: message});
         }
      });

   } else {
      res.render('signup.ejs');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session;
   
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   console.log('user id = '+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------Profile page render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
//---------------------------------Password Recovery (Email search) ----------------------------------------------------//
exports.passwordRecovery = function(req, res){
   var message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var email= post.email;
     
      var sql="SELECT * FROM `users` WHERE `email`='"+email+"'";   
                             
      db.query(sql, function(err, results){      
         if(results.length){
            console.log(results[0].id);
            res.render('reset.ejs',{data:results,message: message});
         }
         else{
            console.log('email search err1');
            message = 'Email not found.';
            res.render('passwordRecovery.ejs',{message: message});
         }
      });
   } else {
      console.log('email search err2');
      res.render('passwordRecovery.ejs',{message: message});
   }    
};
//--------------------------------------Reset password -----------------------------------------------------//
exports.reset=function(req,res){
   
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var email = post.email;
      var password = post.password1;
      var sql = "UPDATE `users` SET `password` = '" + password + "' WHERE `users`.`email` = '" + email + "'";
      var query = db.query(sql, function(err, result) {
         if(err){
            message = "Something went wrong!!";
            res.render('passwordRecovery.ejs',{message: message});
         }else{
         message = "Succesfully! Your password has been updated. Now you can log in with new password.";
         res.render('index.ejs',{message: message});
         }
      });

   } else {
      res.render('passwordRecovery.ejs');
   }

};