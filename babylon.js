// ---------------------------- INITIATION ----------------------------

let gigs_loaded = false;
let img_id = 1;
let filter_opened = false;

// INITIATION - triggered when babylon.html is loaded
function onload() {
    load_gigs();
    load_members();
    load_legend();
    reset_gig_filters();
    localStorage.removeItem(SELECTED_GIG);
    if (localStorage.getItem("language") == "eng") switch_languages();
}

// ---------------------------- FILTERS ----------------------------

// FILTERS - gig filter
function filter(){
    let gig_count = 0;
    let gigs = document.getElementsByClassName("gig");
    let gigs_arr = Array.from(gigs)
    let title_filter = document.getElementById("title").value.toLowerCase();
    let city_filter = document.getElementById("city").value.toLowerCase();    
    let acoustic_filter = document.getElementById("acoustic").checked;
    let photos_filter = document.getElementById("photos").checked;
    let since_filter = document.getElementById("since").value;
    let to_filter = document.getElementById("to").value;
    gigs_arr.forEach((gig, index) => {
        let title_continue = true;
        let city_continue = true;
        let since_continue = true;
        let to_continue = true;
        let acoustic_continue = true;
        let photos_continue = true;
        if (title_filter && !babylon.gigs[index].title.toLowerCase().includes(title_filter)) title_continue = false;
        if (city_filter && !babylon.gigs[index].place.toLowerCase().includes(city_filter)) city_continue = false;
        if (acoustic_filter && !babylon.gigs[index].acoustic) acoustic_continue = false;
        if (photos_filter && !babylon.gigs[index].gallery) photos_continue = false;
        if (since_filter && new Date(babylon.gigs[index].date) <= new Date(since_filter)) since_continue = false;
        if (to_filter && new Date(babylon.gigs[index].date) >= new Date(to_filter)) to_continue = false;
        if (title_continue && city_continue && since_continue && to_continue && acoustic_continue && photos_continue) {
            gig.style.display = "block";
            gig_count++;
        } else gig.style.display = "none";
    });    
    document.getElementById("gig_count").innerHTML = gig_count;
    toggle_scroll_bar();
}

// FILTERS - reset gig filters
function reset_gig_filters(){
    document.getElementById("title").value = null;
    document.getElementById("city").value = null;    
    document.getElementById("acoustic").checked = false;
    document.getElementById("photos").checked = false;
    document.getElementById("since").value = null;
    document.getElementById("to").value = null;
    filter();
}

// FILTERS - show/hide filter form
function toggle_filter_menu(){
    let filter_menu = document.getElementById("filters");
    let reset = document.getElementById("reset_filters");
    let open_menu = document.getElementById("open_menu");
    let close_menu = document.getElementById("close_menu");
    let show_filters = document.getElementById("show_filters");
    if (!filter_opened) {
        filter_menu.style.display = "block";
        reset.style.display = "block";
        close_menu.style.display = "block";
        open_menu.style.display = "none";
        if (language == "cz") show_filters.textContent = "Skrýt filtry";
        else if (language == "eng") show_filters.textContent = "Hide filters";
        filter_opened = true;           
        filter_menu.style.animationName = "show_filters"; 
        if (window.innerWidth < 1024) {
            filter_menu.style.animationName = "show_phone_filters"; 
            reset.style.animationName = "show_phone_filters"; 
        }        
    } else {
        filter_menu.style.animationName = "hide_filters"; 
        if (window.innerWidth < 1024) {
            filter_menu.style.animationName = "hide_phone_filters"; 
            reset.style.animationName = "hide_phone_filters"; 
        }
        setTimeout(() => {
            filter_menu.style.display = "none";
            reset.style.display = "none";
            close_menu.style.display = "none";
            open_menu.style.display = "block";
        }, 500)
        if (language == "cz") show_filters.textContent = "Zobrazit filtry";
        else if (language == "eng") show_filters.textContent = "Show filters";
         filter_opened = false;    
    }
}

// ---------------------------- GIG LIST ----------------------------

