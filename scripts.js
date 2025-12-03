// Function to populate the project cards in the 'projects_pop' div
function populateProjectCards(projectsData) {
	const projectsPopDiv = document.getElementById('projects_pop');

	projectsData.forEach(project => {
		if (project.display) {
			const cardDiv = document.createElement('div');

			// Determine badge class based on status
			let statusBadgeClass = 'badge-completed';
			if (project.status && project.status.toLowerCase().includes('ongoing')) {
				statusBadgeClass = 'badge-ongoing';
			}

			// Check for [Paper] prefix
			let displayTitle = project.title;
			let isPaper = false;
			if (displayTitle.startsWith('[Paper] ')) {
				displayTitle = displayTitle.replace('[Paper] ', '');
				isPaper = true;
			}

			// Clean up professor/co-author text (remove HTML tags if needed for cleaner look, or keep as is)
			// For this design, we'll keep the HTML but ensure it fits the meta-info style

			cardDiv.innerHTML = `
				<div class="project-card">
					<div class="card-header">
						<h3 class="card-title">${displayTitle}</h3>
						<div class="badges">
							${isPaper ? `<span class="badge badge-paper">Paper</span>` : ''}
							${project.status ? `<span class="badge ${statusBadgeClass}">${project.status}</span>` : ''}
							${project.date ? `<span class="badge badge-date">${project.date}</span>` : ''}
						</div>
					</div>
					<div class="card-body">
						${project.description}
					</div>
					<div class="card-footer">
						<div class="meta-info">
							${project.location ? `<div class="meta-item"><i class="bi bi-geo-alt-fill" style="color: #ef4444;"></i> ${project.location}</div>` : ''}
							${project.professor ? `
								<div class="meta-item">
									<i class="bi bi-people-fill" style="color: #3b82f6;"></i>
									<span class="meta-text">${project.professor}</span>
									<div class="meta-tooltip">${project.professor}</div>
								</div>` : ''}
						</div>
						<a href="${project.link}" target="_blank" class="btn-view">More</a>
					</div>
				</div>
				`;
			projectsPopDiv.appendChild(cardDiv);
		}
	});
}

// After cards are created, attach this event listener to the container or each card:
document.getElementById('projects_pop').addEventListener('click', function (event) {
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
			// No 'col-*' classes needed as parent is grid

			blogCol.innerHTML = `
				<a href="${blog.link}" target="_blank" class="blog-card" style="display: block; text-decoration: none;">
					<img src="${blog.image}" alt="${blog.alt_text}" class="blog-card-img" loading="lazy" decoding="async">
					<div class="blog-card-overlay">
						<div class="blog-card-title">${blog.full_title}</div>
					</div>
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

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
	const navbar = document.querySelector('.navbar');
	if (window.scrollY > 50) {
		navbar.classList.add('scrolled');
	} else {
		navbar.classList.remove('scrolled');
	}
});

