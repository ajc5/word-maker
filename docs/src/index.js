// BUG: doesn't work for words that are a subset (starting letters) of another word, eg, composite words
//      - show letter with and without full-stop as two buttons.

// Redo app - show full keyboard and disable letters that don't belong (rather than removing)
//          - this way transition is not jarring and avoids mindless single letter selection pages

// first screen => select from word sets (randomized order)

// change shade of bg of letter for each time a letter is used
// - encourage kids to try out all letters
// - need this since used letters wont be removed unless all words are selected

// dynamically select wordset and language
// 1. fixed wordsets
// 2. remote linked data wordsets

// word sets

// languages

// sentences

// verb tenses

// https://www.englishbix.com/three-letter-words-for-kids/

var bgloop = document.getElementById("bgloop");
bgloop.volume = 0.07;
bgloop.play();
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

var wordsets = {
  threeLetters: "air,ant,ape,arm,axe,bat,bed,bee,box,bug,car,cat,cog,cot,cow,dad,day,dew,dog,ear,eel,egg,elf,eye,fog,fox,gas,god,hat,ice,ink,jam,kid,lid,lip,mat,mud,nut,ox,oaf,oak,pet,pit",
  colors: "red,white,black,green,blue,orange,purple,violet",
  days: "monday,tuesday,wednesday,thursday,friday,saturday,sunday",
  months: "january,february,march,april,may,june,july,august,september,december",
  misc:
    "ball,bat,bed,book,boy,bun,can,cake,cap,car,cat,cow,cub,cup,dad,day,dog,doll,dust,fan,feet,girl,gun,hall,hat,hen,jar,kite,key,man,map,men,mom,pan,pet,pie,pig,pot,rat,son,sun,toe,tub,van,cab,dab,jab,lab,nab,tab,bat,cat,fat,hat,mat,pat,rat,sat,vat,gal,pal,gas,yak,wax,tax,bam,dam,ham,jam,ram,yam,cap,gap,lap,map,nap,rap,sap,tap,yap,bag,gag,hag,lag,nag,rag,sag,tag,wag,ban,can,fan,man,pan,ran,tan,van,bad,dad,had,lad,mad,pad,sad,tad",
  animals:
    "animal,dog,cat,cow,bull,buffalo,kangaroo,bat,rat,sheep,goat,lion,tiger,elephant,rhino,zebra,donkey,pig,horse,monkey,snake,panda,koala,camel,bird,duck,chicken,hen,rooster,eagle,parrot,stork,fish,whale,dolphin,penguin,shark,walrus,toad,frog,turtle,tortoise,rabbit,hare,goose,swan,eel,shrimp,octopus,jellyfish,crab,scorpion,lizard,gecko,dinosaur,alligator,crocodile,squid,seal,flamingo",
  body:
    "mouth,hand,leg,eye,ear,chin,cheek,head,neck,stomach,chest,teeth,tongue,nose,shoulder,knee,toe,finger,arm,elbow,thigh,calf,heel,foot,hair,nail,forehead,jaw,eyebrow,eyelash,eyelid,lips,nostril,arm",
  organs:
    "heart,brain,lung,muscle,kidney,intestine,liver,pancreas,throat,windpipe,food pipe,rib,spine,backbone,skull"
};
var words = wordsets["threeLetters"].toUpperCase().split(",");

var wordTree = {},
  usedWordTree = {};
words.forEach((word) => {
  var tempWordTree = wordTree;
  word.split("").forEach((letter) => {
    if (!tempWordTree[letter]) {
      tempWordTree[letter] = {};
    }
    tempWordTree = tempWordTree[letter];
  });
});

var currLevel = wordTree,
  currUsedLevel = usedWordTree;
var wordDiv = document.getElementById("word");
var scoreDiv = document.getElementById("score");
var wordsDiv = document.getElementById("words");
var lettersDiv = document.getElementById("letters");
wordDiv.onclick = () => {
  sayIt(wordDiv.innerText);
};
updateLetters();

function updateLetters() {
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
        updateLetters();
      });
    };
    lettersDiv.appendChild(letterDiv);
  }
  if (letters.length === 0) {
    scoreDiv.innerText =
      parseInt(scoreDiv.innerText) + wordDiv.innerText.length;
    wordsDiv.innerHTML = wordDiv.innerText + " " + wordsDiv.innerText;
    removeWord(wordTree, wordDiv.innerText, 0);
    wordDiv.append(document.createElement("br"));
    var img = document.createElement("img");
    img.src =
      "https://source.unsplash.com/random/200x300/?" + wordDiv.innerText;
    img.style = "animation: wordImg 2.5s ease-in";
    wordDiv.append(img);
    sayIt(wordDiv.innerText);
    setTimeout(() => {
      var audio = new Audio("src/yay.mp3");
      audio.play();
      setTimeout(() => {
        wordDiv.innerHTML = "";
        currLevel = wordTree;
        currUsedLevel = usedWordTree;
        updateLetters();
      }, 4000);
    }, 1000);
  }
}

function sayIt(text) {
  let utterance = new SpeechSynthesisUtterance(text.toLocaleLowerCase());
  speechSynthesis.speak(utterance);
}
function removeWord(subTree, word, index) {
  var currLetter = word[index];
  if (currLetter !== undefined) {
    removeWord(subTree[currLetter], word, ++index);
    if (Object.keys(subTree[currLetter]).length === 0)
      delete subTree[currLetter];
  }
}
