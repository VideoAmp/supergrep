```
Usage:
node supergrep.js  -d i-e76ef919,i-83882e72  -k access.log.2015-04-01 -s 1427846400  -e 1427850000  -t 551b34dea4f199f24dacded8
```

```
# Designed to work with logs named in this scheme:
$ s3cmd ls s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14*
2015-04-14 00:06   1205145   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428969601.gz
2015-04-14 00:11   1002301   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428969901.gz
2015-04-14 00:16    998537   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428970201.gz
2015-04-14 00:21   1085555   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428970501.gz
2015-04-14 00:26    983109   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428970801.gz
2015-04-14 00:31    946218   s3://vamp_beacon_logs/i-e76ef919/access.log.2015-04-14-1428971101.gz
...
```

Testing
-------
```
$ node supergrep.js  -d i-e76ef919,i-83882e72  -k access.log.2015-04-01 -s 1427849700  -e 1427850000  -t 551b34dea4f199f24dacded8 | wc -l
i-83882e72 0
i-e76ef919 1
Fetching: 2 files
### i-e76ef919/access.log.2015-04-01-1427849701.gz
### i-83882e72/access.log.2015-04-01-1427849701.gz
72727

```


```
# aws.json
{ 
  "accessKeyId": "FEEDFACEDEADBEEF",
  "secretAccessKey": "your_secret_key",
  "region": "us-east-1"
}
```
