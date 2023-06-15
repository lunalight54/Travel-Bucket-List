var signedIn = false;
var userId;
var countriesVisited = [];

//should also be a log out function to clean map

function hideShow(el){
    $('.box').hide();
    $(el).show();
}

function interractWithMap(el, newEntry){
    var SelectedCountry = document.getElementById(el);
    console.log(el);

    if(SelectedCountry === null)
        return;

    if (SelectedCountry.tagName === "path") {
        if (SelectedCountry.style.fill !== "green"){
            SelectedCountry.style.fill = "green";
            if (newEntry == true){
                fetch('/country', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ country: el, userId: userId }),
                })
                    .then((response) => response.text())
                    .then((result) => {
                        console.log(result); // Country added successfully
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
        else{
            SelectedCountry.style.fill = "rgb(209, 219, 221)";
            if (newEntry == true){
                fetch('/country', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ country: el, userId: userId }),
                })
                    .then((response) => response.text())
                    .then((result) => {
                      console.log(result); // Country removed successfully
                    })
                    .catch((error) => {
                      console.error(error);
                    });
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {//on Page Loaded
    hideShow('#Home');
    $('#logoutButton').hide();
    
    document.getElementById('logoutButton').addEventListener("click", function(event) {
        alert("goodbye");
        userId = null;
        countriesVisited = [];
        signedIn = false;
        $('#logoutButton').hide();
    });

    document.querySelector("svg").addEventListener("click", function(event) {
        if (signedIn === false){
            alert("Please log in first");
            return;
        }
        
        var clickedElementId = event.target.id;
        interractWithMap(clickedElementId, true);
    });

    document.getElementById('postSubmission').addEventListener('submit', function(event){
        event.preventDefault();

        var title = document.getElementById('title').value;
        var country = document.getElementById('country').value;
        var image = document.getElementById('image').value;
        var comment = document.getElementById('comment').value;

        //console.log( "title: " + title + ", country: " + country + ", image: " + image + ", comment: " + comment);

        if (signedIn == true){
            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: title, country: country, image: image, comment: comment, userId: userId}),
            })
                .then((response) => response.text())
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        else{
            alert("Please sign in first");
        }
    })

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
      
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        var params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        var url = '/login?' + params.toString();

        fetch(url)
        .then((response => response.json()))
        .then((result) => {
            if (result !== null) {
                console.log('Login successful');
                signedIn = true;
                userId = result.id.toString();
                
                countriesVisited = result.countries.map(country => country.name);
                countriesVisited.forEach(element => {
                    interractWithMap(element, false);
                });
                hideShow('#Home');
                $('#logoutButton').show();
            } else {
                console.log('Invalid credentials');
            }
        })
        .catch((error) => {
        console.error('An error occurred:', error);
        });
    });

    $('#List').hover(function(e) {
        e.preventDefault();
        $('.dropdownMenu').toggle();
    });

    var navLinks = document.getElementsByClassName("navLink");
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function(event) {
            var link = this.getAttribute("href");
            hideShow(link);
        });
    }
});
