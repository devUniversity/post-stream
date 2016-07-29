import React, { Component } from 'react';
import CommentCount from './CommentCount';

class Post extends Component {
  constructor() {
    super();

    this.state = {
      showComments: false
    };

    this.togglePostComments = this.togglePostComments.bind(this);
  }

  togglePostComments() {
    console.log('togglePostComments triggered');

    if (this.props.comments.length) {
      this.setState({showComments: !this.state.showComments});
    }
  }

  render() {
    return (
      <div className="post">
        <header>
          <span>{this.props.real_name}</span>
          <span>{this.props.username}</span>
          <span>{this.props.created_at}</span>
        </header>
        <p>{this.props.body}</p>
        <div className="comment-count" onClick={this.togglePostComments}>
          <CommentCount
            numOfComments={this.props.comments.length}
            togglePostComments={this.toggleComments}
          />
        </div>
        {this.state.showComments ? 'showing comments': null }
      </div>
    );
  }
};

export default Post;