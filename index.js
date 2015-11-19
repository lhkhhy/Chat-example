
var express = require('express');
var app = express();
var server=require('http').createServer(app);
var io = require('socket.io')(server);

var setting = require('./settings');
var user = require('./User');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


app.use(session({
    secret:setting.cookieSecret,
    store:new MongoStore({
        db:setting.db,
        host:setting.host,
        port:setting.port
    }),
    resave:true,
    saveUninitialized:true
}))

app.get('/',function(req,res){
    //res.render(__dirname + '/index.html');
    res.sendFile(__dirname + '/index.html');
});

app.post('/register',function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    var userid =  new Date().getTime()+""+Math.floor(Math.random()*889+100);
    var newUser = new user({
        userId:userid,
        username:username,
        password:password
    });
    req.session.user = newUser;

})

var OnlineUser = {};
var OnlineCount = 0;

io.on('connection',function(obj){
    socket.on('login',function(user){
        console.log(user.username+'登录');
        socket.name = user.username;

        if(!OnlineUser.hasOwnProperty(user.UserId)){
            OnlineCount++;
            OnlineUser[user.UserId] = user.UserName;
        }

        socket.emit('login',{onlineuser:OnlineUser,onlinecount:OnlineCount,userinfo:user});

    });
})

server.listen(2015);
console.log('app:80 start');