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
    loadStudents();
    loadAdminProjects();
    loadReviews();
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

  // --- Students list ---------------------------------------------------
  function loadStudents() {
    var listEl = document.getElementById('studentsList');
    if (!listEl) return;
    authedFetch('/api/students')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var students = data.students || [];
        if (!students.length) { listEl.innerHTML = '<p class="empty-note">No student registrations yet.</p>'; return; }
        listEl.innerHTML = students.map(function (s) {
          var col = s.status === 'approved' ? '#16a34a' : s.status === 'rejected' ? '#ef4444' : '#92400e';
          var approveBtn = '<button class="del-btn" style="border-color:#16a34a;color:#16a34a" data-id="' + escapeHtml(s.id) + '" data-action="approve">Approve</button>';
          var rejectBtn = '<button class="del-btn" data-id="' + escapeHtml(s.id) + '" data-action="reject">Reject</button>';
          var actions = s.status === 'pending' ? approveBtn + ' ' + rejectBtn : s.status === 'approved' ? rejectBtn : approveBtn;
          return '<div class="lead-item"><div><h4>' + escapeHtml(s.name) + '</h4><p>' + escapeHtml(s.email) + (s.github ? ' &middot; <a href="' + escapeHtml(s.github) + '" target="_blank" rel="noopener" style="color:var(--brass)">GitHub</a>' : '') + '</p>' + (s.bio ? '<p>' + escapeHtml(s.bio) + '</p>' : '') + '</div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;white-space:nowrap"><span style="font-size:12px;font-family:\'JetBrains Mono\',monospace;color:' + col + '">' + escapeHtml(s.status) + '</span><div style="display:flex;gap:6px">' + actions + '</div></div></div>';
        }).join('');
        listEl.querySelectorAll('button[data-action]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            authedFetch('/api/students/' + encodeURIComponent(btn.dataset.id), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: btn.dataset.action }) })
              .then(function (res) { if (res.ok) loadStudents(); else alert('Could not update student.'); });
          });
        });
      })
      .catch(function () { listEl.innerHTML = '<p class="empty-note">Could not load students.</p>'; });
  }

  // --- Admin projects list ---------------------------------------------
  function loadAdminProjects() {
    var listEl = document.getElementById('adminProjectsList');
    if (!listEl) return;
    authedFetch('/api/projects?admin=1')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var projects = data.projects || [];
        if (!projects.length) { listEl.innerHTML = '<p class="empty-note">No projects submitted yet.</p>'; return; }
        listEl.innerHTML = projects.map(function (p) {
          return '<div class="lead-item"><div><h4>' + escapeHtml(p.title) + '</h4><p>by ' + escapeHtml(p.studentName) + (p.githubUrl ? ' &middot; <a href="' + escapeHtml(p.githubUrl) + '" target="_blank" rel="noopener" style="color:var(--brass)">GitHub</a>' : '') + '</p><p>' + escapeHtml((p.tech || []).join(', ')) + '</p></div><div style="display:flex;gap:6px;flex-shrink:0"><button class="del-btn" style="border-color:#16a34a;color:#16a34a" data-id="' + escapeHtml(p.id) + '" data-action="approve">Approve</button><button class="del-btn" data-id="' + escapeHtml(p.id) + '" data-action="reject">Reject</button></div></div>';
        }).join('');
        listEl.querySelectorAll('button[data-action]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            authedFetch('/api/projects/' + encodeURIComponent(btn.dataset.id), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: btn.dataset.action }) })
              .then(function (res) { if (res.ok) loadAdminProjects(); else alert('Could not update project.'); });
          });
        });
      })
      .catch(function () { listEl.innerHTML = '<p class="empty-note">Could not load projects.</p>'; });
  }

  // --- Reviews list ----------------------------------------------------
  function loadReviews() {
    var listEl = document.getElementById('reviewsList');
    if (!listEl) return;
    authedFetch('/api/reviews?admin=1')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var reviews = data.reviews || [];
        if (!reviews.length) { listEl.innerHTML = '<p class="empty-note">No reviews yet.</p>'; return; }
        listEl.innerHTML = reviews.map(function (r) {
          var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
          return '<div class="lead-item"><div><h4>' + escapeHtml(r.name) + (r.role ? ' <span style="font-weight:400;font-size:13px;color:var(--paper-dim)">— ' + escapeHtml(r.role) + '</span>' : '') + '</h4><p style="color:#f59e0b">' + stars + '</p><p>' + escapeHtml(r.content) + '</p></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;white-space:nowrap"><p style="font-size:12px;color:var(--paper-dim)">' + new Date(r.createdAt).toLocaleDateString() + '</p><div style="display:flex;gap:6px"><button class="del-btn" style="border-color:#16a34a;color:#16a34a" data-id="' + escapeHtml(r.id) + '" data-action="approve">Approve</button><button class="del-btn" data-id="' + escapeHtml(r.id) + '" data-action="reject">Reject</button></div></div></div>';
        }).join('');
        listEl.querySelectorAll('button[data-action]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            authedFetch('/api/reviews/' + encodeURIComponent(btn.dataset.id), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: btn.dataset.action }) })
              .then(function (res) { if (res.ok) loadReviews(); else alert('Could not update review.'); });
          });
        });
      })
      .catch(function () { listEl.innerHTML = '<p class="empty-note">Could not load reviews.</p>'; });
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
