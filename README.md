```
Usage:
node supergrep > my-big-file.log
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


```
# aws.json
{ 
  "accessKeyId": "FEEDFACEDEADBEEF",
  "secretAccessKey": "your_secret_key",
  "region": "us-east-1"
}
```
