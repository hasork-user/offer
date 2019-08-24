var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


mongoose.connect("mongodb+srv://sand123:sand123@cluster0-t0jwv.gcp.mongodb.net/offer_app?retryWrites=true&w=majority", { useNewUrlParser: true });

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



var offerSchema = mongoose.Schema({
	productName : String,
	productPrice : String,
	image : String,
	offerName : String,
	discount : String,
	startDate: {type : Date, default : Date.now},
	endDate : {type: Date}
});
var Offer = mongoose.model("Offer", offerSchema);


app.get("/",function(req,res){
	res.redirect("/home");
});

app.get("/home",function(req,res){
	Offer.find({},function(err,offer){
		if(err){
			console.log(err);
		}else{
		res.render("home",{offer:offer});
	}
	});
	
});

app.get("/upload",function(req,res){
	res.render("offer");
});

app.post("/upload", function(req,res){
	req.body.offer.body = req.sanitize(req.body.offer.body);
	Offer.create(req.body.offer,function(err,newOffer){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	});
});

app.post("/search",function(req,res){
	var para = req.body.search;
	Offer.find({offerName: para},function(err,offer){
		if(err){
			console.log(err);
			res.redirect("/home");
		}
		else{
		res.render("home",{offer:offer});
	}
	});
});

app.delete("/offer/:id",function(req,res){
	Offer.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/home");
		}else{
			res.redirect("/home");
		}
	});
});

app.listen(process.env.PORT,process.env.IP, function(){
	console.log("Started");
});
