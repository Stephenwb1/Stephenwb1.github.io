let peopleData = [];
let myself = {};

document.addEventListener('DOMContentLoaded', () => {
  const findBtn = document.getElementById("findBtn");
  if (findBtn) {
    findBtn.addEventListener("click", () => {
      window.location.href = "form.html";
    });
  }

  const resultsContainer = document.getElementById("results");
  if (resultsContainer) {
    fetch('data/data.json')
      .then(res => res.json())
      .then(partnersData => {
        peopleData = partnersData;
        myself = JSON.parse(localStorage.getItem("myself"));

        if (!myself) {
          resultsContainer.innerHTML = `<p>Please fill out your profile first.</p>`;
          return;
        }

        const bestMatches = findBestPartners(peopleData, myself);
        renderPartners(bestMatches);
        const sortSelect = document.getElementById("sortSelect");

        if (sortSelect) {
          sortSelect.addEventListener("change", () => {
            const choice = sortSelect.value;

            switch (choice) {
              case "distance":
                sortLocation();
                break;
              case "gender":
                sortGender(myself.gender);
                break;
              case "height":
                sortHeight(myself.height);
                break;
              case "weight":
                sortWeight(myself.weight);
                break;
              default:
                renderPartners(bestMatches);
            }
          });
        }

      })
      .catch(err => {
        console.error("Failed to load data:", err);
      });
  }
});

function findBestPartners(partners, me) {
  return partners
    .sort((a, b) => a.distance - b.distance)
    .filter(p => !me.gender || p.gender === me.gender)
    .sort((a, b) => {
      const heightDiff = Math.abs(a.height - me.height) - Math.abs(b.height - me.height);
      if (heightDiff !== 0) return heightDiff;

      return Math.abs(a.weight - me.weight) - Math.abs(b.weight - me.weight);
    })
    .slice(0, 4);
}

function renderPartners(partners) {
  const container = document.getElementById('results');
  container.innerHTML = ''; // Clear the existing content

  const list = document.createElement('div');
  list.className = 'partner-list';

  partners.forEach(partner => {
    const div = document.createElement('div');
    div.className = 'partner-card';
    div.innerHTML = `
      <h3>${partner.name}</h3>
      <p>Gender: ${partner.gender}</p>
      <p>Age: ${partner.age}</p>
      <p>Belt Level: ${partner.belt}</p>
      <p>Years Training: ${partner.years_training}</p>
      <p>Height: ${partner.height} cm</p>
      <p>Weight: ${partner.weight} lbs</p>
      <p>Location: ${partner.location}</p>
      <p>Distance: ${partner.distance} km</p>
    `;
    list.appendChild(div);
  });

  container.appendChild(list);
}
function sortLocation() {
  const sorted = [...peopleData].sort((a, b) => Number(a.distance) - Number(b.distance));
  renderPartners(sorted.slice(0, 4));
}

function sortGender(gender) {
  const filtered = peopleData.filter(person => person.gender.toLowerCase() === gender.toLowerCase());
  renderPartners(filtered.slice(0, 4));
}

function sortHeight(userHeight) {
  const sorted = [...peopleData].sort((a, b) =>
    Math.abs(Number(a.height) - userHeight) - Math.abs(Number(b.height) - userHeight)
  );
  renderPartners(sorted.slice(0, 4));
}

function sortWeight(userWeight) {
  const sorted = [...peopleData].sort((a, b) =>
    Math.abs(Number(a.weight) - userWeight) - Math.abs(Number(b.weight) - userWeight)
  );
  renderPartners(sorted.slice(0, 4));
}

