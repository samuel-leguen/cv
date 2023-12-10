// document.addEventListener("load", ready);

//function d'affiche du contenu a partir d'un fichier texte
function displayFileText(fileSrc, targetElementId) {
  fetch(fileSrc).then(function (response) {
    response.text().then(function (text) {
      document.getElementById(targetElementId).innerHTML = text;
    });
  });
}

// Recupération du contenu "A propos de moi" pour affichage
displayFileText("./public/about_me_fr.txt", "about_me_text");


// Recupération du contenu des éxpériences
displayFileText("./public/project1.txt", "project1_text");
displayFileText("./public/project2.txt", "project2_text");
displayFileText("./public/project3.txt", "project3_text");


// Recupération du contenu des éxpériences
displayFileText("./public/exp4.txt", "exp4_text");
displayFileText("./public/exp3.txt", "exp3_text");
displayFileText("./public/exp2.txt", "exp2_text");
displayFileText("./public/exp1.txt", "exp1_text")

// Recupération du contenu des formations 
displayFileText("./public/edu3.txt", "edu3_text");
displayFileText("./public/edu2.txt", "edu2_text");
displayFileText("./public/edu1.txt", "edu1_text")



// // Effet yoyo du blob
// const blob_animation = KUTE.fromTo(
//   "#blob1",
//   {path: "#blob1"},
//   {path: "#blob2"},
//   {repeat:999, duration:1000, yoyo: true}
// )

// blob_animation.start()




// Code pour elargir le menu en utilisant du morphisme
const enlarge = KUTE.fromTo(
    "#curve-inactive",
    {path: "#curve-inactive"},
    {path: "#curve-active"},
    {
      duration: 700,
      easing: 'easingCubicInOut'
    }
)

const reduce = KUTE.fromTo(
  "#curve-inactive",
  {path: "#curve-active"},
  {path: "#curve-inactive"},
  {
    duration: 700,
    easing: 'easingCubicInOut'
  }
)


let curve = document.getElementById("navbar");
let navbar_content = document.getElementById("navbar_content");


curve.addEventListener(
  "mouseenter",
  (event) => {
    enlarge.start()
  })
  

curve.addEventListener(
  "mouseleave",
  (event) => {
    reduce.start()
})

//Code pour supprimer les ancres des urls  
function scrollToTargetAdjusted(element){
  var headerOffset = 100;
  var elementPosition = element.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
       top: offsetPosition,
       behavior: "smooth"
  });
}


function scrollIntoStart(current) {

  // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
  // Please acknowledge use of this code by including this header.

  if(current.origin + current.pathname != self.location.href) {
    return;
  }

  (function(anchorPoint) {
    if(anchorPoint) {
      current.addEventListener("click", function(e) {
        // anchorPoint.scrollIntoView({block:"start", behavior: "smooth"});
        scrollToTargetAdjusted(anchorPoint);
        e.preventDefault();
      }, false);
    }
  })(document.querySelector(current.hash));

}

function scrollIntoCenter(current) {

  // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
  // Please acknowledge use of this code by including this header.

  if(current.origin + current.pathname != self.location.href) {
    return;
  }

  (function(anchorPoint) {
    if(anchorPoint) {
      current.addEventListener("click", function(e) {
        anchorPoint.scrollIntoView({block:"center", behavior: "smooth"});
        e.preventDefault();
      }, false);
    }
  })(document.querySelector(current.hash));

}

document.querySelectorAll("#skills_section a, #projects_section a").forEach(scrollIntoCenter)
document.querySelectorAll("nav a").forEach(scrollIntoStart)

// Fonction permettant d'acher au fur et a mesure les elements quand ils entrent dans la vue
// il faudrait peut être ajoute run comportement en cas d'actualisation en milieu de page pour ne pas generer d'effet sur les éléments au dessus
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
      if (entry.isIntersecting) {
          entry.target.classList.add("show");
      }   

      // else {
      //     entry.target.classList.remove("show")
      // }
  })
  },
  {
    // Permet de définir la limite d'intersection pour l'apparition des éléments
    rootMargin: "-30% 0% -30% 0%",
    threshold:0
  }
);

const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el))



// Script 2 pour tracer ligne svg
// let line = document.getElementById('line');
let path = document.getElementById('path');
let svg = document.getElementById("svg");

let precision = 100;

// Fonction sectionnant en section le path de la ligne
function getLengthLookup(path, precision = 100) {
  let pathLength = path.getTotalLength();
  let { x, y, width, height } = path.getBBox();

  // console.log(pathLength)

  //create pathlength lookup
  let lengthLookup = {
    x: x,
    y: y,
    width: width,
    height: height,
    pathLength: pathLength,
    state:'init',
    lastScrollPosRel:0,
    precision:precision
  };
  let lastY = 0;
  let lastLength = 0;

  // sample point to calculate Y at pathLengths
  let step = Math.floor(pathLength / precision);

  for (let i = 0; i < pathLength; i += step) {
    let pt = path.getPointAtLength(i);
    let y = +pt.y.toFixed(0);
    let yRel = Math.ceil((precision / height) * y);

    /**
     * percentage based y values were skipped
     * interpolate pathlengths in between
     */
    let diffY = Math.abs(yRel - lastY);
    if (diffY) {
      let diffL = (i - lastLength) / diffY;
      let newY = yRel - diffY;
      for (let d = 0; d < diffY; d++) {
        lengthLookup[newY] = lastLength + diffL * d;
        newY++;
      }
    }
    lengthLookup[yRel] = i;
    lastY = yRel;
    lastLength = i;
  }
  return lengthLookup;
}

let lengthLookup = getLengthLookup(path, precision);

// Initialisation de la ligne initial apreès actualisation de sorte à la tracer jusqu'à la fenetre visible
let maxHeight = document.documentElement.scrollHeight - window.innerHeight;
let windowOffset = window.pageYOffset;
let scrollPosRel = Math.floor((windowOffset * precision) / maxHeight);
let dashLength = lengthLookup[scrollPosRel];

path.setAttribute(
  "stroke-dasharray",
  `${dashLength}  ${lengthLookup.pathLength}`
);

// Si on est tout en haut de la page, on n'applique pas le bout arrondi, pour eviter qu'un pixel de debut de ligne ne depasse
if (scrollPosRel > 0) {
  path.setAttribute("stroke-linecap", "round");
}

// Action au scrolling jusqu'au bout de la ligne. Une fois arrivé au bout il n'y a plus d'action
window.addEventListener("scroll", (e) => {
 
  if (lengthLookup.state != "end") {

    lengthLookup.state = "working"
    let maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    let windowOffset = window.pageYOffset;
    let scrollPosRel = Math.floor((windowOffset * precision) / maxHeight); 

    // On faire progresser la ligne seulement si on defile vers le bas (et non vers le haut)
    if (scrollPosRel > lengthLookup.lastScrollPosRel) {

      lengthLookup.lastScrollPosRel = scrollPosRel
      
      let dashLength = lengthLookup[scrollPosRel];

      path.setAttribute(
        "stroke-dasharray",
        `${dashLength}  ${lengthLookup.pathLength}`
      );
      path.setAttribute("stroke-linecap", "round");
    }

    // Quand on est arrivé au bout de la ligne, on enleve la propriété "stroke-dasharray" pour augmenter la netteté
    if (scrollPosRel >= (lengthLookup.precision - 1)) {
      lengthLookup.state = "end"
      path.setAttribute(
        "stroke-dasharray", "none"
      );
      path.setAttribute("stroke-linecap", "round")
    }
  }
});