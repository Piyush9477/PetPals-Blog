const http = require("http");
const app = require("./app");
const {port} = require("./config/keys");

//Create server
const server = http.createServer(app);

//Listen server
server.listen(port, () => {console.log(`Server is running on port ${port}`)});