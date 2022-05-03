import "../css/base.css";
import axios from "axios";
import copy from "copy-to-clipboard";

const root = document.querySelector(":root");
const navToggler = document.querySelector(".nav-toggler");
const navMobile = document.querySelector(".nav-mobile");
const getStartedBtn = document.querySelector(".get-started");
const linksContainer = document.querySelector(".links-container");
const shortenForm = document.querySelector(".shorten-form");
const errorMsg = document.querySelector(".error-msg");
const input = shortenForm[0];

let loading = false;
let formHeight = 172;
let containerHeight = 90;
let shortenedLinks = [];
let copiedTimeoutId = null;

const copyToClipboard = (e) => {
  copiedTimeoutId && clearTimeout(copiedTimeoutId);
  const copied = document.querySelector(".copied");
  if (copied) {
    copied.classList.remove("copied");
    copied.innerText = "Copy";
  }

  const text = e.target.parentElement.children[0].innerText;
  copy(text);

  e.target.innerText = "Copied!";
  e.target.classList.add("copied");
  copiedTimeoutId = setTimeout(() => {
    e.target.innerText = "Copy";
    e.target.classList.remove("copied");
  }, 2000);
};

const createContainer = (link, shortened) => {
  const container = document.createElement("div");
  container.classList.add("link-container");
  container.innerHTML = `
        <span class="w-full relative text-base text-left px-4 sm:px-6 mb-5 sm:mb-0">${
          link.length > 28 ? link.slice(0, 26) + "..." : link
        }</span>
        <div class="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center
        px-4 sm:px-6">
            <span class="text-base text-primaryCyan mr-2 mb-2.5 sm:mb-0">
            ${shortened}
            </span>
            <button class="btn btn-primary w-full sm:w-fit min-w-[125px] !min-h-[45px]
            rounded-lg">Copy</button>
        </div>`;
  return container;
};

const setSectionPadding = () => {
  root.style.setProperty(
    "--section-padding",
    `${shortenedLinks.length * containerHeight + formHeight / 2 + 24}px`
  );
};

const setFormHeight = () => {
  formHeight = shortenForm.clientHeight;
  containerHeight = window.innerWidth >= 640 ? 90 : 170;
  setSectionPadding();
};

const addLink = (link, shortened) => {
  if (shortenedLinks.length >= 3) shortenedLinks = shortenedLinks.splice(0, 2);
  shortenedLinks.unshift([link, shortened]);
  localStorage.setItem("shortened-links", JSON.stringify(shortenedLinks));
};

const getAPILink = (link) =>
  `https://api.shrtco.de/v2/shorten?url=${link.trim()}`;

const stopLoading = () => {
  loading = false;
  shortenForm[1].classList.remove("loading");
  shortenForm[1].innerText = "Shorten It!";
};

const addError = (msg) => {
  stopLoading();

  input.blur();
  errorMsg.innerText = msg;
  input.classList.add("error");
};

navToggler.addEventListener("click", () => {
  navMobile.classList.toggle("invisible");
});

getStartedBtn.addEventListener("click", () => {
  const { top } = shortenForm.getBoundingClientRect();
  window.scrollTo({ top: top - 50 + window.pageYOffset, behavior: "smooth" });
});

input.addEventListener("focus", () => {
  input.classList.remove("error");
});

shortenForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!loading) {
    shortenForm[1].classList.add("loading");
    shortenForm[1].innerText = "Loading...";
    input.classList.remove("error");

    const inputLink = input.value.trim();
    if (inputLink.length >= 1) {
      loading = true;
      axios({
        method: "post",
        url: getAPILink(inputLink),
        timeout: 25000,
        timeoutMessage: "Network Error",
      })
        .then((res) => {
          input.value = "";
          stopLoading();

          const shortened = res.data.result.short_link;
          addLink(inputLink, shortened);
          setSectionPadding();

          const newLinkContainer = createContainer(inputLink, shortened);
          const lastLinkContainer = document.querySelector(
            ".links-container .link-container:nth-child(3)"
          );
          shortenedLinks.length >= 3 &&
            lastLinkContainer &&
            linksContainer.removeChild(lastLinkContainer);
          linksContainer.prepend(newLinkContainer);
          document
            .querySelectorAll(".link-container button")
            .forEach((b) => b.addEventListener("click", copyToClipboard));
        })
        .catch((err) => {
          const error =
            (err?.response?.data && err?.response?.status === 400
              ? "Please enter a valid URL"
              : err?.response?.data?.message) || err.message;
          addError(error);
        });
    } else {
      addError("URL field cannot be empty");
    }
  }
});

window.addEventListener("resize", setFormHeight);
window.addEventListener("load", () => {
  setFormHeight();

  const links = localStorage.getItem("shortened-links");
  links &&
    JSON.parse(links)
      .map(([link, shortened]) => {
        shortenedLinks.push([link, shortened]);
        return createContainer(link, shortened);
      })
      .map((c) => {
        linksContainer.appendChild(c);
        document
          .querySelectorAll(".link-container button")
          .forEach((b) => b.addEventListener("click", copyToClipboard));
        setFormHeight();
      });
});
