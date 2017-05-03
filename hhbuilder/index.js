var householdStore = [];

window.onload = function() {

  var form = document.querySelector('form');
  var ageInput = form.age,
    relInput = form.rel,
    smokerInput = form.smoker;
  var addButton = document.getElementsByClassName('add')[0];
  var householdList = document.getElementsByClassName('household')[0];
  var debug = document.getElementsByClassName('debug')[0];

  addButton.addEventListener('click', function(e) {

    e.preventDefault();

    var formInvalid = false;

    // Clear error messages
    var errors = document.getElementsByClassName('error');

    while (errors.length > 0) {
      errors[0].parentElement.removeChild(errors[0]);
    }

    var age = Number(form.age.value),
      rel = form.rel.value,
      smoker = form.smoker.checked;

    // Validate age
    if (typeof age !== 'number' || age !== age || age <= 0) {
      formInvalid = true;
      var ageError = createErrorMessage('Please provide a valid age.');
      ageInput.parentElement.parentElement.appendChild(ageError);
    }

    // Validate relationship
    if (rel === '') {
      formInvalid = true;
      var relError = createErrorMessage('Please provide your relationship to this person.');
      relInput.parentElement.parentElement.appendChild(relError);
    }

    // Short circuit if invalid
    if (formInvalid) {
      return
    }

    // Update DOM
    var newHouseholdMember = createHouseholdMember(age, rel, smoker, householdStore.length);
    householdList.appendChild(newHouseholdMember);

    //Update store
    householdStore.push({
      age: age,
      rel: rel,
      smoker: smoker
    });

    // Reset form
    form.age.value = '';
    form.rel.value = '';
    form.smoker.value = '';

  });

  form.addEventListener('submit', function(e) {

    e.preventDefault();

    var json = JSON.stringify(householdStore);

    debug.textContent = json;
    debug.style.display = 'block';

  });

}

function createHouseholdMember(age, rel, smoker, key) {

  var member = document.createElement('li');
  var memberAge = document.createElement('p');
  var memberRel = document.createElement('p');
  var memberSmoker = document.createElement('p');
  var deleteButton = document.createElement('button');

  member.setAttribute('data-key', key);
  memberAge.textContent = 'Age: ' + age;
  memberRel.textContent = 'Relationship: ' + rel;
  memberSmoker.textContent = smoker ? 'Smokes' : "Doesn't smoke";
  deleteButton.textContent = 'Delete';

  deleteButton.addEventListener('click', function() {

    householdStore.splice(member.dataset.key, 1);

    // Clear and re-render list of household members to sync list with store indices
    var list = member.parentElement;

    while (list.children.length > 0) {
      list.removeChild(list.children[0]);
    }

    householdStore.forEach(function(memberObj, i) {
      list.appendChild(createHouseholdMember(memberObj.age, memberObj.rel, memberObj.smoker, i));
    });

  });

  member.appendChild(memberAge);
  member.appendChild(memberRel);
  member.appendChild(memberSmoker);
  member.appendChild(deleteButton);

  return member;

}

function createErrorMessage(message) {

  var errorMessage = document.createElement('p');

  errorMessage.className = 'error';
  errorMessage.textContent = message;
  errorMessage.style.color = 'red';

  return errorMessage;

}
