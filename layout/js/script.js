let allJobs = [];
let selectedFilters = new Set(); 


fetch('data.json')
    .then(response => response.json())
    .then(data => {
        allJobs = data;
        displayJobs(allJobs); 
    })
    .catch(error => console.error('Error fetching data:', error));


function displayJobs(jobs) {
    const jobListingsContainer = document.getElementById('job-listings');
    jobListingsContainer.innerHTML = '';

    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job-listing';

        jobElement.innerHTML = `
            <img src="${job.logo}" alt="${job.company} Logo" />
            <div class="job-details">
                <div class="company">
                    ${job.company}
                    ${job.new ? '<span class="new">NEW!</span>' : ''}
                    ${job.featured ? '<span class="featured">FEATURED</span>' : ''}
                </div>
                <h2>${job.position}</h2>
                <div class="info">
                    <span>${job.postedAt}</span> •
                    <span>${job.contract}</span> •
                    <span>${job.location}</span>
                </div>
                <div class="tags">
                    <span class="tag">${job.role}</span>
                    <span class="tag">${job.level}</span>
                    ${job.languages.map(language => `<span class="tag">${language}</span>`).join('')}
                    ${job.tools.map(tool => `<span class="tag">${tool}</span>`).join('')}
                </div>
            </div>
        `;

        jobListingsContainer.appendChild(jobElement);
    });


    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => toggleFilter(tag.textContent));
    });
}


function toggleFilter(tag) {
    if (selectedFilters.has(tag)) {
        selectedFilters.delete(tag);
    } else {
        selectedFilters.add(tag);
    }
    updateSelectedFilters();
    filterJobs();
}


function updateSelectedFilters() {
    const filtersContainer = document.getElementById('filters-container');
    filtersContainer.innerHTML = ''; 

    selectedFilters.forEach(filter => {
        const filterElement = document.createElement('span');
        filterElement.className = 'selected-tag';
        filterElement.textContent = filter;
        filtersContainer.appendChild(filterElement);
    });

    const selectedFiltersDiv = document.getElementById('selected-filters');
    if (selectedFilters.size > 0) {
        selectedFiltersDiv.style.display = 'flex';
    } else {
        selectedFiltersDiv.style.display = 'none';
    }
}


function filterJobs() {
    if (selectedFilters.size === 0) {
        displayJobs(allJobs);
        return;
    }

    const filteredJobs = allJobs.filter(job => {
        const jobTags = [
            job.role,
            job.level,
            ...job.languages,
            ...job.tools
        ];
        return Array.from(selectedFilters).every(filter => jobTags.includes(filter));
    });

    displayJobs(filteredJobs);
}


function clearFilter() {
    selectedFilters.clear();
    updateSelectedFilters();
    displayJobs(allJobs);
}


document.getElementById('clear-filter').addEventListener('click', clearFilter);
