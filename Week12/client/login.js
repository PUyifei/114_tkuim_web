const loginForm = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.textContent = '';

  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.message || '登入失敗，請檢查帳密';
      return;
    }

    // ✅ 成功
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    alert('登入成功，快去看報名資料');
    location.href = '/signup.html';
  } catch (err) {
    errorBox.textContent = '系統錯誤，請稍後再試';
  }
});
