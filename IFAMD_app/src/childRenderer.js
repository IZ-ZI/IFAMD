var { ipcRenderer } = require('electron')
var saveFile

//table-view related

//close table view
document.getElementById('close-table').addEventListener("click", () => {
    ipcRenderer.send('close-table-window')
})

//invoke file saving
document.getElementById('save-table').addEventListener("click", () => {
    ipcRenderer.send('save-file-to-computer', saveFile)
    saveFile = null
})


//display the query result
ipcRenderer.on("display-query-result", (event, arg) => {
    saveFile = arg
    //populate html table from query result
    var vals = []
    var html = '<table><thead><tr>'
    for(key in arg[0]){
        html += '<th>' + key + '</th>'
    }
    html += '<thead><tbody>'
    for (var i = 0; i < arg.length; i++){
        html += '<tr>'
        for (key in arg[i]){
            html += '<td>'+ arg[i][key] + '</td>'
        }
        html += '</tr>'
    }
    html += '</tbody></table>'
    document.getElementById('table_here').innerHTML = html
})