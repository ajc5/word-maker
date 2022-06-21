
// 1. select letter
//  - shows next possible letters of words
// 2. repeat until word is formed
//    - show words on side. add points for words made. 1 point per letter.

// https://www.englishbix.com/three-letter-words-for-kids/
var words =
  "cab,dab,jab,lab,nab,tab,bat,cat,fat,hat,mat,pat,rat,sat,vat,gal,pal,gas,yak,wax,tax,bam,dam,ham,jam,ram,yam,cap,gap,lap,map,nap,rap,sap,tap,yap,bag,gag,hag,lag,nag,rag,sag,tag,wag,ban,can,fan,man,pan,ran,tan,van,bad,dad,had,lad,mad,pad,sad,tad";
words = words.split(",");

var wordTree = {};
words.forEach((word) => {
  var tempWordTree = wordTree;
  word.split("").forEach((letter) => {
    if (!tempWordTree[letter]) {
      tempWordTree[letter] = {};
    }
    tempWordTree = tempWordTree[letter];
  });
});

var currLevel = wordTree;
var wordDiv = document.getElementById("word");
var lettersDiv = document.getElementById("letters");
addLetters();

function addLetters() {
  lettersDiv.innerHTML = "";
  var letters = Object.keys(currLevel);
  for (var i = 0; i < letters.length; i++) {
    let letterDiv = document.createElement("div");
    letterDiv.classList.add("item");
    letterDiv.onclick = () => {
      let currLetter = letterDiv.innerText;
      wordDiv.innerText += currLetter;
      currLevel = currLevel[currLetter];
      addLetters();
    };
    letterDiv.innerText = letters[i];
    lettersDiv.appendChild(letterDiv);
  }
}
