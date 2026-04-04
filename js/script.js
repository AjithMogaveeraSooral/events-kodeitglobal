document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw_q7H6Ujv3MFeGPimXo18RhOSY_DiRGQOlASSR3kBTj1AnV8KwRhsgVICknUuma3w/exec'; // <--- Paste your App Script URL here

    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const checkedGrades = document.querySelectorAll('input[name="grade_levels[]"]:checked');
        if (checkedGrades.length === 0) {
            alert('Please select at least one Grade Level.');
            return;
        }

        const submitBtn = document.querySelector('.btn-submit-modern');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        const formData = new FormData(registrationForm);

        // Consolidate grade_levels[] checkboxes into a single comma-separated value
        const checkedGradeValues = Array.from(checkedGrades).map(chk => chk.value);
        formData.delete('grade_levels[]');
        formData.set('grade_levels', checkedGradeValues.join(', '));

        // Consolidate session[] checkboxes into a single comma-separated value
        const checkedSessions = document.querySelectorAll('input[name="session[]"]:checked');
        const sessionValues = Array.from(checkedSessions).map(chk => chk.value);
        formData.delete('session[]');
        formData.set('session', sessionValues.join(', '));

        // If "Other" subject is selected, use the text input value as the subject
        const selectedSubject = document.querySelector('input[name="subject"]:checked');
        if (selectedSubject && selectedSubject.value === 'Other') {
            const otherValue = document.getElementById('otherSubject').value.trim();
            if (otherValue) {
                formData.set('subject', 'Other: ' + otherValue);
            }
        }
        formData.delete('other_subject');

        const countryCode = document.getElementById('country_code_input').value;
        let mobileNumber = document.getElementById('mobile').value.trim();
        mobileNumber = mobileNumber.replace(/^0+/, '');

        const cleanCountryCode = countryCode.replace('+', '');
        formData.set('mobile', cleanCountryCode +' '+ mobileNumber);

        fetch(scriptURL, { 
            method: 'POST', 
            body: formData 
        })
        .then(response => {
            alert('Registration Successful! Check your email for confirmation.');
            registrationForm.reset();
            updateLabel();
            // Hide the "Other" subject text field after reset
            document.getElementById('otherSubject').style.display = 'none';
            document.getElementById('otherSubject').required = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Submission failed. Please try again.');
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
    });
});

function toggleDropdown() {
  const checkboxes = document.getElementById("checkboxes");
  checkboxes.style.display = checkboxes.style.display === "block" ? "none" : "block";
  document.getElementById("dropdownMenu").classList.toggle("show");
}

function toggleSelectAll(source) {
  const checkboxes = document.querySelectorAll('.grade-chk');
  checkboxes.forEach(chk => chk.checked = source.checked);
  updateLabel();
}

function updateLabel() {
  const checkboxes = document.querySelectorAll('.grade-chk');
  const checked = Array.from(checkboxes).filter(chk => chk.checked);
  const label = document.getElementById("select-label");
  const selectAll = document.getElementById("selectAll");

  if (checked.length === 0) {
    label.innerText = "Select Grade Levels";
    selectAll.checked = false;
  } else if (checked.length === checkboxes.length) {
    label.innerText = "All Selected";
    selectAll.checked = true;
  } else {
    label.innerText = checked.length + " Levels Selected";
    selectAll.checked = false;
  }

  document.getElementById("checkboxes").style.display = "none";
}

window.onclick = function(event) {
  if (!event.target.closest('.custom-multiselect')) {
    document.getElementById("checkboxes").style.display = "none";
  }

  if (!event.target.closest('.custom-dropdown')) {
    var dropdowns = document.getElementsByClassName("dropdown-menu");
    for (var i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove('show');
    }
  }
}

function toggleOtherSubject() {
  const otherInput = document.getElementById('otherSubject');
  const selectedSubject = document.querySelector('input[name="subject"]:checked');
  if (selectedSubject && selectedSubject.value === 'Other') {
    otherInput.style.display = 'block';
    otherInput.required = true;
  } else {
    otherInput.style.display = 'none';
    otherInput.required = false;
    otherInput.value = '';
  }
}

// Attach change listener to all subject radios for toggling
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('input[name="subject"]').forEach(function(radio) {
    radio.addEventListener('change', toggleOtherSubject);
  });
});

function selectCountry(code, flagSrc) {
  document.getElementById("selected-flag").src = flagSrc;
  document.getElementById("selected-code").innerText = code;  
  document.getElementById("country_code_input").value = code;
  document.getElementById("dropdownMenu").classList.remove("show");
}