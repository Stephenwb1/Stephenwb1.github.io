// Global variables to hold loaded data
let peopleData = [];
let myself = {};

// Load everything after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Handle button if it's on the page (e.g., on index.html)
  const findBtn = document.getElementById("findBtn");
  if (findBtn) {
    findBtn.addEventListener("click", () => {
      window.location.href = "results.html"; // Navigate to results
    });
  }

  // Only load and render matches if on results page
  const resultsContainer = document.getElementById("results");
  if (resultsContainer) {
    Promise.all([
      fetch('data/data.json').then(res => res.json()),
      fetch('data/myself.json').then(res => res.json())
    ]).then(([partnersData, myProfile]) => {
      peopleData = partnersData;
      myself = myProfile;

      // Default display on load
      const bestMatches = findBestPartners(peopleData, myself);
      renderPartners(bestMatches);
    }).catch(err => {
      console.error("Failed to load data:", err);
    });
  }
});

// 🔍 Matching logic
function findBestPartners(partners, me) {
  return partners
    .sort((a, b) => a.distance - b.distance) // Closest first
    .filter(p => !me.gender || p.gender === me.gender) // Match gender if specified
    .sort((a, b) => {
      const heightDiffA = Math.abs(a.height - me.height);
      const heightDiffB = Math.abs(b.height - me.height);
      if (heightDiffA !== heightDiffB) return heightDiffA - heightDiffB;

      const weightDiffA = Math.abs(a.weight - me.weight);
      const weightDiffB = Math.abs(b.weight - me.weight);
      return weightDiffA - weightDiffB;
    })
    .slice(0, 4); // Top 4 matches
}

// 🧱 Display partner cards
function renderPartners(partners) {
  const container = document.getElementById('results');
  if (!container) return;

  container.innerHTML = '';

  partners.forEach(partner => {
    const div = document.createElement('div');
    div.className = 'partner-card';
    div.innerHTML = `
      <h3>${partner.name}</h3>
      <p>Gender: ${partner.gender}</p>
      <p>Age: ${partner.age}</p>
      <p>Belt Level: ${partner.belt}</p>
      <p>Years of Experience: ${partner.years_training}</p>
      <p>Height: ${partner.height} cm</p>
      <p>Weight: ${partner.weight} lbs</p>
      <p>Location: ${partner.location}</p>
      <p>Distance: ${partner.distance} km</p>
    `;
    container.appendChild(div);
  });
}

// 📍 Sort by distance
function sortLocation() {
  const sorted = [...peopleData].sort((a, b) => Number(a.distance) - Number(b.distance));
  renderPartners(sorted.slice(0, 4));
}

// 🚻 Filter by gender
function sortGender(gender) {
  const filtered = peopleData.filter(person => person.gender.toLowerCase() === gender.toLowerCase());
  renderPartners(filtered.slice(0, 4));
}

// 📏 Sort by closest height to user
function sortHeight(userHeight) {
  const sorted = [...peopleData].sort((a, b) => {
    return Math.abs(Number(a.height) - userHeight) - Math.abs(Number(b.height) - userHeight);
  });
  renderPartners(sorted.slice(0, 4));
}

// ⚖️ Sort by closest weight to user
function sortWeight(userWeight) {
  const sorted = [...peopleData].sort((a, b) => {
    return Math.abs(Number(a.weight) - userWeight) - Math.abs(Number(b.weight) - userWeight);
  });
  renderPartners(sorted.slice(0, 4));
}
