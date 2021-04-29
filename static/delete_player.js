function delete_player(dataJson) {
  let removedID = dataJson['id'];    

  // creating copy of players list
  let players_copy = {};

  // looping through players
  Object.values(players).forEach(p => {

    if (p.id === removedID) {        
      removed_name = p['name'];
      // skip over removed played
      console.log('Player ' + removed_name + ' has left the room. ');
      
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

      let alert_message_text = document.createTextNode(removed_name + ' has left the room.');
      
      // add message text to message
      alert_message.appendChild(alert_message_text);
      // add message to alert
      alert.appendChild(alert_message);

      // getting chat div
      let chat = document.getElementById("room-chat");
      // adding new message to chat div
      chat.appendChild(alert);

      if ( bottom ) {      
        room_chat.scrollTop = room_chat.scrollHeight;
      } 

      // looping over messages sent by current sender
      var x = document.getElementsByClassName('alert');
      // styling: alerts receive a gray color
      for (let i = 0; i < x.length; i++) {
        x[i].style.color = "rgb(158, 158, 158)";
      }
        
    } else {
      // add active players to copy of player list        
      players_copy[p.id] = p;      
    }

    // update players list
    players = players_copy;

  });
}