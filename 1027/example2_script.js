// example2_script.js
// 驗證 Email 與手機欄位，拋出自訂訊息後再提示使用者

const form = document.getElementById('contact-form');
const email = document.getElementById('email');
const phone = document.getElementById('phone');


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

function validateEmailDomain(emailInput) {
  const emailValue = emailInput.value.trim();
  const allowedDomain = '@o365.tku.edu.tw';

  // 檢查是否以指定網域結尾
  if (!emailValue.endsWith(allowedDomain)) {
    emailInput.setCustomValidity(`Email 必須使用 ${allowedDomain} 網域`);
  } else {
    emailInput.setCustomValidity('');
  }

  return emailInput.reportValidity();
}
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // 一般格式驗證
  const emailOk = showValidity(email);
  const phoneOk = showValidity(phone);

  // 額外網域驗證
  const domainOk = validateEmailDomain(email);

  if (emailOk && phoneOk && domainOk) {
    alert('表單驗證成功，準備送出資料');
    form.reset();
  }
});

// 失焦時即時提示
email.addEventListener('blur', () => {
  showValidity(email);
  validateEmailDomain(email);
});

phone.addEventListener('blur', () => {
  showValidity(phone);
});
