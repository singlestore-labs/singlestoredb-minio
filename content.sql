CREATE DATABASE acme PARTITIONS 2;

USE acme;

CREATE TABLE IF NOT EXISTS minio (
  now DATETIME NOT NULL,
  val int NOT NULL,
  text VARCHAR(512)
);

-- An example JSON pipeline
CREATE PIPELINE IF NOT EXISTS minio
AS LOAD DATA S3 'minio-bucket' -- 'minio-bucket/somefolder'
CONFIG '{"region": "us-east-1", "endpoint_url":"http://minio:9000/"}'
CREDENTIALS '{"aws_access_key_id": "memsql", "aws_secret_access_key": "minio123"}'
BATCH_INTERVAL 10 -- ms
INTO TABLE minio
FORMAT JSON;

-- An example CSV (TSV) pipeline
CREATE PIPELINE IF NOT EXISTS minio
AS LOAD DATA S3 'minio-bucket' -- 'minio-bucket/somefolder'
CONFIG '{"region": "us-east-1", "endpoint_url":"http://minio:9000/"}'
CREDENTIALS '{"aws_access_key_id": "memsql", "aws_secret_access_key": "minio123"}'
BATCH_INTERVAL 10 -- ms
INTO TABLE minio
FORMAT CSV
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n';


START PIPELINE minio;

select * from minio;
select count(*) from minio;

-- Cleanup
STOP PIPELINE minio;
DROP PIPELINE minio;
DROP TABLE minio;
