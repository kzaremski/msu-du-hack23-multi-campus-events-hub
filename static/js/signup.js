/*
    Signup Front End Validation
*/

/**
 * Get the TLD from an email
 * @param {String} email - Email string
 * @returns tld part of email string
 */
function extractTLD(email) {
    const tldRegex = /@[\w.-]+\.([a-zA-Z]{2,})$/;
    const match = email.match(tldRegex);
    return match && match[1] ? match[1] : null;
}

function validate(event) {
    // Get inputs
    const submitButton = document.getElementById("submit");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const passwordRepeatInput = document.getElementById("passwordrepeat");
    const termscheckboxInput = document.getElementById("termscheckbox");

    // Start valid
    let valid = true;

    // Validate email
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (validEmailRegex.test(emailInput.value.trim())) {
        if (extractTLD(emailInput.value.trim()).toLowerCase() === "edu") {
            emailInput.classList.remove("is-invalid");
        } else {
            emailInput.classList.add("is-invalid");
            valid = false;
        }
    } else {
        emailInput.classList.add("is-invalid");
        valid = false
    }

    // Password length
    if (passwordInput.value.length >= 15) passwordInput.classList.remove("is-invalid");
    else {
        passwordInput.classList.add("is-invalid");
        valid = false;
    }

    // Password match
    if (passwordInput.value === passwordRepeatInput.value) passwordRepeatInput.classList.remove("is-invalid");
    else {
        passwordRepeatInput.classList.add("is-invalid");
        valid = false;
    }

    // Terms of service
    if (termscheckboxInput.checked) termscheckboxInput.classList.remove("is-invalid");
    else {
        termscheckboxInput.classList.add("is-invalid");
        valid = false;
    }

    // Stop form
    if (!valid) {
        event.stopPropagation();
        event.preventDefault();
    }
}

// Add event listeners onload and validate the form for a first time
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("form").addEventListener("submit", validate, false);
}, false);
