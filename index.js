document.addEventListener('DOMContentLoaded', function() {
  const diseaseForm = document.getElementById('disease-form');
  const diseaseTableBody = document.querySelector('#disease-table tbody');
  const addImageBtn = document.getElementById('add-image-btn');
  const imagePreviewDiv = document.getElementById('image-preview');
  const symptomImageInput = document.getElementById('symptom-image');

  
  function fetchDiseases() {
      fetch('http://localhost:3000/diseases')  
          .then(response => response.json())
          .then(data => {
              populateDiseaseTable(data);  
          })
          .catch(error => console.error('Error fetching diseases:', error));
  }

  
  function populateDiseaseTable(diseases) {
      diseaseTableBody.innerHTML = '';  

      diseases.forEach(disease => {
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
              <td>${disease.name}</td>
              <td>${disease.animalType}</td>
              <td>${disease.symptoms}</td>
              <td>${disease.treatment}</td>
              <td>${disease.image ? `<img src="${disease.image}" style="width: 100px;">` : 'No Image'}</td>
          `;
          diseaseTableBody.appendChild(newRow);  
      });
  }

  
  diseaseForm.addEventListener("submit", function(event) {
      event.preventDefault();  

      
      const diseaseName = document.getElementById("disease-name").value;
      const animalType = document.getElementById("animal-type").value;
      const symptoms = document.getElementById("symptoms").value;
      const treatment = document.getElementById("treatment").value;
      const image = imagePreviewDiv.querySelector("img") ? imagePreviewDiv.querySelector("img").src : "";

      
      if (!diseaseName || !animalType || !symptoms || !treatment) {
          alert('Please fill out all fields.');
          return;
      }

      
      const newDisease = {
          name: diseaseName,
          animalType: animalType,
          symptoms: symptoms,
          treatment: treatment,
          image: image || null  
      };

      
      fetch('http://localhost:3000/diseases', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDisease),  
      })
      .then(response => response.json())  
      .then(() => {
        
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
              <td>${newDisease.name}</td>
              <td>${newDisease.animalType}</td>
              <td>${newDisease.symptoms}</td>
              <td>${newDisease.treatment}</td>
              <td>${newDisease.image ? `<img src="${newDisease.image}" style="width: 100px;">` : 'No Image'}</td>
          `;
          diseaseTableBody.appendChild(newRow);  
          diseaseForm.reset();  
          imagePreviewDiv.innerHTML = '';  
      })
      .catch(error => console.error('Error adding new disease:', error));
  });

  
  addImageBtn.addEventListener('click', function() {
      symptomImageInput.click();  
  });

  
  symptomImageInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              const imgElement = document.createElement('img');
              imgElement.src = e.target.result;
              imgElement.style.width = '200px';  
              imagePreviewDiv.innerHTML = '';  
              imagePreviewDiv.appendChild(imgElement);  
          };
          reader.readAsDataURL(file);  
      }
  });

  
  
  fetchDiseases();

  
  document.getElementById('search-btn').addEventListener('click', function() {
      const searchInput = document.getElementById('search-input').value;
      if (searchInput.trim() !== '') {
          const searchUrl = `https://www.agric.wa.gov.au/organism-api-10?search=${encodeURIComponent(searchInput)}`;
          window.location.href = searchUrl;
      } else {
          alert('Please enter a search term');
      }
  });
});
