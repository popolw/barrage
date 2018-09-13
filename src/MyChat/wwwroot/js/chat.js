"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var canvas = document.getElementById('canvas');
var video = document.getElementById('video');
//canvas.style.width = video.style.width;
//canvas.style.height = video.style.height;
var obj = new barrage(canvas, video);


connection.on('on_revice',function(message,time,color){
    obj.add(message,color, time);
});

connection.start().catch(function(err){
    return console.error(err.toString());
});

document.getElementById('btn_Send').addEventListener('click',function(event){
    var message = document.getElementById('txtMessage').value;
    var time = obj.getVideoTime();
    var color=document.getElementById('color1').value;
    connection.invoke('SendMessage',message,time,color).catch(function(err){
        return console.error(err.toString());
    });
    event.preventDefault();
});

$.post('http://localhost:9090/Home/Get',function(data){
    data.forEach(p => {
        //alert('text:'+p.time+',time:'+p.time);
        obj.add(p.text,p.color, p.time);
    });

});

$('#colorpicker').farbtastic({callback:'#color1', width: 150});