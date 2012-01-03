var fs=require("fs"),
app=require('http').createServer(handler),
io = require('socket.io').listen(app),
config={
  basepath:"../assets/css/"
};

app.listen(5713);

function handler(req,res){
  res.writeHead(200);
  res.end("hello");
}
io.sockets.on('connection', function (socket) {
  socket.on('watch', function (data) {
    fs.watchFile(config.basepath+data.filename, function (curr, prev) {
      if(curr.mtime!==prev.mtime){
        socket.emit("filechanged",{filename:data.filename})
      }
    });
  });
});