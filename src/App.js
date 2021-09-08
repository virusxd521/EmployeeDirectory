const main = document.querySelector(".main");
const body = document.querySelector("body");

// The URL for the users API
const Api_url = 'https://randomuser.me/api/?results=12&nat=us'

// Function for handling errors regarding the API
function handleErrors(response){
    if(!response.ok){
        throw Error(response.statusText);
    }
    return response.json();
}

// Fetching the users data function
const fetch_the_users = (url, handleErrors) => {
    return fetch(url)
    .then(handleErrors)
    .then(data => {
        return data.results
    })
    .catch(error => console.log(error));
}

// function for creating elements and assigning them with classes
const element_class_creation = (element, className, data="") => {
    const created_element = document.createElement(element);
    created_element.classList.add(className);
    if(element === "img") {
        created_element.src = data;
    } else {
        created_element.innerHTML = data;
    }

    return created_element;
}

// function fot attaching elements to the box overlay
const elements_easy_attachments = (father_attach, ...args) => {
    args.forEach(arg => father_attach.appendChild(arg));
}

// function for implementing the HTML elements
const elements = user => {
    const div_box = document.createElement('div');
    const div_inside_box = document.createElement('div');
    div_inside_box.classList.add("div-inside")

    const user_name = element_class_creation('p','user-name', `${user.name.first} ${user.name.last}`);

    const user_email = document.createElement('p');
    user_email.innerHTML = user.email;

    const user_address = document.createElement('p');
    user_address.innerHTML = user.location.state;

    const user_img = element_class_creation('img', 'img-box', user.picture.large);

    elements_easy_attachments(div_inside_box, user_name, user_email, user_address);
    elements_easy_attachments(div_box, user_img, div_inside_box);
    div_box.classList.add('box');
    main.appendChild(div_box);
    overlay(div_box, user);
}

// function for creating the boxes and adding all the data
// to that boxes
const box_creation = async (users_data) => {
    const user_data = await users_data(Api_url, handleErrors);
    user_data.forEach(user => {
        elements(user)
    })    
}

// function for removing the overlay box
const removing_all_overlay = (element_to_click, element_to_remove) => {
    element_to_click.addEventListener("click", event => {
        body.removeChild(element_to_remove);
    })
}

// overlay function
const overlay = (div_box, user) => {
    div_box.addEventListener("click", event => {
        // extrarcting only the date from dob attribute
        const regex = /\d+[-]\d+[-]\d+/;
        const date_before_regex =  user.dob.date;
        const birthdaty_of_user = date_before_regex.match(regex);
        console.log(birthdaty_of_user);

        const overlay_div = element_class_creation("div","body-overlay");
        const div_box_overlay = element_class_creation("div","div_overlay_box");
        // X button image
        console.log(user);
        const image_remove_box = element_class_creation('img', 'remove-image', './remove.png');
        const img_overlay = element_class_creation('img', 'profile-overlay', user.picture.large);
        const name_overlay = element_class_creation('p', 'username-overlay', `${user.name.first} ${user.name.last}`);
        const email_overlay = element_class_creation('p', 'all-other-info-overlay', user.email);
        const location_overlay = element_class_creation('p', 'all-other-info-overlay', user.location.country);
        const overlay_box_hr = element_class_creation('hr', 'hr-overlay');
        const number_overlay = element_class_creation('p','all-other-info-overlay', user.phone);
        const fullAddress_overlay = element_class_creation('p', 'all-other-info-overlay', `${user.location.street.number} ${user.location.street.name}, ${user.location.state} ${user.location.postcode}`)
        const birthDay_overlay = element_class_creation('p', 'all-other-info-overlay', `Birthday: ${birthdaty_of_user}`);
        // Appending childrens to the box on the overlay
        elements_easy_attachments(div_box_overlay, image_remove_box, img_overlay, name_overlay, email_overlay, location_overlay, overlay_box_hr, number_overlay, fullAddress_overlay, birthDay_overlay);
        overlay_div.appendChild(div_box_overlay);
        body.appendChild(overlay_div);
        removing_all_overlay(image_remove_box, overlay_div);
    })
}

box_creation(fetch_the_users);

