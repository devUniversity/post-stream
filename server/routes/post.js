'use strict';

const express = require('express');
const router = express.Router();
const db = require('./../models');
const User = db.User;
const Post = db.Post;
const Comment = db.Comment;

const exists = (req) => {
  if (typeof parseInt(req.params.id) === 'number') {
    Post.findById(req.params.id)
      .then((post) => {
        if (post) {
          return true;
        };
        return false;
      })
      .catch((err) => {
        return false;
      })
  } else {
    return false;
  }
};

router.route('/')
  // GET all of the posts
  .get((req, res) => {
    Post.findAll({
      limit: 10,
      order: [
        ['createdAt', 'DESC']
      ],
      include: [{
        model: User
      }]
    })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res.json({ error: err });
    });
  })

router.route('/:id')
  // GET one post by ID
  .get((req, res) => {
    if(exists) {
      Post.findOne({
        id: req.params.id
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  })
  // DELETE post from database by ID
  .delete((req, res) => {
    if(exists) {
      Post.destroy({
        where : {
          id : req.params.id
        }
      })
      .then((data) => {
        res.json({ success: true });
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  });

router.route('/:id/edit')
  // find by id and update the post
  .put((req, res) => {
    if(exists) {
      Post.findById(req.params.id)
      .then((foundPost) => {
        // then update
        foundPost.update({
          body : req.body.body,
        })
        .then((newPost) => {
          res.json(newPost);
        })
        .catch((err) => {
          res.json({ error: err });
        })
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  })

router.route('/new')
  // create a new post
  // TODO - updated user when AUTH is working
  .post((req, res) => {
    Post.create({
      body: req.body.body,
      UserId: req.user
    })
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json({ error: err });
    })
  })

// Commments on a Post
router.route('/:id/comments')
  // GETs the comments on a post
  .get((req, res) => {
    Comment.findAll({
      hierarchy: true,
      where: {
        PostId : req.params.id
      }
    })
    .then((comments) => {
      res.json(comments);
    })
  })

router.route('/:PostId/comments/:CommentId/new')
  // create a new comment on a post
  .post((req, res) => {
    let parentId = null;
    if(req.params.CommentId != 0){
      parentId = req.params.CommentId;
    }
    Comment.create({
      body: req.body.body,
      PostId: req.params.PostId,
      UserId: req.user,
      parentId
    })
    .then((comment) => {
      res.json(comment);

      Post.findById(req.params.PostId)
      .then((foundPost) => {
        // then update
        foundPost.update({
          commentCount : ++foundPost.commentCount,
        })
        .catch((err) => {
          console.error(err)
        })
      })
    })
    .catch((err) => {
      res.json({ error: err });
    })
  })

router.route('/:PostId/comments/:CommentId/edit')
  // find comment by id and update the comment
  .put((req, res) => {
    if(exists) {
      Comment.findById(req.params.CommentId)
      .then((foundComment) => {
        // then update
        foundComment.update({
          body : req.body.body,
        })
        .then((updatedComment) => {
          res.json(updatedComment);
        })
        .catch((err) => {
          res.json({ error: err });
        })
      })
      .catch((err) => {
        res.json({ error: err });
      })
    } else {
      res.json({ success: false });
    }
  })
module.exports = router;
