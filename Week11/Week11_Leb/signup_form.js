// signup_form.js

// 取得主要 DOM 元素
const form = document.getElementById('member-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agreeCheckbox = document.getElementById('agree');

const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm');
const passwordError = document.getElementById('password-error');
const confirmError = document.getElementById('confirm-error');

const touched = new Set();

// --- 即時清除錯誤樣式 ---
form.addEventListener('input', (e) => {
  const target = e.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});

// --- Email 與手機驗證 ---
function showValidity(input) {
  if (input.validity.valueMissing) {
    input.setCustomValidity('這個欄位必填');
  } else if (input.validity.typeMismatch) {
    input.setCustomValidity('格式不正確，請確認輸入內容');
  } else if (input.validity.patternMismatch) {
    input.setCustomValidity(input.title || '格式不正確');
  } else {
    input.setCustomValidity('');
  }
  return input.reportValidity();
}

email.addEventListener('blur', () => showValidity(email));
phone.addEventListener('blur', () => showValidity(phone));

// --- 密碼與確認密碼驗證 ---
function validatePassword() {
  const value = password.value.trim();
  const hasLetter = /[A-Za-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  let message = '';

  if (!value) message = '請輸入密碼。';
  else if (value.length < 8) message = '密碼至少需 8 碼。';
  else if (!hasLetter || !hasNumber || !hasSymbol) message = '請同時包含英文字母、數字與特殊符號。';

  password.setCustomValidity(message);
  passwordError.textContent = message;
  return !message;
}

function validateConfirm() {
  const message = confirmPassword.value.trim() === ''
    ? '請再次輸入密碼。'
    : (confirmPassword.value !== password.value ? '兩次輸入的密碼不一致。' : '');
    
  confirmPassword.setCustomValidity(message);
  confirmError.textContent = message;
  return !message;
}

function runValidation(fieldId) {
  if (fieldId === 'password') {
    validatePassword();
    if (touched.has('confirm')) validateConfirm();
  } else if (fieldId === 'confirm') {
    validateConfirm();
  }
}

[password, confirmPassword].forEach((input) => {
  input.addEventListener('blur', (e) => {
    touched.add(e.target.id);
    runValidation(e.target.id);
  });
  input.addEventListener('input', (e) => {
    if (touched.has(e.target.id)) runValidation(e.target.id);
  });
});

// --- 同意條款提示 ---
agreeCheckbox.addEventListener('change', () => {
  if (agreeCheckbox.checked) {
    alert(`隱私權條款：
1. 僅蒐集提供服務所需最少個人資料。
2. 您的資料將依據個資法安全保存與使用。
3. 可隨時要求查閱、更正或刪除個人資料。
感謝您同意。`);
  }
});

// --- 抓報名清單並渲染 table ---
async function loadParticipants() {
  try {
    const res = await fetch('http://localhost:3001/api/signup');
    const data = await res.json();

    const tbody = document.getElementById('participantsTableBody');
    tbody.innerHTML = '';

    data.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${item.phone}</td>
        <td>${item.status || '未設定'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('取得報名清單失敗', err);
  }
}

// --- 表單送出 ---
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  // 基本欄位驗證
  const controls = Array.from(form.querySelectorAll('input, select, textarea'));
  let firstInvalid = null;
  controls.forEach(control => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity() && !firstInvalid) firstInvalid = control;
    if (!control.checkValidity()) control.classList.add('is-invalid');
  });

  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);
  const passwordOk = validatePassword();
  const confirmOk = validateConfirm();

  if (firstInvalid || !emailOk || !phoneOk || !passwordOk || !confirmOk) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    (firstInvalid || email).focus();
    return;
  }

  try {
    const payload = {
      name: fullName.value,
      email: email.value,
      phone: phone.value
    };

    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      alert('送出失敗：' + (errData.error || '未知錯誤'));
      return;
    }

    alert('註冊成功，資料已送出！');
    form.reset();
    passwordError.textContent = '';
    confirmError.textContent = '';
    touched.clear();

    // 更新 table
    loadParticipants();

  } catch (err) {
    console.error(err);
    alert('送出失敗，請稍後再試。');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});

// --- 清除按鈕 ---
resetBtn.addEventListener('click', () => {
  form.reset();
  passwordError.textContent = '';
  confirmError.textContent = '';
  touched.clear();
  Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));
});

// --- 網頁一打開就載入 table ---
loadParticipants();
