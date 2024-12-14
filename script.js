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

// Function to create HTML elements to display repo information
function createRepoInfoElement(data) {
  const repoElement = document.createElement('div');
  
  repoElement.innerHTML = `
    <div class="repo-header">
      <h3>${data.full_name}</h3>
      <a href="${data.html_url}" target="_blank" class="btn">Visit</a>
    </div>
    <p class="description">${data.description || 'No description available.'}</p>
    <div class="repo-stats">
      <span>
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
        <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
        </svg> 
        ${data.stargazers_count} Stars
      </span>
      <span>
        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
        <svg aria-label="forks" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
        </svg>
        ${data.forks_count} Forks
      </span>
    </div>
  `;

  return repoElement;
}

// Fetch data for each repository container
document.querySelectorAll('.repo-info-container').forEach(container => {
  const owner = container.getAttribute('data-owner');
  const repo = container.getAttribute('data-repo');
  
  // Construct the GitHub API URL
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  
  // Fetch repository data from GitHub API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch data from GitHub API');
      }
      return response.json();
    })
    .then(data => {
      // Create the repo info element and append it to the container
      const repoInfoElement = createRepoInfoElement(data);
      container.appendChild(repoInfoElement);
    })
    .catch(error => {
      console.error('Error fetching repository info:', error);
      
      // Append error message if repo data fails to load
      const errorElement = createRepoInfoElement({
        name: `${owner}/${repo}`,
        description: 'Error loading repository info. Please try again later.',
        stargazers_count: 'N/A',
        forks_count: 'N/A',
        html_url: '#'
      });
      container.appendChild(errorElement);
    });
});

// The extractStars function (JavaScript code)
async function extractStars(repoPath, elementId) {
  const url = `https://img.shields.io/github/stars/${repoPath}?style=for-the-badge&label=&color=fff&labelColor=333`;

  try {
    // Fetch the SVG content
    const response = await fetch(url);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error('Failed to fetch the SVG');
    }

    // Get the SVG text
    const svgText = await response.text();

    // Create a DOM element to parse the SVG content
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

    // Find the text element containing the stars count
    const textElement = svgDoc.querySelector('text');

    // If the text element exists, update the DOM
    if (textElement) {
      const starsCount = textElement.textContent.trim();
      const starsElement = document.getElementById(elementId);
      starsElement.textContent = starsCount; // Set the stars count in the span
    } else {
      console.log('Text element not found!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to update stars count for all links
function updateStars() {
  const links = document.querySelectorAll('.github-link'); // Get all <a> tags with class 'link-button'

  links.forEach((link, index) => {
    const href = link.href;

    // Extract the repository path from the URL (after 'github.com/')
    const repoPath = href.split('github.com/')[1];

    if (repoPath) {
      const elementId = `starsCount${index}`; // Unique ID for each stars count element
      link.querySelector('.stars-count').id = elementId; // Set unique ID on the stars count span
      extractStars(repoPath, elementId);
    } else {
      console.log('Invalid GitHub URL');
    }
  });
}

// Call updateStars when the page is loaded
window.onload = updateStars;