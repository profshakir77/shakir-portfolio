(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var statusEl = document.getElementById('contactStatus');
  var submitBtn = document.getElementById('contactSubmit');

  function setStatus(text, isError) {
    statusEl.textContent = text;
    statusEl.style.color = isError ? '#ef4444' : 'var(--brass)';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      budget: form.budget.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value, // honeypot
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Please fill in your name, email and project brief.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    setStatus('', false);

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          setStatus("Thanks -- your message is on its way. I'll reply soon.", false);
        } else {
          setStatus(result.data.error || 'Something went wrong. Please try again.', true);
        }
      })
      .catch(function () {
        setStatus('Could not reach the server. Please try again or email mr.shakir77@gmail.com directly.', true);
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      });
  });
})();
