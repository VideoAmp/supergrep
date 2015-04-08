"use strict";
var async = require("async");
var split = require("split");
var zlib = require("zlib");

var AWS = require("aws-sdk");
AWS.config.loadFromPath("./aws.json");
var s3 = new AWS.S3();

var args = require("optimist")
    .options("bucket", {
        "default": "vamp_beacon_logs",
        "alias": "b"
    }).describe("bucket", "s3 bucket to scan")
    .options("dirs", {
        "default": "i-e76ef919/,i-83882e72/",
        "alias": "d"
    }).describe("dirs", "sub-directories under the buckets root from which to scan")
    .options("start", {
        "default": "1427846400",
        "alias": "s"
    }).describe("start", "timestamp from which to start")
    .options("end", {
        "default": "1427868000",
        "alias": "e"
    }).describe("end", "timestamp from which to end")
    .options("help", {
        "default": false,
        "alias": "h"
    }).describe("help", "this help message")
    .alias("help", "?")
    .usage("Usage: $0");


var params = {
    Bucket: args.argv.bucket
};
var files = [];

async.waterfall([
    function(callback) {
        //-= Directory masks from which to dig into, for Opsworks this is the machine's instance_id
        var dirs = args.argv.dirs.split(/,/);
        async.whilst(
            function() {
                return dirs.length > 0;
            },
            function(callback2) {
                var row = dirs.pop();
                console.error(row, files.length);
                var p = {
                    Bucket: params.Bucket,
                    Delimiter: ",",
                    EncodingType: "url",
                    MaxKeys: 1000,
                    Prefix: row +"access.log.2015-04-01"
                };
                s3.listObjects(p, function(err, res) {
                    if (err) {
                        console.log(err, err.stack);
                    } else {
                        res.Contents.forEach(function (m) {
                            var poo = m.Key.split(/(2015\-04\-01\-|\.gz)/);
                            if (poo[2] >= 1427846400 && poo[2] <= 1427868000) {
                                files.push(m);
                            }
                        });
                        callback2();
                    }
                });
            },
            function(err) {
                callback(err);
            }
        );
    },
    function(callback) {
        console.log("Fetching: "+ files.length +" files");
        async.whilst(
            function() {
                return files.length > 0;
            },
            function(callback2) {
                params.Key = files.pop().Key;
                console.error("###", params.Key);
                s3
                    .getObject(params)
                    .createReadStream()
                    .pipe(zlib.createGunzip())
                    .pipe(split())
                    .on("data", function(line) {
                        if (/(551af3c40d7c70d24d921207|551af426a4f199f24dacded6|551b34dea4f199f24dacded8|551b359b0d7c70d24d92120b)/.test(line)) {
                            console.log(line);
                        }
                    }).
                    on("error", callback).
                    on("end", function() {
                            callback2();
                    });
            },
            function(err) {
                callback(err);
            }
        );
    }
], function(err) {
    if (err) {
        console.warn(err);
    }
});
