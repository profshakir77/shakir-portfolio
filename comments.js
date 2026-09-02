(function () {
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(ts) {
    try { return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return ''; }
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');
  if (!slug) return;

  var listEl = document.getElementById('commentsList');
  var formEl = document.getElementById('commentForm');
  var statusEl = document.getElementById('commentStatus');

  // Load comments
  function loadComments() {
    fetch('/api/comments/' + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var comments = data.comments || [];
        if (!comments.length) {
          listEl.innerHTML = '<p style="color:var(--text-muted,#94a3b8);font-size:14px;">No comments yet. Be the first to share your thoughts.</p>';
          return;
        }
        listEl.innerHTML = comments.map(function (c) {
          return (
            '<div style="border-top:1px solid var(--line,#e2e8f0);padding:16px 0;">' +
              '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">' +
                '<strong style="font-size:14px;">' + esc(c.name) + '</strong>' +
                '<span style="font-size:12px;color:var(--text-muted,#94a3b8);">' + formatDate(c.createdAt) + '</span>' +
              '</div>' +
              '<p style="font-size:14px;line-height:1.6;margin:0;">' + esc(c.content).replace(/\n/g, '<br>') + '</p>' +
            '</div>'
          );
        }).join('');
      })
      .catch(function () {
        listEl.innerHTML = '<p style="color:var(--text-muted,#94a3b8);font-size:14px;">Could not load comments.</p>';
      });
  }

  loadComments();

  // Post a comment
  if (!formEl) return;
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('commentBtn');
    var name = document.getElementById('commentName').value.trim();
    var content = document.getElementById('commentContent').value.trim();

    if (!name) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'Please enter your name.'; return; }
    if (!content || content.length < 3) { statusEl.style.color = '#ef4444'; statusEl.textContent = 'Comment is too short.'; return; }

    btn.disabled = true;
    btn.textContent = 'Posting...';
    statusEl.textContent = '';

    fetch('/api/comments/' + encodeURIComponent(slug), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, content: content }),
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          statusEl.style.color = '#16a34a';
          statusEl.textContent = 'Comment posted!';
          formEl.reset();
          loadComments();
        } else {
          statusEl.style.color = '#ef4444';
          statusEl.textContent = res.d.error || 'Could not post comment.';
        }
      })
      .catch(function () {
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Could not reach the server.';
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Post comment';
      });
  });
})();
