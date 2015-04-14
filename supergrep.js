"use strict";
var async = require("async");
var split = require("split");
var zlib = require("zlib");
var color = require("bash-color");

var AWS = require("aws-sdk");
AWS.config.loadFromPath("./aws.json");
var s3 = new AWS.S3();

var args = require("optimist")
    .options("bucket", {
        "default": "vamp_beacon_logs",
        "alias": "b"
    }).describe("bucket", "s3 bucket to scan")
    .options("dirs", {
        "default": "i-e76ef919,i-83882e72",
        "alias": "d"
    }).describe("dirs", "sub-directories under the buckets root from which to scan, as the first level search")
    .options("file_mask", {
        "default": "access.log.2015-04-14",
        "alias": "k"
    }).describe("file_mask", "file mask for which to do a second level search")
    .options("start", {
        "default": "1429023300",
        "alias": "s"
    }).describe("start", "timestamp from which to start, as the third level search")
    .options("end", {
        "default": "1429023660",
        "alias": "e"
    }).describe("end", "timestamp from which to end, as the third level search")
    .options("pattern", {
        "default": "54610bed88c86bd6378bdcda",
        "alias": "t"
    }).describe("pattern", "pattern for which to do the line-leven level search")
    .options("help", {
        "default": false,
        "alias": "h"
    }).describe("help", "this help message")
    //.demand(["bucket", "dirs"])
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
                error(row +" "+ files.length);
                var p = {
                    Bucket: params.Bucket,
                    Delimiter: ",",
                    EncodingType: "url",
                    MaxKeys: 1000,
                    Prefix: row +"/"+ args.argv.file_mask
                };
                s3.listObjects(p, function(err, res) {
                    if (err) {
                        error(err +"\n"+ err.stack);
                    } else {
                        res.Contents.forEach(function (m) {
                            var poo = m.Key.split(/[\d]{4}-[\d]{2}-[\d]{2}-|\.gz/);
                            if (poo[1] >= args.argv.start && poo[1] <= args.argv.end) {
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
        error("Fetching: "+ files.length +" files");
        async.whilst(
            function() {
                return files.length > 0;
            },
            function(callback2) {
                params.Key = files.pop().Key;
                error("### "+ params.Key);
                s3
                    .getObject(params)
                    .createReadStream()
                    .pipe(zlib.createGunzip())
                    .pipe(split())
                    .on("data", function(line) {
                        if (new RegExp(args.argv.pattern).test(line)) {
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
        error(err);
    }
});


var error = function(str) {
    console.error(color.red(str));
};