// GIG LIST - load list of all gigs
function load_gigs(){
    if (!gigs_loaded) {
        for (let i=0; i<babylon.gigs.length; i++){
            let gig_text =  get_gig_text(i);
            let new_gig = create_new_element(gig_text, gigs, "gig");
            new_gig.onmouseenter = function(){select_gig(gig_text)};
            new_gig.onclick = function(){load_gig_details(new_gig, gig_text)};
            new_gig.onmouseleave = function(){unselect_gig(gig_text)};
            load_gallery(i);
        }
        gigs_loaded = true;
        document.getElementById("gig_count").innerHTML = babylon.gigs.length;
    }
}

// GIG LIST - show gig details (onMouseEnter)
function select_gig(html_text) {
    clear_gig_details(localStorage.getItem(SELECTED_GIG)); // while listing ensure hidden gallery from previously selected gig
    const array_of_text = html_text.split(DELIMITER);
    for (let i=0; i<babylon.gigs.length; i++){
        if (html_text == get_gig_text(i)){
            document.getElementById("details_title").textContent = array_of_text[1];
            document.getElementById("details_date").textContent = array_of_text[0];
            document.getElementById("details_city").textContent = babylon.gigs[i].place;            
            if (babylon.gigs[i].acoustic) { 
                document.getElementById("details_acoustic").innerHTML = "<span class='cz'>(akusticky)</span><span class='eng'>(acoustic)</span>";
                document.getElementById("details_acoustic").style.display = "block";
            } else document.getElementById("details_acoustic").style.display = "none";
            let photographer = babylon.photographers.find(p => p.id == babylon.gigs[i].photographer);
            if (photographer) document.getElementById("details_photographer").innerHTML = "<span class='eng'>Photo by: </span><span class='cz'>Foto: </span><a " + (photographer.web ? "style='text-decoration: underline' target='_blank' href='" + photographer.web : "") + "'>"+photographer.name+"</a>";
            display_gig_gallery(i, "block");
        }
    }
    switch_languages();
    switch_languages();
}

// GIG LIST - hide gig details (onMouseLeave)
function unselect_gig(gig_text){
    clear_gig_details(gig_text);
    let selected_gig = localStorage.getItem(SELECTED_GIG);
    if (selected_gig) select_gig(selected_gig);
}

// GIG LIST - load gig details (onClick)
function load_gig_details(selected_element, gig_id){
    for (let i=0; i<babylon.gigs.length; i++)
        if (localStorage.getItem(SELECTED_GIG) == get_gig_text(i)) 
            display_gig_gallery(i, "none"); // ensure to hide gallery from previously selected gig
    let selected_gigs = document.getElementsByClassName("selected_gig");
    if (selected_gigs.length > 0) selected_gigs[0].classList.remove("selected_gig");
    selected_element.classList.add(SELECTED_GIG);
    localStorage.setItem(SELECTED_GIG, gig_id);
}

function toggle_scroll_bar(){
    let gigs = document.getElementById("gigs");
    gigs.scrollTop = gigs.scrollHeight;
    if (gigs.scrollTopMax <= 10) document.getElementById("gig_scroll").style.display = "none";
    else {
        document.getElementById("gig_scroll").style.display = "block"; 
        gigs.scrollTop = 0;
    }
}
// GIG LIST - change scroller if using mousewheel
function gigs_on_scroll(element){
    var currently_scrolled = element.scrollTop; // number of pixels that an element's content is scrolled vertically
    var element_height = element.scrollHeight - element.clientHeight; 
    var percentage_scrolled = (currently_scrolled / element_height) * 100;
    document.getElementById("gig_scroll").value = percentage_scrolled;

}
// GIG LIST - change scroll if using scroller
function gigs_scroll_controler(value){
    let gigs = document.getElementById("gigs");
    let totalHeight = gigs.scrollHeight - gigs.clientHeight;
    gigs.scrollTop = value * totalHeight / 100
}

// ---------------------------- GIG DETAILS ----------------------------


// GIG DETAILS - hide gig details
function clear_gig_details(gig_text) {
    document.getElementById("details_title").textContent = "";
    document.getElementById("details_date").textContent = "";
    document.getElementById("details_city").textContent = "";
    document.getElementById("details_acoustic").textContent = "";
    document.getElementById("details_photographer").textContent = "";
    for (let i=0; i<babylon.gigs.length; i++)
        if (gig_text == get_gig_text(i)) display_gig_gallery(i, "none");
}

