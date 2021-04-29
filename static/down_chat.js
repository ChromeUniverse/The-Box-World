function down_chat(dataJson) {
  // parse out message
  let senderID = dataJson['id'];    
  let sender = players[senderID];     

  let message_text = dataJson['message'];
  console.log(sender.name + ' sent a message: "' + message_text + '"');

  // updating sender attributes
  sender.has_msg = true;
  sender.msg_text = dataJson['message'];
  sender.msg_time = Math.round(Date.now()/1000)

  // adding message to room chat    


  let room_chat = document.getElementById("room-chat"); 
  
  function isAtBottom(room_chat) {                
    let expression = room_chat.scrollTop + room_chat.clientHeight + 5 > room_chat.scrollHeight;
    return expression;      
  }

  let bottom = isAtBottom(room_chat);

  // create new message in DOM and add it to chat        

  // new message on the DOM looks like:
  // <p>
  //  <b class="e28bf531740a" style="color: rgb(153, 194, 77);">Lucca</b>: eo
  // </p>

  // create parent paragraph tag
  let new_message = document.createElement("p");

  // create internal bold tag for sender name
  let new_message_sender = document.createElement("b")
  // adding sender ID as class name
  new_message_sender.className = senderID;

  // creating sender's name
  let new_message_sender_name = document.createTextNode(sender.name);
  // adding sender name to sender
  new_message_sender.appendChild(new_message_sender_name);

  // adding sender to message
  new_message.appendChild(new_message_sender);

  // creating message text
  let new_message_text = document.createTextNode(': ' + message_text);
  // adding message text to actual message
  new_message.appendChild(new_message_text);

  // getting chat div
  let chat = document.getElementById("room-chat");
  // adding new message to chat div
  chat.appendChild(new_message);

  // looping over messages sent by current sender
  var x = document.getElementsByClassName(senderID);
  // styling: sender name (already in bold) gets sender color
  for (let i = 0; i < x.length; i++) {
    x[i].style.color = sender.col;
  }    
  
  if ( bottom ) {      
    room_chat.scrollTop = room_chat.scrollHeight;
  } 
}