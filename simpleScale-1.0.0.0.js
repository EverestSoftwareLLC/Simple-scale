/*
The MIT License (MIT) https://mit-license.org/

Copyright 2018 Everest Software LLC https://www.hmisys.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sub-license, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES 
OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

SimpleScale = function(canvasID, options) {                          

 if ((typeof canvasID === "undefined") || (canvasID === "")) {
  alert("SimpleScale: Make sure to provide an id string.");
  return false;
 }

 this.id = canvasID;

 if (typeof options === "undefined") 
  options = {};

 this.cRef = {};
 this.ctx = {};
 this.backgroundColor = options.backgroundColor ? options.backgroundColor : "white";
 this.fontName = options.fontName ? options.fontName : "Verdana";
 this.fontSize = options.fontSize ? options.fontSize : 12;
 this.fontColor = options.fontColor ? options.fontColor : "black";
 this.scaleColor = options.scaleColor ? options.scaleColor : "black";
 this.fontOffset = options.fontOffset ? options.fontOffset : 2;

 if (typeof options.FMax === "undefined") 
  this.FMax = 100;
 else
  this.FMax = options.FMax;

 if (typeof options.FMax === "undefined") 
  this.FMin = 0;
 else
  this.FMin = options.FMin;

 this.orientation = options.orientation ? options.orientation : 0;			//vertical, horizontal
 this.endMargin = options.endMargin ? options.endMargin : 20;				//shrinks the scale size 
 this.decimalCount = options.decimalCount ? options.decimalCount : 0;

//none,leftTop,rightBottom,both 
 this.textAlign = options.textAlign ? options.textAlign : "Left/Top"; 

//leftTop,center,rightBottom 
 this.ticksAlign = options.ticksAlign ? options.ticksAlign : "rightBottom";				

 this.imageSrc = options.imageSrc ? options.imageSrc : "";
 this.majorTickCount = options.majorTickCount ? options.majorTickCount : 5;
 this.minorTickCount = options.minorTickCount ? options.minorTickCount : 2;
 this.majorTickSize = options.majorTickSize ? options.majorTickSize : 10;
 this.minorTickSize = options.minorTickSize ? options.minorTickSize : 5;

 if (typeof options.edgeLine === "undefined") 
  this.edgeLine = true;
 else
  this.edgeLine = options.edgeLine ? options.edgeLine : true;

 if (typeof options.invertScale === "undefined") 
  this.invertScale = true; 
 else
  this.invertScale = options.invertScale ? options.invertScale : false;

 this.opaque = options.opaque ? options.opaque : true;
 this.markWidth = options.markWidth ? options.markWidth: 1;
 
 this.cRef = document.getElementById(this.id);  //a reference to the canvas
 if (this.cRef) {
  this.ctx = this.cRef.getContext("2d");
  this.cRef.width = this.cRef.offsetWidth;		//intrinsic and extrinsic need to match 		
  this.cRef.height = this.cRef.offsetHeight; 
  }
 else
  return;

 this.scaleWidth = 0;
 this.scaleHeight = 0;
 this.scaleTop = 0;

 if (this.imageSrc !== "") {
  this.bgImg = new Image(this.cRef.width,this.cRef.height);
  this.bgImg.src = this.imageSrc;
  }

 this.DrawScale = function() {
  if (!this.ctx)
   return;

  this.DrawSetup();

  if (typeof this.bgImg !== "undefined")  
   this.ctx.drawImage(this.bgImg, 0, 0,this.cRef.width,this.cRef.height);
  else if (this.opaque) {
   this.ctx.beginPath(); 
   this.ctx.rect(0,0,this.cRef.width,this.cRef.height);
   this.ctx.fillStyle = this.backgroundColor;
   this.ctx.fill();  
   }
  
  this.DrawText();
  this.DrawTicks();
 };

 this.DrawSetup = function() {
  this.scaleOffset = Math.abs(this.endMargin);
  if (this.orientation == "Vertical") {   
   this.scaleWidth = this.cRef.width;
   this.scaleHeight = this.cRef.height - (this.scaleOffset * 2);
   }
  else {
   this.scaleWidth = this.cRef.width - (this.scaleOffset * 2);
   this.scaleHeight =  this.cRef.height;
   }

 };

 this.DrawText = function() {
  if (this.textAlign == "None")
   return;		//no text

  this.ctx.font = this.fontSize.toString() + "px " + this.fontName; //example 26px Verdana;
  this.ctx.fillStyle = this.fontColor;
  this.ctx.textBaseline="top";

  if (this.orientation == "Vertical")
   this.DrawTextVertical();
  else
   this.DrawTextHorizontal();
 };

 this.DrawTextHorizontal = function() {
  var s1,i,x,fontHeightDiv2,textW,midY,halfMajor;
  var deltaLong,perDivision,value;

  function InitialCalculate(g) {
   deltaLong = (g.scaleWidth / g.majorTickCount) ;
   perDivision = (g.FMax - g.FMin) / g.majorTickCount;
   if (g.invertScale) {
    perDivision = -perDivision;
    value = g.FMin;
    }
   else
    value = g.FMax;
  }

  function DoTextBottomOfCenter(g) {
   var index;
   midY = (g.scaleHeight / 2);
   halfMajor = g.majorTickSize / 2;

   for (index = 0; index <= g.majorTickCount; index++) {
    x = g.scaleOffset + (deltaLong * index);
    s1 = value.toFixed(g.decimalCount);
    textW = g.ctx.measureText(s1).width / 2;
    value = value - perDivision;
    g.ctx.fillText(s1,x - textW, midY + halfMajor);
   }
  }

  function DoTextTopOfCenter(g) {
   var index;
   midY = (g.scaleHeight / 2);
   halfMajor = g.majorTickSize / 2;

   for (index = 0; index <= g.majorTickCount; index++) {
    x = g.scaleOffset + (deltaLong * index);
    s1 = value.toFixed(g.decimalCount);
    textW = g.ctx.measureText(s1).width / 2;
    value = value - perDivision;
    g.ctx.fillText(s1,x - textW, midY - halfMajor - g.fontSize - (g.fontOffset * 2));
   }
  }

  fontHeightDiv2 = this.fontSize / 2;
//if the ticks are top  or bottom the text aligns with the tick.
//if none selected we would not be here.
//if center ticks, then could be top, bottom or both.

  InitialCalculate(this);
  switch(this.ticksAlign) {

   case "Left/Top":                      
    for (i = 0; i <= this.majorTickCount; i++) {
     x = this.scaleOffset + (deltaLong * i);
     s1 = value.toFixed(this.decimalCount);
     textW = this.ctx.measureText(s1).width / 2;
     value = value - perDivision;
     this.ctx.fillText(s1,x - textW,this.majorTickSize + 2);
    }              //end of major tick marks
    break;
   
   case "Center": 
    switch (this.textAlign) {
     case "Left/Top":        				
      DoTextTopOfCenter(this);
      break;
     case "Right/Bottom":        
      DoTextBottomOfCenter(this);
      break; 
     case "Both": 
      DoTextTopOfCenter(this);
      InitialCalculate(this);
      DoTextBottomOfCenter(this);
      break;
     }			//end of this.textAlign case
    break;

   case "Right/Bottom":
    for (i = 0; i <= this.majorTickCount; i++) {
     x = this.scaleOffset + (deltaLong * i);
     s1 = value.toFixed(this.decimalCount);
     textW = this.ctx.measureText(s1).width / 2;
     value = value - perDivision;
     this.ctx.fillText(s1,x - textW,this.scaleHeight - this.majorTickSize - this.fontSize - this.fontOffset);
    }              //end of major tick marks
    break;

  }		//end of this.ticksAlign case   
 };

 this.DrawTextVertical = function() {
  var s1,i,y,fontHeightDiv2,textW,midX,halfMajor;
  var deltaLong,perDivision,value;

  function InitialCalculate(g) {
   deltaLong = ((g.scaleHeight - g.scaleOffset) / g.majorTickCount) ;
   perDivision = (g.FMax - g.FMin) / g.majorTickCount;
   if (g.invertScale) {
    perDivision = -perDivision;
    value = g.FMin;
    }
   else
    value = g.FMax;
  }

  function DoTextLeftOfCenter(g) {
   var index;
   for (index = 0; index <= g.majorTickCount; index++) {
    y = (g.scaleOffset + (deltaLong * index)) - fontHeightDiv2;
    s1 = value.toFixed(g.decimalCount);
    textW = g.ctx.measureText(s1).width;
    value = value - perDivision;
    g.ctx.fillText(s1,midX - halfMajor - 2  - textW,y);
   }
  }

  function DoTextRightOfCenter(g) {
   var index;
   for (index = 0; index <= g.majorTickCount; index++) {
    y = (g.scaleOffset + (deltaLong * index)) - fontHeightDiv2;
    s1 = value.toFixed(g.decimalCount);
    value = value - perDivision;
    g.ctx.fillText(s1,midX + halfMajor + 2,y);
   }
  }

  fontHeightDiv2 = this.fontSize / 2;

//if the ticks are left or right the text aligns with the tick.
//if none selected we would not be here.
//if center ticks, then could be left, right or both.

  InitialCalculate(this);
  switch(this.ticksAlign) {

   case "Left/Top":                      //left
    for (i = 0; i <= this.majorTickCount; i++) {
     y = (this.scaleOffset + (deltaLong * i)) - fontHeightDiv2;
     s1 = value.toFixed(this.decimalCount);
     value = value - perDivision;
     this.ctx.fillText(s1,this.majorTickSize + 2,y);
    }              //end of major tick marks
    break;
   
   case "Center": 
    midX = (this.scaleWidth / 2);
    halfMajor = this.majorTickSize / 2;
    switch (this.textAlign) {
     case "Left/Top":        
      DoTextLeftOfCenter(this);
      break;
     case "Right/Bottom":        
      DoTextRightOfCenter(this);
      break; 
     case "Both": 
      DoTextLeftOfCenter(this);
      InitialCalculate(this);
      DoTextRightOfCenter(this);
      break;
    }		//end of this.textAlign case   
    break;
 
   case "Right/Bottom":
    for (i = 0; i <= this.majorTickCount; i++) {
     y = (this.scaleOffset + (deltaLong * i)) - fontHeightDiv2;
     s1 = value.toFixed(this.decimalCount);
     textW = this.ctx.measureText(s1).width;
     value = value - perDivision;
     this.ctx.fillText(s1,this.scaleWidth - this.majorTickSize - 2 - textW,y);
    }              //end of major tick marks
    break;

  }		//end of this.ticksAlign switch
 };

 this.DrawTicks = function() {

  this.ctx.strokeStyle = this.scaleColor;
  this.ctx.lineWidth = this.markWidth;

  if (this.orientation == "Vertical")
   this.DrawTicksVertical();
  else
   this.DrawTicksHorizontal();
 };

 this.DrawTicksHorizontal = function() {
  var i,x,y,midY,halfMajor,halfMinor,index,deltaLong,deltaShort;

  if (this.majorTickSize < 1)
   return;

  deltaLong = (this.scaleWidth / this.majorTickCount);
  if (this.minorTickCount > 0) 
   deltaShort = (deltaLong / (this.minorTickCount + 1));
  else
   deltaShort = 0;

  switch(this.ticksAlign) {

   case "Left/Top":
    for (i = 0; i <= this.majorTickCount; i++) {
     x = (deltaLong * i) + this.scaleOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(x,0);
     this.ctx.lineTo(x,this.majorTickSize);
     this.ctx.stroke(); 
     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {    //draw minor if configured
      for (y = 0; y < this.minorTickCount; y++) {
       x = x + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(x,0);
       this.ctx.lineTo(x,this.minorTickSize);
       this.ctx.stroke(); 
      }
     }
    }
    if (this.edgeLine) {
     this.ctx.beginPath(); 
     this.ctx.moveTo(this.scaleOffset,0);
     this.ctx.lineTo(this.scaleWidth + this.scaleOffset ,0);
     this.ctx.stroke();
    } 
    break;

   case "Center":
    midY = (this.scaleHeight / 2);
    halfMajor = this.majorTickSize / 2;
    halfMinor = this.minorTickSize / 2;
    for (i = 0; i <= this.majorTickCount; i++) {
     x = (deltaLong * i) + this.scaleOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(x,midY - halfMajor);
     this.ctx.lineTo(x,midY + halfMajor);
     this.ctx.stroke(); 
     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {    //draw minor if configured
      for (index = 0; index < this.minorTickCount; index++) {
       x = x + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(x,midY - halfMinor);
       this.ctx.lineTo(x,midY + halfMinor);
       this.ctx.stroke(); 
      }
     }
    }
    break;

   case "Right/Bottom":
    for (i = 0; i <= this.majorTickCount; i++) {
     x = (deltaLong * i) + this.scaleOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(x,this.scaleHeight);
     this.ctx.lineTo(x,this.scaleHeight - this.majorTickSize);
     this.ctx.stroke(); 
     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {    //draw minor if configured
      for (y = 0; y < this.minorTickCount; y++) {
       x = x + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(x,this.scaleHeight);
       this.ctx.lineTo(x,this.scaleHeight - this.minorTickSize);
       this.ctx.stroke(); 
      }
     }
    }
    if (this.edgeLine) {
     this.ctx.beginPath(); 
     this.ctx.moveTo(this.scaleOffset,this.scaleHeight);
     this.ctx.lineTo(this.scaleWidth + this.scaleOffset ,this.scaleHeight);
     this.ctx.stroke();
    } 
    break;
  }							//end of switch(this.ticksAlign)
 };

 this.DrawTicksVertical = function() {
  var i,y,x,midX,halfMajor,halfMinor,deltaLong,deltaShort;

  if (this.majorTickSize < 1)
   return;

  deltaLong = ((this.scaleHeight - this.scaleOffset) / this.majorTickCount);
  if (this.minorTickCount > 0)
   deltaShort = (deltaLong / (this.minorTickCount + 1));
  else
   deltaShort = 0;

  switch(this.ticksAlign) {

   case "Left/Top":
    for (i = 0; i <= this.majorTickCount; i++) {
     y = this.scaleOffset + (deltaLong * i) + this.fontOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(0,y); 
     this.ctx.lineTo(this.majorTickSize,y);
     this.ctx.stroke(); 
     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {    //draw minor if configured
      for (x = 0; x < this.minorTickCount; x++) {
       y = y + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(0,y);
       this.ctx.lineTo(this.minorTickSize,y);
       this.ctx.stroke(); 
      }
     }				//end of minor tick marks
    }           //end of major tick marks

    if (this.edgeLine) {
     this.ctx.beginPath(); 
     y = this.scaleOffset + 1;
     this.ctx.moveTo(0,y);
     y = this.scaleOffset + (deltaLong * this.majorTickCount) + this.fontOffset;
     this.ctx.lineTo(0,y);
     this.ctx.stroke(); 
    }
    break;

   case "Center":
    midX = (this.scaleWidth / 2);
    halfMajor = (this.majorTickSize / 2);
    halfMinor = (this.minorTickSize / 2);
    for (i = 0; i <= this.majorTickCount; i++) {
     y = this.scaleOffset + (deltaLong * i) + this.fontOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(midX - halfMajor,y);
     this.ctx.lineTo(midX + halfMajor,y);
     this.ctx.stroke(); 

     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {   //draw minor if configured
      for (x = 0; x < this.minorTickCount; x++) {
       y = y + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(midX - halfMinor,y);
       this.ctx.lineTo(midX + halfMinor,y);
       this.ctx.stroke(); 
      }
     }            //end of minor tick marks
    }             //end of major tick marks
    break;

   case "Right/Bottom":
    for (i = 0; i <= this.majorTickCount; i++) {
     y = this.scaleOffset + (deltaLong * i) + this.fontOffset;
     this.ctx.beginPath(); 
     this.ctx.moveTo(this.scaleWidth - 1,y);
     this.ctx.lineTo(this.scaleWidth - 1 - this.majorTickSize,y);
     this.ctx.stroke(); 

     if ((this.minorTickCount > 0) && (i != this.majorTickCount)) {   //draw minor if configured
      for (x = 0; x < this.minorTickCount; x++) {
       y = y + deltaShort;
       this.ctx.beginPath(); 
       this.ctx.moveTo(this.scaleWidth - 1,y);
       this.ctx.lineTo(this.scaleWidth - 1 - this.minorTickSize,y);
       this.ctx.stroke(); 
      }
     }            //end of minor tick marks
    }              //end of major tick marks

    if (this.edgeLine) {
     this.ctx.beginPath(); 
     y = this.scaleOffset + 1;
     this.ctx.moveTo(this.scaleWidth - 1,y);
     y = this.scaleOffset + (deltaLong * this.majorTickCount) + this.fontOffset;
     this.ctx.lineTo(this.scaleWidth - 1,y);
     this.ctx.stroke(); 
    }
    break;
  }			//end of switch(this.ticksAlign)
 };			//end of this.DrawTicksVertical

};
 


