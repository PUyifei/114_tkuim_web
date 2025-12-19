<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>登入與報名系統</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    input, button { margin: 5px 0; padding: 5px; }
    #signup-list li { margin-bottom: 5px; }
    .error { color: red; }
    .loading { opacity: 0.6; }
    #signup-container { display: none; }
  </style>
</head>
<body>
  <h1>登入系統</h1>
  <div id="login-container">
    <form id="login-form">
      <input type="email" id="login-email" placeholder="Email" required />
      <input type="password" id="login-password" placeholder="Password" required />
      <button type="submit" id="login-btn">登入</button>
    </form>
    <div id="login-error" class="error"></div>
  </div>

  <div id="signup-container">
    <div>
      <span id="user-info"></span>
      <button id="logout-btn">登出</button>
    </div>
    <h2>報名表單</h2>
    <form id="signup-form">
      <input type="text" id="name" name="name" placeholder="姓名" required />
      <input type="text" id="phone" name="phone" placeholder="電話" required />
      <button type="submit" id="submit-btn">送出</button>
    </form>
    <div id="form-message" class="error"></div>

    <h2>報名列表</h2>
    <ul id="signup-list"></ul>
    <div id="list-message" class="error"></div>
  </div>

  <script>
    // DOM 元素
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginContainer = document.getElementById('login-container');

    const signupContainer = document.getElementById('signup-container');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    const signupForm = document.getElementById('signup-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageBox = document.getElementById('form-message');
    const signupList = document.getElementById('signup-list');
    const listMessage = document.getElementById('list-message');

    // 檢查 localStorage
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user'));

    function showSignupSection() {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
      userInfo.textContent = `目前使用者：${user.email} (${user.role})`;
      loadSignupList();
    }

    if (token && user) {
      showSignupSection();
    }

    // 登入
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          loginError.textContent = data.message || '登入失敗';
          return;
        }

        token = data.token;
        user = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        showSignupSection();
      } catch (err) {
        loginError.textContent = '系統錯誤，請稍後再試';
      }
    });

    // 登出
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      token = null;
      user = null;
      signupContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    });

    // 載入報名列表
    async function loadSignupList() {
      signupList.innerHTML = '';
      listMessage.textContent = '';
      try {
        const res = await fetch('/api/signup', {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          messageBox.textContent = '登入已過期，請重新登入';
          signupContainer.style.display = 'none';
          loginContainer.style.display = 'block';
          return;
        }

        const data = await res.json();
        if (data.total === 0) {
          listMessage.textContent = '目前沒有報名資料';
          return;
        }

        data.data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.name} / ${item.phone}`;
          const delBtn = document.createElement('button');
          delBtn.textContent = '刪除';
          delBtn.addEventListener('click', () => deleteSignup(item.id));
          li.appendChild(delBtn);
          signupList.appendChild(li);
        });
      } catch (err) {
        listMessage.textContent = '載入失敗，請稍後再試';
      }
    }

    // 刪除
    async function deleteSignup(id) {
      if (!confirm('確定要刪除這筆資料嗎？')) return;
      try {
        const res = await fetch(`/api/signup/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          messageBox.textContent = '登入已過期，請重新登入';
          signupContainer.style.display = 'none';
          loginContainer.style.display = 'block';
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          messageBox.textContent = data.message || '刪除失敗';
          return;
        }
        loadSignupList();
      } catch (err) {
        messageBox.textContent = '系統錯誤，請稍後再試';
      }
    }

    // 送出表單
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      messageBox.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = '送出中...';

      const payload = {
        name: signupForm.name.value.trim(),
        phone: signupForm.phone.value.trim()
      };

      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          messageBox.textContent = '登入已過期，請重新登入';
          signupContainer.style.display = 'none';
          loginContainer.style.display = 'block';
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          messageBox.textContent = data.message || '送出失敗';
          return;
        }

        messageBox.textContent = '報名成功';
        signupForm.reset();
        loadSignupList();
      } catch (err) {
        messageBox.textContent = '系統錯誤，請稍後再試';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '送出';
      }
    });
  </script>
</body>
</html>
