import Post from "../models/Post.js";

class PostRepository {
  async create(post) {
    return await Post.create(post);
  }

  async findAll() {
    return await Post.find().populate("user");
  }

  async findByUser(userId) {
    return await Post.find({ user: userId }).populate("user");
  }

  async findById(postId) {
    return await Post.findById(postId).populate("user");
  }

  async update(postId, postData) {
    return await Post.findByIdAndUpdate(
      postId,
      {
        ...postData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(postId) {
    return await Post.findByIdAndDelete(postId);
  }
}

export default new PostRepository();
