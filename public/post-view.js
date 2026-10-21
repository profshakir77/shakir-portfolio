(function () {
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderBody(content) {
    // Plain-text paragraphs (separated by blank lines) -> safe <p> tags.
    return content
      .split(/\n{2,}/)
      .map(function (para) { return para.trim(); })
      .filter(Boolean)
      .map(function (para) { return '<p>' + escapeHtml(para).replace(/\n/g, '<br>') + '</p>'; })
      .join('\n');
  }

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');

  var titleEl = document.getElementById('postTitle');
  var bodyEl = document.getElementById('postBody');
  var notFoundEl = document.getElementById('postNotFound');
  var categoryEl = document.getElementById('postCategory');
  var categoryBadgeEl = document.getElementById('postCategoryBadge');
  var readTimeEl = document.getElementById('postReadTime');
  var coverWrap = document.getElementById('postCoverWrap');
  var coverImg = document.getElementById('postCoverImg');

  function showNotFound() {
    titleEl.textContent = 'Post not found';
    bodyEl.hidden = true;
    notFoundEl.hidden = false;
    categoryEl.textContent = '?';
    categoryBadgeEl.textContent = '?';
  }

  if (!slug) {
    showNotFound();
    return;
  }

  fetch('/api/posts/' + encodeURIComponent(slug))
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(function (data) {
      var post = data.post;
      if (!post) throw new Error('not found');

      document.title = post.title + ' | Shakir Hussain';
      var desc = document.getElementById('pageDescription');
      if (desc) desc.setAttribute('content', post.excerpt || '');

      titleEl.textContent = post.title;
      categoryEl.textContent = post.category;
      categoryBadgeEl.textContent = post.category;
      readTimeEl.textContent = post.readTime || '';
      bodyEl.innerHTML = renderBody(post.content);

      if (post.coverImage) {
        coverImg.src = post.coverImage;
        coverImg.alt = post.title;
        coverWrap.hidden = false;
      }
    })
    .catch(function () {
      showNotFound();
    });
})();
