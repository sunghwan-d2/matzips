const cover = document.getElementById('cover');

cover.show = function (onclick) {
    this.onclick = onclick;
    this.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
    return this;
}