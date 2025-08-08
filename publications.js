// Global variables to store loaded data
let publicationsData = null;
let authorsData = null;

// Function to load both publications and authors data
async function loadData() {
  try {
    // Load publications data
    const publicationsResponse = await fetch('static/publications.json');
    publicationsData = await publicationsResponse.json();
    
    // Load authors data
    const authorsResponse = await fetch('static/authors.json');
    authorsData = await authorsResponse.json();
    
    // Populate publications
    populatePublications();
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Function to get author name by ID
function getAuthorName(authorId) {
  const author = authorsData.authors.find(a => a.id === authorId);
  return author ? author.name : authorId; // Fallback to ID if author not found
}

// Function to get author info by ID
function getAuthorInfo(authorId) {
  return authorsData.authors.find(a => a.id === authorId) || null;
}

// Function to format authors string with proper ordering and asterisks
function formatAuthorsString(authorIds, equalContribution = []) {
  if (!authorIds || !Array.isArray(authorIds)) {
    return '';
  }
  
  // Map author IDs to names with webpage links
  const authorElements = authorIds.map((id, index) => {
    const author = getAuthorInfo(id);
    const name = author ? author.name : id;
    let displayName = name;
    if (author.is_primary) {
      displayName = `<b>${name}</b>`;
    }
    
    // Add asterisk for equal contribution
    if (equalContribution.includes(id)) {
      displayName += '*';
    }
    
    // Add webpage link if available
    if (author && author.webpage) {
      return `<a href="${author.webpage}" target="_blank" class="author-link">${displayName}</a>`;
    }
    
    return displayName;
  });
  
  return authorElements.join(', ');
}

// Function to populate publications
function populatePublications() {
  const publicationList = document.querySelector('.publication-list');
  if (!publicationList) {
    console.error('Publication list element not found');
    return;
  }
  
  // Clear existing content
  publicationList.innerHTML = '';
  
  // Populate with publications from JSON
  publicationsData.publications.forEach(publication => {
    const publicationItem = createPublicationElement(publication);
    publicationList.appendChild(publicationItem);
  });
  
  // Re-initialize any existing scripts that might depend on the publications
  if (typeof updateStars === 'function') {
    updateStars();
  }
}

// Function to create a publication element
function createPublicationElement(publication) {
  const li = document.createElement('li');
  li.className = 'publication-item';
  
  const publicationContent = document.createElement('div');
  publicationContent.className = 'publication-content';
  
  // Add thumbnail if it exists
  if (publication.thumbnail) {
    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.className = 'publication-thumbnail';
    
    const img = document.createElement('img');
    img.src = publication.thumbnail;
    img.alt = 'Publication Figure';
    img.className = 'pull-figure';
    
    thumbnailDiv.appendChild(img);
    publicationContent.appendChild(thumbnailDiv);
  }
  
  // Create publication details
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'publication-details';
  
  // Title
  const title = document.createElement('h3');
  title.className = 'publication-title';
  title.textContent = publication.title;
  detailsDiv.appendChild(title);
  
  // Publication info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'publication-info';
  
  // Authors (with bold formatting for Ali Garjani and webpage links)
  const authors = document.createElement('p');
  authors.className = 'publication-authors';
  const authorsString = formatAuthorsString(publication.author_ids, publication.equal_contribution || []);
  
  // Apply bold formatting for Ali Garjani (handling both linked and non-linked versions)
  const boldFormattedString = authorsString
    .replace(/(<a[^>]*>)(Ali Garjani[^<]*)(<\/a>)/g, '$1<b>$2</b>$3')
    .replace(/(?<!<[^>]*>)(Ali Garjani[^*]*\*?)(?!<\/[^>]*>)/g, '<b>$1</b>');
  
  authors.innerHTML = authorsString;
  infoDiv.appendChild(authors);
  
  // Conference
  const conference = document.createElement('p');
  conference.className = 'publication-conference';
  conference.innerHTML = `<i>${publication.conference}</i>`;
  infoDiv.appendChild(conference);
  
  // Links
  const linksDiv = document.createElement('p');
  linksDiv.className = 'publication-links';
  
  publication.links.forEach(link => {
    const linkButton = document.createElement('a');
    linkButton.href = link.url;
    linkButton.className = 'link-button';
    if (link.isGithub) {
      linkButton.classList.add('github-link');
    }
    
    const linkIcon = document.createElement('span');
    linkIcon.className = 'link-icon';
    
    // Handle different icon types
    if (link.icon.startsWith('fa') || link.icon.startsWith('fab') || link.icon.startsWith('ai')) {
      const icon = document.createElement('i');
      icon.className = link.icon;
      linkIcon.appendChild(icon);
    } else {
      // For emoji icons like 🤗
      linkIcon.textContent = link.icon;
    }
    
    const linkText = document.createElement('span');
    linkText.textContent = link.text;
    
    linkButton.appendChild(linkIcon);
    linkButton.appendChild(linkText);
    
    // Add star span for GitHub links
    if (link.isGithub) {
      const starSpan = document.createElement('span');
      starSpan.className = 'star-span';
      
      const starIcon = document.createElement('i');
      starIcon.className = 'fa-regular fa-star';
      
      const starsCount = document.createElement('span');
      starsCount.className = 'stars-count';
      starsCount.textContent = 'Loading...';
      
      starSpan.appendChild(starIcon);
      starSpan.appendChild(starsCount);
      linkButton.appendChild(starSpan);
    }
    
    linksDiv.appendChild(linkButton);
  });
  
  infoDiv.appendChild(linksDiv);
  detailsDiv.appendChild(infoDiv);
  publicationContent.appendChild(detailsDiv);
  li.appendChild(publicationContent);
  
  return li;
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', loadData);

// Legacy function for backward compatibility
async function loadPublications() {
  await loadData();
}
