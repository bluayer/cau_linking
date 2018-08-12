var express        = require("express");
var mongoose       = require("mongoose");
var bodyParser     = require("body-parser");
var methodOverride = require("method-override");
var flash          = require("connect-flash");
var session        = require("express-session");
var passport       = require("./config/passport");
const helmet       = require('helmet');

var app = express();

// DB setting
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, {useMongoClient: true});
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR : ", err);
});

// Helmet
app.use(helmet());
app.disable('x-powered-by');

// Other settings
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret:"MySecret", resave: true, saveUninitialized: true}));

// Passport
app.use(passport.initialize());
app.use(passport.session());



// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", require("./routes/home"));
app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

// Port setting
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});