// ---------------------------- GIG GALLERY ----------------------------

// GIG GALLERY - load photos for all gigs to background
function load_gallery(gig_index){
    const gig_gallery = document.getElementById("gig_gallery");
    if (babylon.gigs[gig_index].gallery) {
        for (let i=0; i<babylon.gigs[gig_index].gallery.length; i++){
            const new_img = document.createElement("img");
            new_img.src = "babylon_gigs/" + babylon.gigs[gig_index].gallery[i] + ".jpg";
            new_img.classList.add("img");
            new_img.classList.add(GIG_ID_PREFIX + gig_index);
            new_img.onclick = function(){open_img(this)};
            new_img.setAttribute("id", IMG_ID_PREFIX + img_id++);
            new_img.setAttribute("index", i+1);
            new_img.setAttribute("gallery-length", babylon.gigs[gig_index].gallery.length);
            new_img.setAttribute("loading", "lazy")
            gig_gallery.appendChild(new_img);
        }
    }
}

// GIG GALLERY - show or hide gallery of specific gig in gig details section
function display_gig_gallery(gig_index, display){
    let gallery = document.getElementsByClassName(GIG_ID_PREFIX + gig_index);
    for (let i=0; i<gallery.length; i++) gallery[i].style.display = display;
    document.getele
};

// ---------------------------- TIMELINE ----------------------------


// TIMELINE - load timeline
function load_members(){
    const members = document.getElementById("members");
    for (let i=0; i<ACTIVE_YEARS.length; i++) create_new_table_header(ACTIVE_YEARS[i]);
    for (let i=0; i<babylon.members.length; i++) create_new_table_row(babylon.members[i], members);
}

// TIMELINE - create timeline table header
function create_new_table_header(text_content){
    const new_th = document.createElement("th");
    const new_content = document.createTextNode(text_content);
    new_th.appendChild(new_content);
    document.getElementById("members_header").appendChild(new_th);
}

// TIMELINE - create timeline table row
function create_new_table_row(member_object, append_element){
    // new row
    const new_tr = document.createElement("tr");
    append_element.appendChild(new_tr);
    new_tr.classList.add("member");
    // first column
    const member_name = document.createTextNode(member_object.name);
    const first_td = document.createElement("td")
    first_td.appendChild(member_name);
    first_td.classList.add("member_name");
    new_tr.appendChild(first_td);
    // for each year
    for (let i=0; i<ACTIVE_YEARS.length; i++) {
        const new_td = document.createElement("td");    
        new_tr.appendChild(new_td);
        // for each position
        for (let j=0; j<member_object.positions.length; j++) {
            // for each month
            for (let month=1; month<=12; month++) {
                // referent date to compare
                const ref_date = new Date(ACTIVE_YEARS[i] + "-" + month + "-1");
                if (new Date(member_object.positions[j].since) <= ref_date &&
                    new Date(member_object.positions[j].to) >= ref_date) {
                        const rectangle = create_new_element("", new_td, "month");
                        rectangle.classList.add(position_to_class_name(member_object.positions[j].title));
                } else create_new_element("", new_td, "month");
            }
            new_td.appendChild(document.createElement("br"));
        }  
    }
}

// TIMELINE - load legends
function load_legend(){
    const legend = document.getElementById("legend");
    for (let i=0; i<6; i++) create_new_element("", legend, "legend_pair");
    const groups = document.getElementsByClassName("legend_pair");
    create_new_element("", groups[0], "legend_square").classList.add(position_to_class_name(SINGER));
    create_new_element(SINGER, groups[0], "legend_title").setAttribute("id", "singer");
    create_new_element("", groups[1], "legend_square").classList.add(position_to_class_name(BACKING_VOCALS));
    create_new_element(BACKING_VOCALS, groups[1], "legend_title").setAttribute("id", "backing_vocals");
    create_new_element("", groups[2], "legend_square").classList.add(position_to_class_name(LEAD_GUITAR));
    create_new_element(LEAD_GUITAR, groups[2], "legend_title").setAttribute("id", "lead_guitar");
    create_new_element("", groups[3], "legend_square").classList.add(position_to_class_name(RHYTHM_GUITAR));
    create_new_element(RHYTHM_GUITAR, groups[3], "legend_title").setAttribute("id", "rhythm_guitar");
    create_new_element("", groups[4], "legend_square").classList.add(position_to_class_name(BASS));
    create_new_element(BASS, groups[4], "legend_title").setAttribute("id", "bass");
    create_new_element("", groups[5], "legend_square").classList.add(position_to_class_name(DRUMS));
    create_new_element(DRUMS, groups[5], "legend_title").setAttribute("id", "drums");
}

