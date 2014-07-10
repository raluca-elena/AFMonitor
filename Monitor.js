/**
 * Created by rpodiuc on 7/9/14.
 */
//former url
//var url = "http://scheduler.taskcluster.net/v1/task-graph/ieBIjTIUShe4OG-ck4nRCQ/inspect";
//var url = "http://scheduler.taskcluster.net/v1/task-graph/lfFqN08qSSWM6aGgpQuCGg/inspect"
var url = "http://scheduler.taskcluster.net/v1/task-graph/52L-J4gDT1m8-3GbhHchgA/inspect";
var obj = {};

// or create an object with some items already in it
//var obj = {"1":true, "2":true, "3":true, "9":true};
function createPage(url){
    $.get( url, function parseResponse(data) {
        console.log(data);
        var list = [];
        for (var key in data["tasks"])
        {
            console.log("mmmmm_________________", data["tasks"][key]["taskId"]);
            //var x = data['tasks'][key]['taskId'];
            //$("#unicorn" ).append("<div></div>").text(data['tasks'][key]['taskId']);
            list.push(key);
            console.log("KEY IS", key);
            obj[key] = true;
            var x = $('<div id="' + key + '"></ div>').text(key);
            $('#unicorn').append(x);
            if (data["tasks"][key]["resolution"] !== "{}"){
                console.log("completed~~~~~~~~~~~~~", data["tasks"][key]["resolution"]["completed"]);
                console.log("success~~~~~~~~~~~~~", data["tasks"][key]["resolution"]["success"]);
                console.log("result~~~~~~~~~~~~~~", data["tasks"][key]["resolution"]["resultUrl"]);

                console.log("logsUrl~~~~~~~~~~~~~", data["tasks"][key]["resolution"]["logsUrl"]);
            }
        }
        list.sort();
        console.log("LIST is ----- ", list);
        console.log("obj is ", obj);
    });
}
createPage(url);
function makeRecursiveRequest(url, listOfTasks) {
    $.get( url, function parseResponse(data) {
        console.log(data);
        //this is a miserable hack
        if (Object.keys(obj).length === 0) {
            console.log("------------------------I DID IT!");
            return;
        }
        for (var key in data["tasks"])
        {

            console.log("mmmmm_________________", data["tasks"][key]["taskId"], data["tasks"][key]["resolution"]);
            if (data["tasks"][key]["resolution"] !== "{}") {
                console.log("completed~~~~~~~~~~~~~", data["tasks"][key]["resolution"]["completed"]);
                if (data["tasks"][key]["resolution"]["completed"] !== undefined && obj[key] !== undefined) {
                    $('<a>',{
                        text: "result   ",
                        title: 'Blah',
                        href: data["tasks"][key]["resolution"]["resultUrl"]
                    }).appendTo('#'+ key);
                    var resultUrl = data["tasks"][key]["resolution"]["resultUrl"];
                $.get(resultUrl,  function (data){
                    console.log("for TASKID ", key, "TASK RESULT -----//// ", data["artifacts"]["result"]);
                    var resUrl = data["artifacts"]["result"];
                    //console.log("my result url is -----", resUrl);
                   /* $('<a>',{
                        text: "downloadMe",
                        title: 'Blah',
                        href: resUrl
                    }).appendTo('#'+ key);*/

                });
                console.log("this is my castle!");
                delete(obj[key]);
            }

        }
        }

        makeRecursiveRequest(url);
    });
}
setTimeout(function() {
    makeRecursiveRequest(url);
}, 4000);



