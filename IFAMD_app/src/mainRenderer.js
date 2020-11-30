var { ipcRenderer } = require('electron')

// player lookup
document.getElementById('player_button').addEventListener("click", () =>
{
    var playerName = document.getElementById('player_name').value
    ipcRenderer.send('lookupPlayer', playerName)
})
// club lookup
document.getElementById('club_button').addEventListener("click", () =>
{
    var clubName = document.getElementById('club_name').value
    ipcRenderer.send('lookupClub', clubName)
})
// date lookup
document.getElementById('date_button').addEventListener("click", () =>
{
    var date = document.getElementById('date').value
    ipcRenderer.send('lookupDate', date)
})
// Any lookup
document.getElementById('user_button').addEventListener("click", () =>
{
    var query = sqlEditor.getValue()
    ipcRenderer.send('lookupGeneral', query)
})