(function () {
  var STORAGE_KEY = 'admin_password';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getPassword() {
    try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
  }
  function setPassword(pw) {
    try { sessionStorage.setItem(STORAGE_KEY, pw); } catch { /* ignore */ }
  }
  function clearPassword() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  function authedFetch(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({}, opts.headers, { 'X-Admin-Password': getPassword() });
    return fetch(url, opts);
  }

  var loginGate = document.getElementById('loginGate');
  var dashboard = document.getElementById('dashboard');
  var loginStatus = document.getElementById('loginStatus');

  function showDashboard() {
    loginGate.style.display = 'none';
    dashboard.classList.add('visible');
    loadPosts();
    loadLeads();
  }

  function tryUnlock(pw) {
    setPassword(pw);
    loginStatus.textContent = 'Checking...';
    authedFetch('/api/estimate')
      .then(function (res) {
        if (res.status === 401) {
          clearPassword();
          loginStatus.style.color = '#ef4444';
          loginStatus.textContent = 'Wrong password.';
          return;
        }
        if (!res.ok) {
          loginStatus.style.color = '#ef4444';
          loginStatus.textContent = 'Something went wrong. Try again.';
          return;
        }
        showDashboard();
      })
      .catch(function () {
        loginStatus.style.color = '#ef4444';
        loginStatus.textContent = 'Could not reach the server.';
      });
  }

  document.getElementById('unlockBtn').addEventListener('click', function () {
    var pw = document.getElementById('adminPassword').value;
    if (!pw) return;
    tryUnlock(pw);
  });
  document.getElementById('adminPassword').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') document.getElementById('unlockBtn').click();
  });
  document.getElementById('logoutBtn').addEventListener('click', function () {
    clearPassword();
    location.reload();
  });

  // If a password is already stashed in this tab's session, skip the gate.
  if (getPassword()) tryUnlock(getPassword());

  // --- Cover image auto-generation ---------------------------------------
  var coverInput = document.getElementById('postCoverInput');
  var coverPreview = document.getElementById('postCoverPreview');
  var _autoGenCover = ''; // track the last auto-generated URL so manual edits aren't overwritten

  function buildCoverUrl(title, category, slug) {
    if (!title) return '';
    var p = new URLSearchParams({ title: title, category: category || 'Blog', slug: slug || '' });
    return '/api/cover?' + p.toString();
  }

  function updateCoverPreview() {
    var url = coverInput.value.trim();
    if (coverPreview) {
      if (url) {
        coverPreview.src = url;
        coverPreview.hidden = false;
      } else {
        coverPreview.hidden = true;
      }
    }
  }

  function syncCover() {
    var title = (document.getElementById('postTitleInput').value || '').trim();
    var category = (document.getElementById('postCategoryInput').value || '').trim();
    var current = coverInput.value.trim();
    // Only auto-fill if the field is empty or still holds our last generated URL
    if (!current || current === _autoGenCover) {
      _autoGenCover = buildCoverUrl(title, category, '');
      coverInput.value = _autoGenCover;
      updateCoverPreview();
    }
  }

  document.getElementById('postTitleInput').addEventListener('input', syncCover);
  document.getElementById('postCategoryInput').addEventListener('input', syncCover);
  coverInput.addEventListener('input', updateCoverPreview);

  // --- New post form -----------------------------------------------------
  document.getElementById('newPostForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var statusEl = document.getElementById('postStatus');
    var btn = document.getElementById('postSubmitBtn');
    var payload = {
      title: document.getElementById('postTitleInput').value.trim(),
      category: document.getElementById('postCategoryInput').value.trim() || 'General',
      excerpt: document.getElementById('postExcerptInput').value.trim(),
      coverImage: document.getElementById('postCoverInput').value.trim(),
      content: document.getElementById('postContentInput').value.trim(),
    };
    if (!payload.title || !payload.content) {
      statusEl.style.color = '#ef4444';
      statusEl.textContent = 'Title and content are required.';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Publishing...';
    authedFetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok) {
          statusEl.style.color = 'var(--brass)';
          statusEl.textContent = 'Published: ' + result.data.post.title;
          document.getElementById('newPostForm').reset();
          _autoGenCover = '';
          if (coverPreview) coverPreview.hidden = true;
          loadPosts();
        } else {
          statusEl.style.color = '#ef4444';
          statusEl.textContent = result.data.error || 'Could not publish that post.';
        }
      })
      .catch(function () {
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Could not reach the server.';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Publish post';
      });
  });

  // --- Posts list ----------------------------------------------------------
  function loadPosts() {
    var listEl = document.getElementById('postsList');
    fetch('/api/posts')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var posts = data.posts || [];
        if (!posts.length) {
          listEl.innerHTML = '<p class="empty-note">No posts published through this panel yet.</p>';
          return;
        }
        listEl.innerHTML = posts.map(function (p) {
          return (
            '<div class="post-item" data-slug="' + escapeHtml(p.slug) + '">' +
              '<div><h4>' + escapeHtml(p.title) + '</h4><p>' + escapeHtml(p.category) + ' &middot; ' + new Date(p.createdAt).toLocaleDateString() + '</p></div>' +
              '<button type="button" class="del-btn" data-slug="' + escapeHtml(p.slug) + '">Delete</button>' +
            '</div>'
          );
        }).join('');
        listEl.querySelectorAll('.del-btn').forEach(function (btn) {
          btn.addEventListener('click', function () { deletePost(btn.dataset.slug); });
        });
      })
      .catch(function () {
        listEl.innerHTML = '<p class="empty-note">Could not load posts.</p>';
      });
  }

  function deletePost(slug) {
    if (!confirm('Delete this post permanently?')) return;
    authedFetch('/api/posts/' + encodeURIComponent(slug), { method: 'DELETE' })
      .then(function (res) { if (res.ok) loadPosts(); else alert('Could not delete that post.'); })
      .catch(function () { alert('Could not reach the server.'); });
  }

  // --- Leads list ------------------------------------------------------
  function loadLeads() {
    var listEl = document.getElementById('leadsList');
    authedFetch('/api/estimate')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var leads = data.estimates || [];
        if (!leads.length) {
          listEl.innerHTML = '<p class="empty-note">No estimate requests yet.</p>';
          return;
        }
        listEl.innerHTML = leads.map(function (l) {
          var range = (l.estimateLow && l.estimateHigh) ? ('$' + l.estimateLow + '-$' + l.estimateHigh) : 'n/a';
          var who = l.name || l.email || 'Anonymous';
          return (
            '<div class="lead-item">' +
              '<div><h4>' + escapeHtml(who) + '</h4>' +
              '<p>' + escapeHtml(l.projectType) + ' &middot; ' + (l.pages || '?') + ' pages &middot; ' + escapeHtml(range) + '</p>' +
              (l.addons && l.addons.length ? '<p>Add-ons: ' + escapeHtml(l.addons.join(', ')) + '</p>' : '') +
              (l.email ? '<p>' + escapeHtml(l.email) + '</p>' : '') +
              '</div>' +
              '<p style="font-size:12px; color:var(--paper-dim); white-space:nowrap;">' + new Date(l.createdAt).toLocaleDateString() + '</p>' +
            '</div>'
          );
        }).join('');
      })
      .catch(function () {
        listEl.innerHTML = '<p class="empty-note">Could not load estimate requests.</p>';
      });
  }
})();
