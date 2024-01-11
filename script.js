const pathname = new URL(location.href).pathname.replace(/[^/]+$/, "");

function populateFileList(files, directory, isTest) {
  const ulElement = document.querySelector("#file-list");

  files.forEach(({ filename, size }) => {
    const li = document.createElement("li");
    li.classList.add("file");

    const a = document.createElement("a");
    a.className = "hover:underline bg-white bg-opacity-75 rounded px-2";
    a.href = `#file=${directory}/${filename}`;
    a.textContent = (isTest ? "**" : "") + fileTitle(filename);

    li.appendChild(a);
    ulElement.appendChild(li);
  });
}

function fileTitle(filename) {
  filename = filename.replace(/^ian\d+_/, "");
  filename = filename.replace(/\.(png|jpg|webp)$/, "");
  filename = filename.replace(/[0-9a-f-]+$/, "");
  filename = filename.replace(/_/g, " ");
  return filename;
}

function updateBackgroundImage() {
  const bgImageDiv = document.getElementById("bgimage");
  let hash = window.location.hash.substring(1); // Remove the '#' character
  if (hash.startsWith(pathname)) {
    hash = hash.substring(pathname.length);
  }
  if (hash.startsWith("file=")) {
    hash = hash.substring(5);
  }
  if (hash) {
    bgImageDiv.style.backgroundImage = `url('${hash}')`;
  }
}

// Event listener for hash change
window.addEventListener("hashchange", updateBackgroundImage);

// Call the function on initial load in case there's already a hash in the URL
updateBackgroundImage();

// Assuming window.files is already defined
if (window.files) {
  populateFileList(window.files.test, "test", true);
  populateFileList(window.files.images, "images", false);
}

function updateHashToAdjacentLink(isNext) {
  const links = document.querySelectorAll("#file-list li a");
  const currentHash = window.location.hash;
  let found = false;

  for (let i = 0; i < links.length; i++) {
    const u = new URL(links[i].href);
    if (u.hash === currentHash) {
      found = true;
      const targetIndex = isNext ? i + 1 : i - 1;

      if (targetIndex >= 0 && targetIndex < links.length) {
        window.location.hash = links[targetIndex].getAttribute("href");
      }
      break;
    }
  }

  // If no match was found and `isNext` is true, go to the first link
  if (!found && isNext && links.length > 0) {
    window.location.hash = links[0].getAttribute("href");
  }
  // If no match was found and `isNext` is false, go to the last link
  else if (!found && !isNext && links.length > 0) {
    window.location.hash = links[links.length - 1].getAttribute("href");
  }
}

window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    updateHashToAdjacentLink(true);
  } else if (event.key === "ArrowLeft") {
    updateHashToAdjacentLink(false);
  }
});
