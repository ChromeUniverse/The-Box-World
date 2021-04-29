/*

  Handles 'new-player' WS messages

*/


function new_player(dataJson) {

  // get new player attributes
  newPlayer_ID = dataJson['id'];
  newPlayer_name = dataJson['name'];
  newPlayer_color = dataJson['color'];
  newPlayer_X = dataJson['x'];
  newPlayer_Y = dataJson['y'];

  // create new player and add it to players list
  // (but only if it's not the user)
  if (newPlayer_ID != user.id) {
    newPlayer = new Player(newPlayer_ID, newPlayer_name, newPlayer_color, newPlayer_X, newPlayer_Y);      
    players[newPlayer_ID] = newPlayer;

    console.log('Player ' + newPlayer_name + ' has left the room. ');

    let room_chat = document.getElementById("room-chat"); 
  
    function isAtBottom(room_chat) {                
      let expression = room_chat.scrollTop + room_chat.clientHeight + 5 > room_chat.scrollHeight;
      return expression;      
    }

    let bottom = isAtBottom(room_chat);

    // Show a special message on chat
    // format:
    //   <p><i style="color: rgb(158, 158, 158);" class="alert">Lucca has joined the room.</i></p>
    // 
    let alert = document.createElement('p');

    let alert_message = document.createElement('i');
    // setting class name
    alert_message.className = "alert";

    let alert_message_text = document.createTextNode(newPlayer_name + ' has joined the room.');
    
    // add message text to message
    alert_message.appendChild(alert_message_text);
    // add message to alert
    alert.appendChild(alert_message);

    // getting chat div
    let chat = document.getElementById("room-chat");
    // adding new message to chat div
    chat.appendChild(alert);

    // looping over messages sent by current sender
    var x = document.getElementsByClassName('alert');
    // styling: alerts receive a gray color
    for (let i = 0; i < x.length; i++) {
      x[i].style.color = "rgb(158, 158, 158)";
    }

    if ( bottom ) {      
      room_chat.scrollTop = room_chat.scrollHeight;
    } 

  }    

}