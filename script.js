"use strict"; // uses strict globally

// DOMcontentLoad FIRST //
document.addEventListener("DOMContentLoaded", function(){

// SLIDESHOW/CAROUSEL USING JQUERY (plugin/widget) //
    $('.carousel').slick({
            autoplay: true,
            autoplaySpeed: 3500,
            speed: 800,
            arrows: true,
            dots: true,
            fade: true,        
            cssEase: 'linear',
            pauseOnHover: false
    });

    $('.fade').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });


//________________________________________________________________________________

// CATEGORY TABS USING JQUERY //

    $(function(){
            $("#jqtabs").tabs();
    });


//________________________________________________________________________________

// EVENTS API //

    // FREE API key from Ticket Master (CHANGING LATER)
    let API_KEY = "bWBQI5FIAv50Snzxw4AFQxPs4XNFZYcM";

    // connects div IDs to tabs 
    $(function (){
        $("#eventsDiv").tabs({
            activate: function (event, ui) {
                // Connects to tab ID that is activated
                let tabId = ui.newPanel.attr("id");
                loadEvents(tabId);
            }
            });

            // Automatically load the Concerts tab
            loadEvents("concerts");
    });

    function loadEvents(topic){
        // Match each tab to a Ticketmaster segment category
        let categoryMatch = {
            concerts: "Music",
            sports: "Sports",
            activities: "Comedy"
        };

            // Get the Ticketmaster segment listings
            let listings = categoryMatch[topic];

            // Fetch events from Ticketmaster using API key and by classificationName in URL
            fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=Boston&classificationName=${listings}&city=Boston&size=3`)
                .then(response => response.json())
                .then(data =>{
                // Choose which tab to put events inside of based on category/topic
                    let eventTab = $("#" + topic).find(".events_gridLayout");;
                    eventTab.empty();

                // Pull Ticketmaster event results and store in events object
                let events = data._embedded.events;

                // Loop through each event to display 
                events.forEach(event => {
                // Pull image from API event
                    let image = event.images[0]?.url; 
                // Add the event listing HTML to the page
                    eventTab.append( 
                        `<div class="event_info">
                            <img src="${image}" alt="${event.name}" class="event_img"/>
                            <h3>${event.name}</h3>
                            <p>${event.dates.start.localDate}</p>
                            <a href="${event.url}" target="_blank">Buy Tickets Here</a>
                        </div>`
                        );
                    });
                })       
    }
//________________________________________________________________________________

 // WEB STORAGE //

    // assigns new object for loading already saved list items
    let planList = loadList();

    // clicks event listener to add plan idea to list
    document.getElementById("add_btn").addEventListener("click", addToList);

        // adds ideas to plan list function
        function addToList(){
            let input_box = document.getElementById("plan_input");
            let user_input = input_box.value;

            if (user_input.length > 0) {
                showList(user_input);               
                planList.push(user_input);
                saveList(planList);
            }

            // allows background color on ordered list
            document.getElementById("planner_list").classList.add("has_items");

        // clears input box after clicking add to list
        input_box.value = ""; 
        }

        // adds the plan idea in the ordered list via innerHTML
        function showList(item){
            let trip_list = document.getElementById("planner_list");
            trip_list.innerHTML += `<li>${item}</li>`;
        }

        // LOAD list from local storage
        function loadList(){
            let stored = localStorage.getItem("trip_list");
            if (!stored) return [];

            let list_array = stored.split(",");
            list_array.forEach(i => showList(i));
            return list_array;
        }

        // SAVE list to local storage, show saved items on reload of page
        function saveList(planList){
            localStorage.setItem("trip_list", planList.join(","));
        }

        // click event listener for clear button
        document.getElementById("clear_btn").addEventListener("click", clearList);

        // Clear list function
        function clearList(){
        planList = []; 
        // remove from the local storage
        localStorage.removeItem("planner_list"); 
        // clear list from the page
        document.getElementById("planner_list").innerHTML = "";

        // remove background color on ordered list
        document.getElementById("planner_list").classList.remove("has_items");
        } 
        
        // adds and removes background color to list items
        if(planList.length > 0){
            document.getElementById("planner_list").classList.add("has_items");
        } 
        else{
            document.getElementById("planner_list").classList.remove("has_items");
        }
});