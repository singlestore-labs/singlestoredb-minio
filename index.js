import minio from 'minio';
import { Readable } from 'stream';


function awaitStream(stream) {
  return new Promise((resolve, reject) => {
    const results = [];
    stream.on('data', obj => results.push(obj));
    stream.on('end', () => resolve(results));
    stream.on('error', reject);
  });
}

function getCilent() {
  return new minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'memsql',
    secretKey: 'minio123'
  });
}

async function makeBucket(minioClient, bucketName) {  
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (bucketExists) {
    console.log(`Bucket ${bucketName} already exists.`);
  } else {
    //const REGION = 'us-east-1';
    await minioClient.makeBucket(bucketName); // , REGION); // optional region
    console.log(`Bucket ${bucketName} created successfully.`);
  }
}


async function uploadTSV(minioClient, bucketName) {
  const now = new Date().toISOString();
  const metadata = {
    'Content-Type': 'text/csv',
    'X-Amz-Meta-Now': now
  };
  const content = `${now}\t${Math.random()*10000}\tline 1
${now}\t${Math.random()*10000}\tline 2
${now}\t${Math.random()*10000}\tline 3
${now}\t${Math.random()*10000}\tline 4
`;
  const objectName = `${now}.tsv`;
  const jsonStream = Readable.from(content);
  const etag = await minioClient.putObject(bucketName, objectName, jsonStream, metadata);
  console.log(`uploaded ${objectName}: ${etag}`);
  return etag;
}

async function uploadJSON(minioClient, bucketName) {
  const now = new Date().toISOString();
  const metadata = {
    'Content-Type': 'application/json',
    'X-Amz-Meta-Now': now
  };
  const json = {
    now,
    val: Math.random()*10000,
    text: 'Hello from Node'
  };
  const objectName = `${now}.json`;
  const jsonStream = Readable.from(JSON.stringify(json));
  const etag = await minioClient.putObject(bucketName, objectName, jsonStream, metadata);
  console.log(`uploaded ${objectName}: ${etag}`);
  return etag;
}

async function listFileCount(minioClient, bucketName) {
  
  const prefix = '';
  const recursive = true;
  const startAfter = '';
  const listStream = minioClient.listObjectsV2(bucketName, prefix, recursive, startAfter);
  //listStream.on('error', (err) => console.log('error', err));

  const files = await awaitStream(listStream);
  console.log(`files: ${files.length}`);
}

async function main() {
  const minioClient = getCilent();
  const bucketName = 'minio-bucket';
  await makeBucket(minioClient, bucketName);

  setInterval(async () => {
    try {
      // uncomment one to choose a JSON or CSV (TSV) workload:
      await uploadJSON(minioClient, bucketName);
      //await uploadTSV(minioClient, bucketName);
      
      await listFileCount(minioClient, bucketName);
    } catch (err) {
      console.log('error', {err});
    }
  }, 250);
}
main();
