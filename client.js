(function(){
  var host="http://192.168.1.116:5713";//prompt("Style Watcher Server","http://localhost:5713");
  var s=document.createElement('script');
  s.setAttribute('src',host+'/socket.io/socket.io.js');
  document.getElementsByTagName('head')[0].appendChild(s);

  s.onload=function(){
    var socket = io.connect(host);
    var st=document.getElementsByTagName("link"),
    sheets=[];

    [].slice.apply(st).forEach(function(s){
      var fpath=s.getAttribute("href"),
      fparts=fpath.split("/"),
      fname=fparts[fparts.length-1],
      fpath=fparts.join("/").replace(fname,""),
      sheet=fname.split("?")[0];

      sheets.push({
        sheet:sheet,
        el:s,
        path:fpath
      });

      socket.emit("watch",{"filename":sheet});
    });


    function reloadSheet(name){
      var i=0,to_process=null;
      sheets.forEach(function(s){
        if(s.sheet==name){
          to_process=i;
        }
        i++;
      });
      if(to_process!==null){
        var s=sheets[to_process];
        var new_s=document.createElement("link");
        new_s.setAttribute("rel","stylesheet");
        new_s.setAttribute("type","text/css");
        new_s.setAttribute("href",s.path+s.sheet+"?forceReload="+(new Date).getTime());
        document.getElementsByTagName('head')[0].appendChild(new_s);
        setTimeout(function(){
          s.el.parentNode.removeChild(s.el);
          var _tmp={
            sheet:s.sheet,
            el:new_s,
            path:s.path
          }
          sheets.splice(to_process,1);
          sheets.push(_tmp);
        },500)
      }
    }



    socket.on('filechanged', debounce(function (data) {
      reloadSheet(data.filename);
    },300));
  }

  var debounce=function(func, threshold, execAsap) {
    var timeout;
    return function debounced () {
      var obj = this, args = arguments;
      function delayed () {
        if (!execAsap)
          func.apply(obj, args);
          timeout = null;
        };
        if (timeout)
          clearTimeout(timeout);
        else if (execAsap)
          func.apply(obj, args);
        timeout = setTimeout(delayed, threshold || 100);
    };
  }

})();