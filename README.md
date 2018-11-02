# NodeCDS

### upload.js
This script allows for content to be saved to the system for retreival later.

upload.js will expand across as many ports as instances are requested using pm2.
E.g. if port 3000 is specified, and 4 instances are requested, then ports 3000, 3001, 3002, and 3003 will all run an instance of upload.js

### delivery.js
This script delivers content to the end-user.

delivery.js will expand across as many ports as instances are requested using pm2.
E.g. if port 3000 is specified, and 4 instances are requested, then ports 3000, 3001, 3002, and 3003 will all run an instance of delivery.js

### A front-facing proxy/load balancer such as Nginx or HAProxy should be used in front of both of these scripts. Example Nginx configuration files can be found in example/cfg/nginx. They should be edited for production.

## Example integration of NodeCDS with your services
![Example integration](https://raw.githubusercontent.com/JordanOsterberg/NodeCDS/master/example-flow.jpeg)

This integration requires you to modify the code of NodeCDS. NodeCDS, without modification, should not be used in production.

1. Client uploads content
  - This could be from a web-app, internal tool, anywhere
2. NodeCDS confirms that the client has permission to upload content
  - You must modify **upload.js** in order to acheive this functionality.
  - You could check with your own, or a third party's backend service to acheive this
3. NodeCDS returns the URL of the content to the client
  - Once uploaded, a URL will be sent back to the client which holds the content that has been uploaded
4. Client sends the URL to your backend service
  - The backend service can store this URL whereever appropriate, tied to the content it is associated with
5. The service verifies that the content exists and is valid
  - The backend service should confirm that NodeCDS has actually received this file
  - This could be done by sending an HTTP request to the URL and confirming it is not 404
  - The host/domain of the URL should also be checked, and should match whatever URL NodeCDS is configured to use
