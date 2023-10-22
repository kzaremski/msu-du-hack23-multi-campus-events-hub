window.addEventListener("load", () => {
    const box = document.getElementById("sharelink");
    box.value = window.location.href;
    box.addEventListener("click", () => {
        this.setSelectionRange(0, this.value.length)
    });
});
