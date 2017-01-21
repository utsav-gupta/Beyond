
var PGSql = require('../routes/server').PGSql;
var pgsql = new PGSql();

var response = function (res, status){
 var body = JSON.stringify(status);
    res.setHeader('Content-Type', 'text/plain');
    //res.setHeader('Content-Length', body.length);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials' , true);
    res.setHeader('Access-Control-Allow-Methods' ,'POST');
    res.setHeader('Access-Control-Allow-Headers' , 'Content-Type');
    res.send(body);

}

var multer = require('multer');
//var uploadFolder="/data/beyondenough";
var uploadFolder="/Users/Guhan/Documents/workspace/beyondenough/routes";
var upload = multer({ dest:uploadFolder});

var express = require('express');
var router = express.Router();

var insertMenuRequest = function(values,callback){
	values["displayStatus"]=values["status"];
	var request = require("request");
	var url = "http://127.0.0.1:3000/menus/update";
	request.post({url:url,form:{"values":JSON.stringify(values)}},function(err,httpResponse,body){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,body);
		}
	});				
}


var insertSubCategoryAttr = function(values,callback){
	values["attributeType"]=values["type"];
	var request=require('request');
	var url = "http://127.0.0.1:3000/subcategory/update";
	request.post({url:url,form:{"values":JSON.stringify(values)}},function(err,httpResponse,body){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,body);
		}
	});	
}


var insertItemRequest = function(values,callback){
	values["viewCount"]=values["viewCount"]?values["viewCount"]:'0';
	values["ratingCount"]=values["ratingCount"]?values["ratingCount"]:'0';
	values["likeCount"]=values["likeCount"]?values["likeCount"]:'0';
	values["mrp"]=values["mrp"]?values["mrp"]:'0';
	values["bePrice"]=values["bePrice"]?values["bePrice"]:'0';
	values["subTitle"]=values["subTitle"]?values["subTitle"]:"";
	values["overview"]=values["Overview"]?values["Overview"]:"";
	values["shippingDetails"]=values["ShippingDetails"]?values["ShippingDetails"]:"";
	
	delete values["ShippingDetails"];
	delete values["Overview"];

	var tags = values["tags"].split(",");
	var a = {};
	tags.forEach(function(t,i){
		a["item"+(i+1)]=t;
	});
	values["tags"]=a;
	var request=require('request');
	var url = "http://127.0.0.1:3000/items/update";
	request.post({url:url,form:{"values":JSON.stringify(values)}},function(err,httpResponse,body){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,body);
		}
	});	

}

var insertMenuPromoRequest = function(values,callback){
	values["pStatus"]=values["status"];

	var request=require('request');
	var url = "http://127.0.0.1:3000/menupromotion/update";
	request.post({url:url,form:{"values":JSON.stringify(values)}},function(err,httpResponse,body){
		if(err){
			callback(err,null);
		}
		else{
			callback(null,body);
		}
	});
}

function doSetTimeout(values,i,ind){
  
  switch(ind){
  	case 0 :
  			setTimeout(function() {
		  	 	insertMenuRequest(values,function(err,body){
					if(err){
						console.log(err);
					}
					else{
						console.log(body);
					}
				});
		  	},i*1000);
		  	break;
	case 1 :
		  	setTimeout(function() {
		  	 	insertSubCategoryAttr(values,function(err,body){
					if(err){
						console.log(err);
					}
					else{
						console.log(body);
					}
				});
		  	},i*1000);	
		  	break;

	case 2 : 
			setTimeout(function() {
		  	 	insertItemRequest(values,function(err,body){
					if(err){
						console.log(err);
					}
					else{
						console.log(body);
					}
				});
		  	},i*1000);
		  	break;		  	

	case 5 : 
			setTimeout(function() {
		  	 	insertMenuPromoRequest(values,function(err,body){
					if(err){
						console.log(err);
					}
					else{
						console.log(body);
					}
				});
		  	},i*1000);
		  	break;		
	}

  }


function parseFile (file,sheetNo,callback){

	var records = [];
	var xlsx = require('node-xlsx');
 	var obj = xlsx.parse(file); // parses a file 
	// Obj will give array of sheets.
	// 1) Menu
	var keys = [];
	var records = [];


	for(var i=0;i<obj[sheetNo]["data"].length;i++){
		if(i==0){
			keys = obj[sheetNo]["data"][i];
		}
		else{
			var doc = {};
			obj[sheetNo]["data"][i].forEach(function(da,j){
				//console.log(da);
				doc[keys[j]] = da+"";
				if(j==obj[sheetNo]["data"][i].length-1){
					records.push(doc);
				}
			});
		}
	}
	callback(null,records);		
}

router.post('/excel',upload.single("dbExcel"),function(req,res){
	var status = {"state":false,"message":""};
	var values = (req.body.values)?JSON.parse(req.body.values):null;
	console.log(values);
	var sheetNo;
	if(values!==null){
		sheetNo = values["sheetNo"]?parseInt(values["sheetNo"]):null;
		password = values["password"]?values["password"]:null;
	}
	var excelFile = req.file;
	var elementFlag = false;
		elementFlag = (excelFile)?true:false;

	if(elementFlag){
		var id = excelFile["filename"];
		var excelPath = excelFile["path"];
		if(password=="dits"){
			parseFile(excelPath,sheetNo,function(err,doc){
				if(err){
					status["message"]=err;
					response(res,status);
				}
				else{
					console.log(doc.length+" total rows");
					// first find out function name as per excel sheet no.
					doc.forEach(function(d,i){
						doSetTimeout(d,i,sheetNo);						
					});
					// sending out mail when somebody calls this service. 

					status["state"]=true;
					status["message"]="Uplaoding excel sheet";
					response(res,status);
				}
			});
		}
		else{
			status["message"]="Sorry.It is password protected";
			response(res,status);
		}
	}	
	else{
		status["message"]="Please send sheetNo in values";
		response(res,status);
	}

});

module.exports = router;