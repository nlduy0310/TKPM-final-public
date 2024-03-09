require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const eHbs = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");

const {
	createGenresShort,
	formatDate,
	ifEquals,
	ifContains,
	formatTime,
	getStatus,
	toUpperCase,
  getDate,
  getMonth,
  getYear,
} = require("./controllers/handlebarsHelpers");

const port = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
const session = require("express-session");
const passport = require("./controllers/passport");
const flash = require("connect-flash");


// Redis
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => {
    // other tasks
  })
  .catch(console.error);

// Cau hinh su dung session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 1000,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Cau hinh su dung connect-flash
app.use(flash());

// view engine setup
app.engine(
  "hbs",
  eHbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    extname: "hbs",
    defaultLayout: "layout",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
    helpers: {
      ifEquals,
      ifContains,
      formatTime,
      formatDate,
      getYear,
      getStatus,
      toUpperCase,
      createGenresShort,
      getDate,
      getMonth,
      createPagination
    },
  })
);
app.set("view engine", "hbs");

app.use("/", require("./routes/index"));
app.use("/dbcontrol", require("./routes/dbcontrol"));
app.use("/users", require("./routes/authRouter"));
app.use("/users", require("./routes/usersRouter"));
app.use("/movies", require("./routes/moviesRouter"));

app.use((req, res, next) => {
  res.status(404).render("error", { message: "File not Found!" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: "Internal Servel Error" });
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//    set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// start app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
