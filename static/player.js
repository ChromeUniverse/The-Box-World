/*

**************** Player Class ****************

*/





class Player{
  // creates new player instance
  constructor(id, name, col, x, y){
    this.id = id;
    this.name = name;
    this.col = col; // color
    this.x = x;
    this.y = y;
    this.has_msg = false;
    this.msg_text = '';
    this.msg_time = 0;
  }

  // renders the player on the canvas
  display() {
    
    // highlight user with a thin white border
    if (this.id == user.id) {
      strokeWeight(3);
      stroke('rgb(38, 38, 61)');
    } else {
      noStroke();
    }
    
    // draw thingy
    fill(this.col);
    rectMode(CENTER);
    rect(this.x, this.y, thingyW, thingyH, 10, 10);

    noStroke();
    // show player name 
    textSize(20);
    fill(color(255));
    textAlign(CENTER, BOTTOM);
    text(this.name, this.x, this.y+thingyH/2+30);  
    
    let time_now = Math.round(Date.now()/1000);
    let timeout = max(user.msg_text.length * 1/30, 4);
    
    if (this.has_msg == true && time_now - this.msg_time < timeout) {      
      
      textSize(18);
      fill(color(255));
      triangle(this.x + 30, this.y-thingyH/2+20, this.x + 30, this.y - thingyH/2-10, this.x + 50, this.y - thingyH/2-10);
      
      if (this.x + textWidth(this.msg_text) + 60 > canvasW) {
        
        // display text box
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(canvasW - textWidth(this.msg_text) - 30, this.y-40, textWidth(this.msg_text)+30, textSize(this.msg_text)+10, 10, 10);

        // display message text
        noStroke();
        fill(this.col);
        textAlign(RIGHT, TOP);
        text(this.msg_text, canvasW - 15, this.y-35);
        
      } else {
        
        // display text box
        rectMode(CORNER);
        noStroke();
        fill(255);
        rect(this.x + 30, this.y-40, textWidth(this.msg_text)+30, textSize(this.msg_text)+10, 10, 10);

        // display message text
        noStroke();
        fill(this.col);
        textAlign(LEFT, TOP);
        text(this.msg_text, this.x + 45, this.y-35);
      
      }
      
    } else {
      this.has_msg = false;
      this.msg_text = '';
    }
  }
}