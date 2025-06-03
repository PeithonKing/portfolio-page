// Function to populate the project cards in the 'projects_pop' div
function populateProjectCards(projectsData) {
	const projectsPopDiv = document.getElementById('projects_pop');

	projectsData.forEach(project => {
		if (project.display) {
			const cardDiv = document.createElement('div');
			ds = "";
			dd = "";
			dl = "";
			if (project.status != "") {ds = `<b>Status:</b> ${project.status}<br>`;}
			if (project.date != "") {dd = `<b>Date:</b> ${project.date}<br>`;}
			if (project.location != "") {dl = `<b>Location:</b> ${project.location}<br>`;}
			cardDiv.classList.add('col');
			cardDiv.innerHTML = `
				<div class="card h-100 project_hover" data-link="${project.link}" style="cursor: pointer;">
					<div class="card-body">
					<h5 class="card-title">${project.title}</h5>
					<div class="card-text">
						<small class="text-muted">${project.professor}<br>${ds}${dd}${dl}</small>
					</div>
					<p class="card-text" style="text-align: justify">&emsp;${project.description}</p>
					</div>
				</div>
				`;
			projectsPopDiv.appendChild(cardDiv);
		}
	});
}

// After cards are created, attach this event listener to the container or each card:
document.getElementById('projects_pop').addEventListener('click', function(event) {
  // Find closest card element with project_hover class
  const card = event.target.closest('.project_hover');
  if (!card) return; // click outside a card

  // Check if the click is inside an <a> tag
  if (event.target.closest('a')) {
    // Click was on a link inside the card, let default happen, no action
    return;
  }

  // Otherwise open link from data-link attribute or similar
  const url = card.getAttribute('data-link');
  if (url) {
    window.open(url, '_blank', 'noopener');
  }
});




// Function to populate the blogs section with minimal tiles
function populateBlogCards(blogsData) {
	const blogsPopDiv = document.getElementById('blogs_pop');

	blogsData.forEach(blog => {
		if (blog.display) {
			const blogCol = document.createElement('div');
			blogCol.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-4');

			blogCol.innerHTML = `
				<a href="${blog.link}" target="_blank" class="blog-tile d-block position-relative overflow-hidden rounded shadow-sm">
					<img src="${blog.image}" alt="${blog.alt_text}" class="img-fluid w-100">
					<div class="blog-title px-2 py-1">${blog.full_title}</div>
				</a>
			`;

			blogsPopDiv.appendChild(blogCol);
		}
	});
}




function fetchProjectsData() {
	fetch('data/projects.json')
		.then(response => response.json())
		.then(data => {
			// Call the function to populate the project cards with the fetched data
			populateProjectCards(data);
		})
		.catch(error => console.error('Error fetching projects data:', error));
}
fetchProjectsData();


async function fetchBlogsData() {
    try {
        // Fetch JSON Data
        let jsonResponse = await fetch('data/blogs.json');
        let jsonData = await jsonResponse.json();

        // Fetch XML Data
        let xmlResponse = await fetch('https://peithonking.github.io/my_blogs/rss.xml');
        // let xmlResponse = await fetch('http://localhost:4321/my_blogs/rss.xml');
        let xmlText = await xmlResponse.text();

        // Parse XML
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Convert XML to JSON-like structure
        let items = xmlDoc.querySelectorAll("item");
        let xmlData = Array.from(items).map(item => ({
            image: item.querySelector("enclosure")?.getAttribute("url") || "images/default.png",
            full_title: item.querySelector("title")?.textContent || "No Title",
            alt_text: item.querySelector("title")?.textContent || "No Title",
            description: item.querySelector("description")?.textContent || "No Description",
            link: item.querySelector("link")?.textContent || "#",
            link_text: "Personal Blogs",
            display: true,
            date: item.querySelector("pubDate")?.textContent || "Unknown Date"
        }));

        // Merge JSON and XML data
        let mergedData = [...jsonData, ...xmlData];

		// sort them by date
		mergedData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Call the function to populate the cards with the merged data
        populateBlogCards(mergedData);
    } catch (error) {
        console.error('Error fetching or processing blogs data:', error);
    }
}

// Call function
fetchBlogsData();

