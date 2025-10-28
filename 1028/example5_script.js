// example5_script.js
// 攔截 submit，聚焦第一個錯誤並模擬送出流程

const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agreeCheckbox = document.getElementById('agree');

function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

agreeCheckbox.addEventListener('change', () => {
  if (agreeCheckbox.checked) {
    alert(`隱私權條款：
  1. 我們僅蒐集提供服務所需的最少個人資料。
  2. 您的資料將依據個資法安全保存與使用。
  3. 您可隨時要求查閱、更正或刪除個人資料。
  感謝您閱讀並同意本條款。`);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});
