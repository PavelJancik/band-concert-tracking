// ----------------------------- INIT -----------------------------

function onload() {
         
}

// ---------------------------- GALLERY ----------------------------

let currently_opened_img = null;

// GALLERY - open img preview
function open_img(img){
    // image
    let opened_img = document.getElementById("opened_img");
    let opened_img_background = document.getElementById("opened_img_background");    
    opened_img.src = img.src;
    opened_img.style.border = "2px solid #555";
    opened_img.style.display = "block";
    opened_img_background.style.display = "block";
    currently_opened_img = img;
    // cross
    let cross = document.getElementById("cross");   
    cross.style.display = "block";
    // numbering
    let numbering = document.getElementById("numbering");
    numbering.style.display = "block";
    numbering.innerText = img.getAttribute("index") +  " / " + img.getAttribute("gallery-length");
    // previous button
    let previous_img_btn = document.getElementById("previous_img");  
    // let prev_img_id = IMG_ID_PREFIX + parseInt(+img.id.split("_").pop() - 1);
    if (img.getAttribute("index") > 1) {
        previous_img_btn.style.display = "block";
        // previous_img_btn.style.background = "url(" + document.getElementById(prev_img_id).src + ")"; 
    }
    else previous_img_btn.style.display = "none";
    // next button
    let next_img_btn = document.getElementById("next_img"); 
    // let next_img_id = IMG_ID_PREFIX + parseInt(+img.id.split("_").pop() + +1);
    if (img.getAttribute("index") < img.getAttribute("gallery-length")) {
        next_img_btn.style.display = "block";
        // next_img_btn.style.background = "url(" + document.getElementById(next_img_id).src + ")"; 
    }
    else next_img_btn.style.display = "none";  
}

// GALLERY - close img preview
function close_img() {
    let next_img = document.getElementById("next_img");   
    let previous_img = document.getElementById("previous_img");   
    opened_img.style.display = "none";
    opened_img_background.style.display = "none";
    cross.style.display = "none";
    numbering.style.display = "none"; 
    next_img.style.display = "none";
    previous_img.style.display = "none";
    currently_opened_img = null;
}

function next_img() {  
    change_img(+1);
}

function previous_img(){
    change_img(-1);
}

// GALLERY - arrow keyboard control
function keyPressed(event) {
    let keyCode = event.which;
    // console.log("key pressed: " + keyCode);
    if (keyCode == 37) previous_img();
    if (keyCode == 39) next_img();
}

// GALLERY - change img
function change_img (direction){
    if (currently_opened_img){
        const current_img_id = (currently_opened_img.id).split("_")[2];
        const current_img_element = document.getElementById(IMG_ID_PREFIX + current_img_id);
        const current_img_gig_id = current_img_element.classList[1];
        const next_img_id = +current_img_id + +direction;
        const next_img_element = document.getElementById(IMG_ID_PREFIX + next_img_id);
        const next_img_gig_id = next_img_element.classList[1];
        if (current_img_gig_id == next_img_gig_id) {
            close_img();
            open_img(next_img_element);
        }
    }
}

// ---------------------------- TRANSLATION ----------------------------

let language = "cz";

function switch_languages(){
    var cz = document.getElementsByClassName("cz");
    var eng = document.getElementsByClassName("eng");
    if (language == "cz") {
        language = "eng";
        document.getElementById("cz").style.fontWeight = "normal";
        document.getElementById("eng").style.fontWeight = "bold";
        for (let i=0; i<cz.length; i++) cz[i].style.display = "none";
        for (let i=0; i<eng.length; i++) eng[i].style.display = "inline";
    } else if (language == "eng") {
        language = "cz";
        document.getElementById("cz").style.fontWeight = "bold";
        document.getElementById("eng").style.fontWeight = "normal";
        for (let i=0; i<cz.length; i++) cz[i].style.display = "inline";
        for (let i=0; i<eng.length; i++) eng[i].style.display = "none";
    }  
    localStorage.setItem("language", language);
    additional_translation(); 
}
function additional_translation(){} // function to be defined in other file
