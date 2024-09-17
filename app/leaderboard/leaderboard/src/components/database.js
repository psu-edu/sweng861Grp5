const apiUrl = 'http://localhost:3001/api/leaderboard/';

const Leaderboard = []
fetch(apiUrl)
    .then(response => response.json())
    .then(function (result) {
        for (var i = 0; i < result.length; i++) {
            Leaderboard.push(result[i])
        }
        console.log('Users', Leaderboard)
    })
    .catch(error => console.log('error', error));

export default Leaderboard;