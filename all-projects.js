function populateAllProjectCards(projectsData) {
	const projectsPopDiv = document.getElementById('all_projects_pop');
	if (!projectsPopDiv) return;

	projectsData.forEach(project => {
		const cardDiv = document.createElement('div');
		const archivedClass = project.display ? '' : ' project-card-archived';

		let statusBadgeClass = 'badge-completed';
		if (project.status && project.status.toLowerCase().includes('ongoing')) {
			statusBadgeClass = 'badge-ongoing';
		}

		let displayTitle = project.title;
		let isPaper = false;
		if (displayTitle.startsWith('[Paper] ')) {
			displayTitle = displayTitle.replace('[Paper] ', '');
			isPaper = true;
		}

		cardDiv.innerHTML = `
			<div class="project-card${archivedClass}">
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
	});
}

function fetchProjectsData() {
	fetch('data/projects.json')
		.then(response => response.json())
		.then(data => {
			populateAllProjectCards(data);
		})
		.catch(error => console.error('Error fetching projects data:', error));
}

fetchProjectsData();
