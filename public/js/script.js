document.addEventListener('DOMContentLoaded', function () {
    const images = [
        '/images/dune-vertical.jpg',
        '/images/shogun-vertical.jpg',
        '/images/bttf-vertical.webp',
        '/images/edgerunner-vertical.webp',
        '/images/marvel-vertical.jpg'
    ]

    // Get a random index
    const randomIndex = Math.floor(Math.random() * images.length)

    // Set the random image from const list above as the source for the img element
    document.getElementById('random-image').src = images[randomIndex]
})

function togglePassword(passwordFieldId) {
    const passwordField = document.getElementById(passwordFieldId);
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Show password
    } else {
        passwordField.type = "password"; // Hide password
    }
}