const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": "live_MZIzRw7m1KU8nxEm51Ff3OQxh0mpICgNtMhs11tkKGomBZDUUa7CXLkFKxfEvkuN",
});

const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
};

let currentPage = "1"; 

function addImages(api) {
    fetch(`https://api.the${api}api.com/v1/images/search?format=json&order=RANDOM&page=0&limit=3`, requestOptions)
    .then(response => response.json())
    .then(data => {
        data.forEach(image => {
            addImage(image.url);
        });
    });
}

function addImage(src) {
    const post = document.createElement("div");
    post.className = "element flex-column";

    const image = document.createElement("img");
    image.className = "image";
    image.src = src;

    image.onload = () => {
        const button1 = document.createElement("button");
        button1.className = "button-base secondary";
        button1.textContent = "Remove";
        button1.onclick = () => {
            post.classList.add("fuga");
            post.addEventListener("animationend", () => {
                post.remove(); 
            });
        };

        const button2 = setElementButton("button-base aaaaaa", "Like");
        button2.addEventListener("click", () => {
            window.localStorage.setItem(src, "");
            addElement_Favorites(src);
        });

        image.after(button1, button2);
    };

    post.append(image);
    document.querySelector("#main-images").append(post);
}

const addElements_Favorites = () => {
    if (document.querySelectorAll("#items-favorites > li").length === 0 && localStorage.length > 0) {
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key))
                addElement_Favorites(key);
        }
    }
};

const addElement_Favorites = url => {
    const item = document.createElement("li");

    const image = document.createElement("img");
    image.className = "image";
    image.src = url;

    const input = document.createElement("div");
    input.className = "input flex-row";

    const buttonRemove = setElementButton("button-base secondary", "Remove");
    buttonRemove.addEventListener("click", () => {
        item.classList.add("fuga");
        item.addEventListener("animationend", () => {
            item.remove();
            window.localStorage.removeItem(url);
        });
    });

    input.append(buttonRemove);
    item.append(image, input);
    item.className = "element flex-column";
    document.getElementById("items-favorites").append(item);
};

const setElementButton = (className, textContent) => {
    const btn = document.createElement("button");
    btn.className = className;
    btn.textContent = textContent;
    return btn;
};

function showPage(page) {
    document.querySelectorAll("#page1, #page2").forEach((pageElement) => {
        pageElement.style.display = "none";
    });
    document.querySelector(`#page${page}`).style.display = "block";

    const url = new URL(window.location);
    url.searchParams.set("page", page);
    window.history.pushState({ page }, "", url);

    currentPage = page;
}

window.onpopstate = (event) => {
    if (event.state && event.state.page) {
        showPage(event.state.page);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".pestaña").forEach((button) => {
        const page = button.dataset.page;
        button.onclick = () => {
            showPage(page);
        };
    });

    addImages("cat");
    addElements_Favorites();

    window.onscroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && currentPage === "1") {
            addImages("cat");
        }
    };

    const initialPage = new URLSearchParams(window.location.search).get("page") || "1";
    showPage(initialPage);
});
