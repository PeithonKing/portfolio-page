// Function to populate the project cards in the 'projects_pop' div
function populateProjectCards(projectsData) {
	const projectsPopDiv = document.getElementById('projects_pop');

	projectsData.forEach(project => {
		if (project.display) {
			const cardDiv = document.createElement('div');
			db = "";
			ds = "";
			dd = "";
			dl = "";
			if (project.link == "") {db = `style="display: none;"`;}
			if (project.status != "") {ds = `<b>Status:</b> ${project.status}<br>`;}
			if (project.date != "") {dd = `<b>Date:</b> ${project.date}<br>`;}
			if (project.location != "") {dl = `<b>Location:</b> ${project.location}<br>`;}
			cardDiv.classList.add('col');
			cardDiv.innerHTML = `
				<div class="card h-100">
					<div class="card-body">
					<h5 class="card-title">${project.title}</h5>
					<div class="card-text">
						<small class="text-muted">${project.professor}<br>${ds}${dd}${dl}</small>
					</div>
					<p class="card-text" style="text-align: justify">&emsp;${project.description}</p>
					<a href="${project.link}" class="btn btn-primary" target="_blank" ${db}>View More</a>
					</div>
				</div>
				`;
			projectsPopDiv.appendChild(cardDiv);
		}
	});
}


// Function to populate the cards in the 'blogs_pop' div
function populateBlogCards(blogsData) {
	const blogsPopDiv = document.getElementById('blogs_pop');

	blogsData.forEach(blog => {
		if (blog.display) {
			const cardDiv = document.createElement('div');
			cardDiv.classList.add('col-lg-4', 'col-md-6', 'col-sm-12', 'my-2');
			cardDiv.innerHTML = `
					<div class="card border-0 shadow mb-4 h-100">
						<img src="${blog.image}" class="card-img-top" alt="${blog.alt_text}">
						<div class="card-body">
							<h5 class="card-title">${blog.full_title}</h5>
							<p class="card-text">${blog.description}</p>
							<a href="${blog.link}" class="btn btn-primary">Go To ${blog.link_text} Page</a>
						</div>
					</div>
				`;
			blogsPopDiv.appendChild(cardDiv);
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

        // Call the function to populate the cards with the merged data
        populateBlogCards(mergedData);
    } catch (error) {
        console.error('Error fetching or processing blogs data:', error);
    }
}

// Call function
fetchBlogsData();

