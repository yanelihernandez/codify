async function loadHTML(filePath, targetId = null) {
    const response = await fetch(filePath);
    const text = await response.text();

    const temp = document.createElement("div");
    temp.innerHTML = text;

    const template = temp.querySelector("template");

    if (template) {
        document.body.appendChild(template);
        return template;
    }

    if (targetId) {
        document.getElementById(targetId).innerHTML = text;
    }

    return null;
}

