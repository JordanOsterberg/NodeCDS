# NodeCDS

### upload.js
This script allows for content to be saved to the system for retreival later.

### delivery.js
This script delivers content to the end-user.
delivery.js will expand across as many ports as instances are requested using pm2.
E.g. if port 3000 is specified, and 4 instances are requested, then ports 3000, 3001, 3002, and 3003 will all run an instance of delivery.js

### A front-facing proxy/load balancer such as Nginx or HAProxy should be used in front of both of these scripts.
