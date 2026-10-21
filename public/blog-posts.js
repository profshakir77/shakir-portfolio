(function () {
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var section = document.getElementById('dynamic-posts');
  var grid = document.getElementById('dynamicPostsGrid');
  if (!section || !grid) return;

  fetch('/api/posts')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var posts = data.posts || [];
      if (!posts.length) return;

      grid.innerHTML = posts.map(function (post) {
        var cover = post.coverImage
          ? '<div class="blog-card-photo"><img src="' + escapeHtml(post.coverImage) + '" alt="' + escapeHtml(post.title) + '" loading="lazy"></div>'
          : '';
        return (
          '<a class="blog-card" href="post.html?slug=' + encodeURIComponent(post.slug) + '">' +
            cover +
            '<span class="b-tag">' + escapeHtml(post.category) + '</span>' +
            '<h3>' + escapeHtml(post.title) + '</h3>' +
            '<p>' + escapeHtml(post.excerpt) + '</p>' +
            '<span class="blog-readtime">' + escapeHtml(post.readTime || '') + '</span>' +
          '</a>'
        );
      }).join('');

      section.hidden = false;
    })
    .catch(function () {
      // Silently do nothing -- the static 20-article grid above still works fine.
    });
})();
