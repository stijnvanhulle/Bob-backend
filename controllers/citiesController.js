/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var pool            = require('../libs/mysql');
var md5             = require('md5');
var async           = require('async');

var commit          = require('./libs/commit');
var parser          = require('./libs/parser');

var getCities=function(req,res){
    pool.getConnection(function(error, connection) {
        connection.query({
                sql: 'SELECT * FROM Cities',
                timeout: 40000 // 40s
            },
            function (error, results, fields) {
                connection.release();
                if (error){
                    res.json({success:false});
                } else{
                    res.json(results);
                }
            }
        );
    });
};

var postCity=function(req,res){
    var obj= parser(req.body);

    pool.getConnection(function(error, connection) {
        connection.query({
                sql: 'INSERT INTO Cities(Name,Postcode,Countries_ID) VALUES(?,?,?) ',
                timeout: 40000 // 40s
            },
            [obj.Name, obj.Postcode,obj.Countries_ID],
            function (error, results, fields) {
                connection.release();
                if (error){
                    res.json({success:false});
                } else{
                    res.json({success:true});
                }
            }
        );
    });
};

module.exports = (function(){

    //public api
    var publicAPI={
        getCities:getCities,
        postCity:postCity
    };

    return publicAPI;
})();