// TIMELINE - convert string to class name without whitespaces
function position_to_class_name(position){
    switch (position){
        case BASS: return "bass";
        break;
        case DRUMS: return "drums";
        break;
        case LEAD_GUITAR: return "lead_guitar";
        break;
        case RHYTHM_GUITAR: return "rhythm_guitar";
        break;
        case BACKING_VOCALS: return "backing_vocals";
        break;
        case SINGER: return "singer";
        break;
        default: return "not_defined_position";
    }
}

// ---------------------------- GENERAL ----------------------------

// GENERAL - creates new html element
function create_new_element(text_content, append_element, class_name){
    const new_div = document.createElement("div");
    const new_content = document.createTextNode(text_content);
    new_div.appendChild(new_content);
    append_element.appendChild(new_div);
    new_div.classList.add(class_name);
    return new_div;
}

// GENERAL - returns gig date and title from db
function get_gig_text(i){    
    let day = new Date(babylon.gigs[i].date).getDate();
    let month = parseInt(new Date(babylon.gigs[i].date).getMonth()+1);
    const year = new Date(babylon.gigs[i].date).getFullYear();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    const gig_date = day + "." + month + "." + year; 
    return gig_date + DELIMITER + babylon.gigs[i].title;
}

// GENERAL - additional translation (main translation function is placed in another file)
function additional_translation(){
    if (language == "eng"){
        document.getElementById("title").placeholder = "   Title";
        document.getElementById("city").placeholder = "   Place";
        document.getElementById("reset_filters").value = "Reset filters";
        if (filter_opened) show_filters.textContent = "Hide filters";
        document.getElementById("drums").textContent = "Drums";
        document.getElementById("lead_guitar").textContent = "Lead Guitar";
        document.getElementById("rhythm_guitar").textContent = "Rhythm guitar";
        document.getElementById("bass").textContent = "Bass";
        document.getElementById("singer").textContent = "Singer";
        document.getElementById("backing_vocals").textContent = "Backing vocals";
        
    } else if (language == "cz"){
        document.getElementById("title").placeholder = "   Název";
        document.getElementById("city").placeholder = "   Místo";
        document.getElementById("reset_filters").value = "Resetovat filtry";
        if (filter_opened) show_filters.textContent = "Skrýt filtry";
        document.getElementById("drums").textContent = "Bicí";
        document.getElementById("lead_guitar").textContent = "Doprovodná kytara";
        document.getElementById("rhythm_guitar").textContent = "Rytmická kytara";
        document.getElementById("bass").textContent = "Baskytara";
        document.getElementById("singer").textContent = "Hlavní zpěv";
        document.getElementById("backing_vocals").textContent = "Doprovodný zpěv";
    }
}

// GENERAL - header
function onscroll(){    
    // header img effect
    let el_top_ab = $("#main_wrap").position().top;
    let win_heigh = $(window).height();
    let el_top_rel = el_top_ab - $(window).scrollTop();
    if (el_top_rel < win_heigh * 2 && el_top_rel > 0) { // paralax is visible on the screen
        let scale = 1 + (0.35 - el_top_rel / win_heigh / 3)
        $("#main_header_background").css("transform", `scale(${scale}) `)
        $("#pavel").css("transform", `scale(${scale + (0.1 - el_top_rel / win_heigh / 10)}) `)
        $("#jirka").css("transform", `scale(${scale + (0.25 - el_top_rel / win_heigh / 5)}) `)
        $("#dawe").css("transform", `scale(${scale + (0.01 - el_top_rel / win_heigh / 50)}) `)
    }   
    // header title
    console.log()
    if ($(window).scrollTop() < 100) $("#header_title").css("opacity", 1)
    else $("#header_title").css("opacity", 0);
}
