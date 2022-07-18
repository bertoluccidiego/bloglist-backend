function dummy(blogs) {
  return 1;
}

function totalLikes(blogs) {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

function favoriteBlog(blogs) {
  return blogs.reduce(
    (favBlog, currBlog) =>
      currBlog.likes > favBlog.likes ? currBlog : favBlog,
    { likes: 0 }
  );
}

function mostBlogs(blogs) {
  let blogsByAuthor = [];
  blogs.forEach((blog) => {
    const foundObj = blogsByAuthor.find((b) => b.author === blog.author);
    if (foundObj) {
      blogsByAuthor = blogsByAuthor.map((b) =>
        b.author === foundObj.author
          ? { author: b.author, blogs: b.blogs + 1 }
          : b
      );
    } else {
      blogsByAuthor = blogsByAuthor.concat({ author: blog.author, blogs: 1 });
    }
  });

  return blogsByAuthor.reduce((mostBlogsAuthor, author) =>
    mostBlogsAuthor.blogs < author.blogs ? author : mostBlogsAuthor
  );
}

function mostLikes(blogs) {
  let likesByAuthor = [];
  blogs.forEach((blog) => {
    const foundObj = likesByAuthor.find((b) => b.author === blog.author);
    if (foundObj) {
      likesByAuthor = likesByAuthor.map((b) =>
        b.author === foundObj.author
          ? { author: b.author, likes: b.likes + blog.likes }
          : b
      );
    } else {
      likesByAuthor = likesByAuthor.concat({
        author: blog.author,
        likes: blog.likes,
      });
    }
  });

  return likesByAuthor.reduce((mostLikesAuthor, author) =>
    mostLikesAuthor.likes < author.likes ? author : mostLikesAuthor
  );
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
