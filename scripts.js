// Function to populate the project cards in the 'projects_pop' div
function populateProjectCards(projectsData) {
    const projectsPopDiv = document.getElementById('projects_pop');

    projectsData.forEach(project => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('col-lg-4', 'col-md-6', 'col-sm-12');
      cardDiv.innerHTML = `
        <div class="card border-0 shadow mb-4">
          <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <p class="card-text">${project.description}</p>
            <a href="${project.link}" class="btn btn-primary" target="_blank">View Project</a>
            <div class="mx-4 badge rounded-pill bg-success">${project.status}</div>
          </div>
        </div>
      `;
      projectsPopDiv.appendChild(cardDiv);
    });
  }


// Function to populate the cards in the 'blogs_pop' div
function populateBlogCards(blogsData) {
	const blogsPopDiv = document.getElementById('blogs_pop');

	blogsData.forEach(blog => {
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


function fetchBlogsData() {
	fetch('data/blogs.json')
		.then(response => response.json())
		.then(data => {
			// Call the function to populate the cards with the fetched data
			populateBlogCards(data);
		})
		.catch(error => console.error('Error fetching blogs data:', error));
}
fetchBlogsData();
