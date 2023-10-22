// Render all of the registration breakdown visualizations
window.addEventListener("load", () => {
    const elements = document.querySelectorAll(".progress.registered-breakdown");
    for (const element of elements) {
        const registered = JSON.parse(element.dataset.registerd);
        const breakdown = {}
        for (const email of registered) {
            const domain = email.split("@");
            if (breakdown.hasOwnProperty(domain)) breakdown[domain] = breakdown[domain] + 1;
            else breakdown[domain] = 1;
        }

        let i = 0;
        const variants = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-danger"];
        for (const [domain, count] of Object.entries(breakdown)) {
            if (i === 5) i = 0;
            element.innerHTML += `<div class="progress-bar ${variants[i]}" role="progressbar" style="width: ${(count / registered.length) * 100}%;">${domain} - ${count}</div>`
            i++;
        }
    }
});

// <div class="progress-bar bg-danger" role="progressbar" style="width: 20%;"></div>
