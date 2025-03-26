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
  
    
    diseaseForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const diseaseName = document.getElementById('disease-name').value;
      const animalType = document.getElementById('animal-type').value;
      const symptoms = document.getElementById('symptoms').value;
      const treatment = document.getElementById('treatment').value;
      const symptomImage = symptomImageInput.files[0];
  
      if (!diseaseName || !animalType || !symptoms || !treatment) {
        alert('Please fill out all fields.');
        return;
      }
  
      const newDisease = {
        name: diseaseName,
        animalType: animalType,
        symptoms: symptoms,
        treatment: treatment,
        image: symptomImage ? URL.createObjectURL(symptomImage) : null
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
        fetchDiseases(); 
        diseaseForm.reset();
        imagePreviewDiv.innerHTML = '';  
      })
      .catch(error => console.error('Error adding new disease:', error));
    });
  
    
    addImageBtn.addEventListener('click', function() {
      symptomImageInput.click();
    });
    const aboutLink = document.getElementById('about-link');
    const aboutSection = document.getElementById('about-section');

    
    aboutLink.addEventListener('click', function() {
        
        if (aboutSection.style.display === 'none' || aboutSection.style.display === '') {
            aboutSection.style.display = 'block'; 
        } else {
            aboutSection.style.display = 'none'; 
        }
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
});
