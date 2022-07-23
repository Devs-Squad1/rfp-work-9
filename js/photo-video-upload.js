//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
const modalVideoImageContainer = document.querySelector(".modal-video-image-container");

let videoCount = 0;
let imageCount = 0;

input.addEventListener("change", function () {
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = this.files;
    for (let i = 0; i < file.length; i++) {
        showFile(file[i]); //calling function
    };
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); //preventing from default behaviour
    dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
    dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one

    file = event.dataTransfer.files;
    for (let i = 0; i < file.length; i++) {
        showFile(file[i]); //calling function
    };
});

function createVideoElement(fileURL, fileType) {
    return (
        `<div class="vid mb-3">
            <button class="btn bg-white rounded-circle vid-btn">X</button>
            <video controls style="width: 100%;">
                <source src="${fileURL}" type="${fileType}">

                Sorry, your browser doesn't support embedded
                videos.         
            </video>
        </div>`
    );
};

function createImageElement(fileURL) {
    return (
        `<div class="vid mb-3">
            <button class="btn bg-white rounded-circle vid-btn">X</button>
            <img class="img-fluid" src="${fileURL}" alt="image">
        </div>`
    );
};

function createVideoElementWithDiv(fileURL, fileType, col) {
    return (
        `<div class="${col}">
            <div class="card h-100 vid">
                <button class="btn bg-white rounded-circle vid-btn">X</button>
                <video controls>
                    <source
                        src="${fileURL}"
                        type="${fileType}">

                    Sorry, your browser doesn't support embedded
                    videos.
                </video>
            </div>
        </div>`
    );
};

function createImageElementWithDiv(fileURL, col) {
    return (`
        <div class="${col}">
            <div class="card h-100 vid">
                <button class="btn bg-white rounded-circle vid-btn">X</button>
                <img src="${fileURL}" class="card-img-top" alt="image">
            </div>
        </div>`
    );
};

function showFile(file) {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png", "video/mp4", "video/x-m4v", "video/*"];

    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let fileTag;

            if (fileType.includes("video")) {
                videoCount++;
                fileTag = createVideoElement(fileURL, fileType);
            }

            else if (fileType.includes("image")) {
                imageCount++;
                fileTag = createImageElement(fileURL);
            };

            if (videoCount > 1) {
                alert("Only one video allowed");
                videoCount = videoCount - 1;
                return;
            }

            else if (imageCount > 9) {
                alert("Only 9 image allowed");
                imageCount = imageCount - 1;
                return;
            }

            else {
                modalVideoImageContainer.innerHTML += fileTag;
                publishImageVideo(fileType, fileReader.result);
            };
        }
        fileReader.readAsDataURL(file);
    }

    else {
        alert("This is not an Image or Video File!");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    };
};

function publishImageVideo(fileType, fileURL) {
    if (videoCount > 1) {
        alert("Only one video allowed");
        return;
    }

    else if (imageCount > 9) {
        alert("Only 9 image allowed");
        return;
    }


    const publishBtn = document.getElementById("publish-btn");
    let videoImageContainerRow = document.querySelector(".video-image-container-row");
    publishBtn.addEventListener("click", () => {
        if (videoCount > 1) {
            alert("Only one video allowed");
            return;
        }

        else if (imageCount > 9) {
            alert("Only 9 image allowed");
            return;
        }

        const imageVideoCount = document.querySelector(".video-image-container-row").childElementCount;
        // if (imageVideoCount >= 10) {
        //     alert("You can publish maximum 1 video and 9 images");
        //     return;
        // }

        if (videoImageContainerRow.children[0]) {
            if (videoImageContainerRow.children[0].className.includes("col-12")) {
                if (fileType.includes("video")) {
                    videoImageContainerRow.innerHTML += createVideoElementWithDiv(fileURL, fileType, "col-12 col-md-4");
                }

                else if (fileType.includes("image")) {
                    videoImageContainerRow.innerHTML += createImageElementWithDiv(fileURL, "col-12 col-md-4");
                };
            }

            else {
                if (fileType.includes("video")) {
                    videoImageContainerRow.innerHTML += videoImageContainerRow.innerHTML += createVideoElementWithDiv(fileURL, fileType, "col-12");
                }

                else if (fileType.includes("image")) {
                    videoImageContainerRow.innerHTML += createImageElementWithDiv(fileURL, "col-12");
                };
            };
        }

        else {
            if (fileType.includes("video")) {
                videoImageContainerRow.innerHTML += videoImageContainerRow.innerHTML += createVideoElementWithDiv(fileURL, fileType, "col-12");
            }

            else if (fileType.includes("image")) {
                videoImageContainerRow.innerHTML += createImageElementWithDiv(fileURL, "col-12");
            };
        };
        modalVideoImageContainer.innerHTML = "";
    });
}

// Delete Image Video
document.querySelector("body").addEventListener("click", (e) => {
    let element;
    let permission;

    if (e.target.innerText === "X") {
        if (e.target.parentElement.parentElement.className.includes("col")) {
            element = e.target.parentElement.parentElement;
            permission = confirm("Are you sure you want to permanently delete this file?");
            if (permission) {
                if (e.target.nextSibling.nextSibling?.className.includes("img-fluid")) {
                    imageCount = imageCount - 1;
                }

                else {
                    videoCount = videoCount - 1;
                };
                element.parentNode.removeChild(element);
                document.querySelector(".video-image-container-row").firstChild.nextElementSibling.classList.remove('col-md-4');
            };
        }

        else {
            element = e.target.parentElement;
            permission = confirm("Are you sure you want to permanently delete this file?");
            if (permission) {
                if (e.target.nextSibling.nextSibling?.className.includes("img-fluid")) {
                    imageCount = imageCount - 1;
                }

                else {
                    videoCount = videoCount - 1;
                }
                element.parentNode.removeChild(element);
            };
        };
    };
});


// Video Image Upload Button Click
document.querySelector("body").addEventListener("click", (e) => {
    if (e.target.innerText === "Browse File") {
        input.click();
    };
});

setInterval(() => {
    if (document.querySelector(".modal-video-image-container").childElementCount > 0) {
        document.getElementById("publish-btn").disabled = false;
    } else {
        document.getElementById("publish-btn").disabled = true;
    }
}, 1000);