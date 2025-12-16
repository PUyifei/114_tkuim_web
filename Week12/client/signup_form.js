const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const messageBox = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  messageBox.textContent = '';

  const token = localStorage.getItem('token');
  if (!token) {
    messageBox.textContent = '請先登入';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const payload = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim()
  };

  const headers = { 'Content-Type': 'application/json' };
  headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      messageBox.textContent = '登入已過期，請重新登入';
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      messageBox.textContent = data.message || '送出失敗';
      return;
    }

    messageBox.textContent = '報名成功';
    form.reset();
    loadSignupList(); // 重新載入列表
  } catch (err) {
    messageBox.textContent = '系統錯誤，請稍後再試';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});
