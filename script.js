// script.js

// Typing effect for the title
const titleElement = document.querySelector('.title');
const text = 'Ali Garjani';
let index = -1;

function type() {
  if (index === -1) {
    titleElement.textContent = '';
  } else {
   titleElement.textContent += text[index];
  }
  index++;
  if (index === text.length) {
    titleElement.classList.remove('typing');
    return;
  }
  setTimeout(type, 100);
}

// Trigger the typing effect when the page is loaded
window.addEventListener('load', () => {
  titleElement.classList.add('typing');
  type();
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdownBtns = document.querySelectorAll(".dropdown-btn");

  dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const dropdown = btn.parentElement;
      dropdown.classList.toggle("active");
    });
  });
});

