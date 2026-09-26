import postService from "../services/postService.js";
import userRepository from "../repositories/userRepository.js";

const parseHashtags = (hashtags = "") =>
  hashtags
    .split(",")
    .map((hashtag) => hashtag.trim())
    .filter(Boolean);

const formPost = (body) => ({
  title: body.title,
  content: body.content,
  hashtags: parseHashtags(body.hashtags),
  imageUrl: body.imageUrl,
});

class PostController {

  async create(req, res) {

    try {

      await postService.createPost(req.body.userId, formPost(req.body));

      res.redirect("/posts");

    } catch (error) {

      const users = await userRepository.findAll();

      res.status(400).render("post-form", {
        mode: "create",
        post: req.body,
        users,
        error: `No se pudo crear la publicación: ${error.message}`,
      });

    }

  }

  async getAll(req, res) {

    try {

      const posts = await postService.getPosts();

      res.render("posts", {
        posts
      });

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  }

  async showNew(req, res) {

    try {

      const users = await userRepository.findAll();

      res.render("post-form", {
        mode: "create",
        post: {},
        users,
        error: null,
      });

    } catch (error) {

      res.status(500).render("post-form", {
        mode: "create",
        post: {},
        users: [],
        error: "No fue posible cargar el formulario.",
      });

    }

  }

  async showEdit(req, res) {

    try {

      const post = await postService.getPostById(req.params.id);

      if (!post) {
        throw new Error("Post no encontrado");
      }

      res.render("post-form", {
        mode: "edit",
        post,
        users: [],
        error: null,
      });

    } catch (error) {

      res.status(404).render("post-form", {
        mode: "edit",
        post: {},
        users: [],
        error: "No se encontró la publicación solicitada.",
      });

    }

  }

  async update(req, res) {

    try {

      await postService.updatePost(req.params.id, formPost(req.body));

      res.redirect("/posts");

    } catch (error) {

      const currentPost = await postService.getPostById(req.params.id);

      res.status(400).render("post-form", {
        mode: "edit",
        post: {
          ...req.body,
          _id: req.params.id,
          user: currentPost?.user,
        },
        users: [],
        error: `No se pudo actualizar la publicación: ${error.message}`,
      });

    }

  }

  async delete(req, res) {

    try {

      await postService.deletePost(req.params.id);

      res.redirect("/posts");

    } catch (error) {

      let posts = [];

      try {
        posts = await postService.getPosts();
      } catch (getPostsError) {
        console.error("No fue posible recuperar las publicaciones:", getPostsError.message);
      }

      res.status(404).render("posts", {
        posts,
        error: `No se pudo eliminar la publicación: ${error.message}`,
      });

    }

  }

}

export default new PostController();
