(function(){
  var form = document.getElementById('regForm');
  var rosterBody = document.getElementById('rosterBody');
  var rosterCount = document.getElementById('rosterCount');
  var successToast = document.getElementById('successToast');
  var entryNum = 0;

  function setError(fieldId, message){
    var el = document.getElementById('err-' + fieldId);
    var input = document.getElementById(fieldId);
    if(el) el.textContent = message || '';
    if(input) input.classList.toggle('invalid', !!message);
  }

  function calcAge(dobStr){
    var dob = new Date(dobStr);
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if(m < 0 || (m === 0 && today.getDate() < dob.getDate())){
      age--;
    }
    return age;
  }

  function validate(){
    var valid = true;

    var fullName = document.getElementById('fullName').value.trim();
    if(!fullName){
      setError('fullName', 'Full name is required.');
      valid = false;
    } else {
      setError('fullName', '');
    }

    var email = document.getElementById('email').value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
      setError('email', 'Email is required.');
      valid = false;
    } else if(!emailPattern.test(email)){
      setError('email', 'Enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    var mobile = document.getElementById('mobile').value.trim();
    var mobilePattern = /^\d{10}$/;
    if(!mobile){
      setError('mobile', 'Mobile number is required.');
      valid = false;
    } else if(!mobilePattern.test(mobile)){
      setError('mobile', 'Enter exactly 10 digits.');
      valid = false;
    } else {
      setError('mobile', '');
    }

    var dob = document.getElementById('dob').value;
    if(!dob){
      setError('dob', 'Date of birth is required.');
      valid = false;
    } else if(calcAge(dob) <= 18){
      setError('dob', 'Age must be greater than 18.');
      valid = false;
    } else {
      setError('dob', '');
    }

    var genderChecked = document.querySelector('input[name="gender"]:checked');
    if(!genderChecked){
      setError('gender', 'Please select a gender.');
      valid = false;
    } else {
      setError('gender', '');
    }

    var department = document.getElementById('department').value;
    if(!department){
      setError('department', 'Please select a department.');
      valid = false;
    } else {
      setError('department', '');
    }

    var course = document.getElementById('course').value;
    if(!course){
      setError('course', 'Please select a course.');
      valid = false;
    } else {
      setError('course', '');
    }

    var address = document.getElementById('address').value.trim();
    if(!address){
      setError('address', 'Address is required.');
      valid = false;
    } else {
      setError('address', '');
    }

    return valid;
  }

  function addToRoster(data){
    var emptyRow = rosterBody.querySelector('.empty-row');
    if(emptyRow) emptyRow.remove();

    entryNum++;
    var tr = document.createElement('tr');

    var skillsHtml = data.skills.length
      ? data.skills.map(function(s){ return '<span class="pill">' + s + '</span>'; }).join('')
      : '<span style="color:var(--ink-soft); font-size:0.82rem;">—</span>';

    tr.innerHTML =
      '<td class="num">' + String(entryNum).padStart(2,'0') + '</td>' +
      '<td>' + data.fullName + '</td>' +
      '<td>' + data.course + '</td>' +
      '<td>' + data.department + '</td>' +
      '<td>' + data.email + '<br><span style="color:var(--ink-soft);font-size:0.8rem;">' + data.mobile + '</span></td>' +
      '<td>' + skillsHtml + '</td>' +
      '<td><span class="stamp">ENROLLED</span></td>';

    rosterBody.appendChild(tr);
    rosterCount.textContent = entryNum + (entryNum === 1 ? ' entry' : ' entries');
  }

  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    successToast.classList.remove('show');

    if(!validate()){
      return;
    }

    var skills = Array.prototype.slice.call(document.querySelectorAll('input[name="skills"]:checked'))
      .map(function(cb){ return cb.value; });

    var data = {
      fullName: escapeHtml(document.getElementById('fullName').value.trim()),
      email: escapeHtml(document.getElementById('email').value.trim()),
      mobile: escapeHtml(document.getElementById('mobile').value.trim()),
      department: escapeHtml(document.getElementById('department').value),
      course: escapeHtml(document.getElementById('course').value),
      skills: skills.map(escapeHtml)
    };

    addToRoster(data);

    successToast.classList.add('show');
    form.reset();
    // clear any lingering error/invalid states after reset
    ['fullName','email','mobile','dob','gender','department','course','address'].forEach(function(id){
      setError(id, '');
    });

    setTimeout(function(){
      successToast.classList.remove('show');
    }, 4000);
  });

  document.getElementById('resetBtn').addEventListener('click', function(){
    ['fullName','email','mobile','dob','gender','department','course','address'].forEach(function(id){
      setError(id, '');
    });
    successToast.classList.remove('show');
  });

  // live-clear individual field errors as the user fixes them
  ['fullName','email','mobile','dob','department','course','address'].forEach(function(id){
    var el = document.getElementById(id);
    el.addEventListener('input', function(){
      if(el.value.trim()) setError(id, '');
    });
  });
  document.querySelectorAll('input[name="gender"]').forEach(function(r){
    r.addEventListener('change', function(){ setError('gender', ''); });
  });
})();