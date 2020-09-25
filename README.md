MemSQL and Min.io
=================

This sample shows how MemSQL Pipelines can ingest data quickly from any S3-shaped source including min.io.  Watch a video demonstrating this sample at https://youtu.be/PiF3lHY66Nw


Usage
-----

Run this sample on any Docker runtime such as Docker Desktop.

1. Get a free license from https://portal.memsql.com/ and set it in place in `docker-compose.yaml`.

2. `docker-compose up` to start all the things

3. Browse to http://localhost:8080/ and login with username root and a blank password.

4. Run the SQL commands from `content.sql`.

5. `node index` to start the content generator.

In both `index.js` and `content.sql` you can opt to ingest JSON files or CSV (tab-separated) files.


License
-------

MIT
