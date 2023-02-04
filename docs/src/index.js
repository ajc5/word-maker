// dynamically select wordset and language
// 1. fixed word sets
// 2. wikidata to get images of words
// 3. custom word sets
// 4. languages - translate using wikidata

// use syllable letter-combos instead of just single letters

// sentences


// https://www.englishbix.com/three-letter-words-for-kids/

/*
var lastSeen;
var loop = function () {
  lastSeen = Date.now();
  setTimeout(loop, 50);
};
loop();
bgloop.addEventListener(
  "timeupdate",
  function () {
    if (Date.now() - lastSeen > 100) {
      this.pause();
    }
  },
  false
);
*/

/*
Related terms:
singular vs plural
animal <-> shelter
male vs female
child vs adult
body part by animal

*/

var wordDiv = document.getElementById("word");
var wordImageDiv = document.getElementById("wordImage");
var scoreDiv = document.getElementById("score");
var wordsDiv = document.getElementById("words");
var lettersDiv = document.getElementById("letters");
var wordSetSelectorBtn = document.getElementById("wordSetSelector");
var customWordSetSpan = document.getElementById("customWordSet");
var modalDiv = document.getElementById("modal");
var modalContentDiv = document.querySelector("#modal .modal-content");
var wordTree = {}, usedWordTree = {}, currLevel, currUsedLevel;

var wordsets = {
  three_letters: "ant,arm,axe,bag,bat,bed,bee,bun,box,boy,bug,cap,can,car,cat,cow,cup,dad,day,dog,ear,egg,eye,fan,fox,god,hat,ice,jam,jar,key,mat,man,map,nut,pan,pig,pot,rat,sun,toe,tub,van",
  four_letters: "ball,book,papa,mama,kite,girl,foot,dust,doll,cake",
  colors: "black,blue,green,orange,purple,red,violet,white,yellow",
  days: "friday,monday,saturday,sunday,thursday,tuesday,wednesday",
  months: "april,august,december,february,january,july,june,march,may,september",
  animals: "bird,bull,cat,cow,crab,dog,duck,eagle,fish,frog,goat,goose,horse,koala,lion,panda,pig,rat,seal,sheep,snake,stork,swan,tiger,toad,whale,zebra",
  body: "arm,cheek,chin,ear,elbow,eye,finger,foot,hand,head,heel,jaw,knee,leg,lip,mouth,neck,nail,nose,shoulder,stomach,teeth,thigh,tongue,toe",
  organs: "brain,heart,intestine,kidney,liver,lung,pancreas,skin"
  };
var customWordSet = ""
var words, wordSet;

showWordSets()

function addWord() {
  let customWord = document.getElementById("customWord").value
  customWordSet += "," + customWord;
  customWordSetSpan.innerHTML = customWordSet;
  document.getElementById("customWord").value = "";
  selectWordSet(wordSetSelectorBtn.value);
}

function showWordSets() {
  modalDiv.style.display = "block"
  modalContentDiv.innerHTML = Object
  .keys(wordsets)
  .map(set => `<input type="button" onclick="selectWordSet('${set}')" value="${set}"></input>`)
  .join('<br><br>')
}

function selectWordSet(wordSetId) {
  wordDiv.innerHTML = ""
  modalDiv.style.display = "none"
  wordSetSelectorBtn.value = wordSetId
  words = (wordsets[wordSetId] + customWordSet).toUpperCase().split(",");
  wordSet = words.reduce((a, v) => ({ ...a, [v]: v}), {}) 
  wordTree = {}
  usedWordTree = {}
  words.forEach((word) => {
    var tempWordTree = wordTree;
    word.split("").forEach((letter) => {
      if (!tempWordTree[letter]) {
        tempWordTree[letter] = {};
      }
      tempWordTree = tempWordTree[letter];
    });
  });
  currLevel = wordTree;
  currUsedLevel = usedWordTree;
  wordDiv.onclick = () => {
    sayIt(wordDiv.innerText);
  };
  updateUI();  
}

function updateUI() {
  lettersDiv.innerHTML = "";
  var letters = Object.keys(currLevel).sort();
  let pressed = false;
  for (var i = 0; i < letters.length; i++) {
    let letterDiv = document.createElement("div");
    letterDiv.classList.add("item");
    let currLetter = letters[i];
    letterDiv.innerText = currLetter;
    if (currUsedLevel[currLetter] !== undefined) {
      letterDiv.style.backgroundColor = "khaki";
    }
    letterDiv.onclick = () => {
      if (pressed) {
        return;
      } else {
        pressed = true;
      }
      currLevel = currLevel[currLetter];
      if (currUsedLevel[currLetter] === undefined) {
        currUsedLevel[currLetter] = {};
      }
      currUsedLevel = currUsedLevel[currLetter];
      sayIt(currLetter);
      letterDiv.style.animation = "hoy .5s linear";
      letterDiv.style.position = "relative";
      letterDiv.addEventListener("animationend", () => {
        wordDiv.innerText += currLetter;
        updateUI();
      });
    };
    lettersDiv.appendChild(letterDiv);
  }
  if (letters.length === 0 || wordSet[wordDiv.innerText]) {
    scoreDiv.innerText = parseInt(scoreDiv.innerText) + wordDiv.innerText.length;
    wordsDiv.innerHTML = wordDiv.innerText + " " + wordsDiv.innerText;
    //removeWord(wordTree, wordDiv.innerText, 0);
    //wordDiv.append(document.createElement("br"));
    var img = document.createElement("img");
    img.src = "https://source.unsplash.com/random/200x300/?" + wordDiv.innerText;
    img.style = "animation: wordImg 2.5s ease-in";
    wordImageDiv.append(img);
    sayIt(wordDiv.innerText);
    setTimeout(() => {
      var audio = new Audio("src/yay.mp3");
      audio.play();
        setTimeout(() => {
          wordImageDiv.innerHTML = "";
          if (letters.length === 0) {
            wordDiv.innerHTML = "";
            currLevel = wordTree;
            currUsedLevel = usedWordTree;
            updateUI();
          }
        }, 4000);
    }, 1000);
  }
}

function sayIt(text) {
  let utterance = new SpeechSynthesisUtterance(text.toLocaleLowerCase());
  speechSynthesis.speak(utterance);
}
/*
function removeWord(subTree, word, index) {
  var currLetter = word[index];
  if (currLetter !== undefined) {
    removeWord(subTree[currLetter], word, ++index);
    if (Object.keys(subTree[currLetter]).length === 0)
      delete subTree[currLetter];
  }
}
*/

function playBgm() {
  var bgloop = document.getElementById("bgloop");
  bgloop.volume = 0.07;
  bgloop.play();
}
