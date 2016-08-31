import React, { Component } from 'react';
import CommentCount from './CommentCount';
import { connect } from 'react-redux';
import {
  toggleComment,
  fetchCommentsIfNeeded,
} from '../../actions/commentActions';
import DestroyPostButton from './DestroyPostButton';
import EditPost from './../editPost/EditPost';
import styles from './Post.scss';

class Post extends Component {
  constructor() {
    super();
    this.handleShowingChild = this.handleShowingChild.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  };

  handleShowingChild() {
    const { dispatch, id, index } = this.props;
    dispatch(fetchCommentsIfNeeded(id, index));
  }

  handlePrev(e) {
    let newChildId = this.props.childId - 1;

    if (!!~newChildId) {
      const { dispatch, index } = this.props;
      dispatch(toggleComment(index, newChildId));
    }
  };

  handleNext(e) {
    const newChildId = this.props.childId + 1;

    if (newChildId < this.props.comments.length) {
      const { dispatch, index } = this.props;
      dispatch(toggleComment(index, newChildId));
    }
  };

  render() {
    return (
      <div className={styles.post}>

        <div>{this.props.username}</div>
        <div>{this.props.created_at}</div>
        <div>{this.props.realName}</div>
        <DestroyPostButton
          id={this.props.id}
          index={this.props.index}
        />

        <p>{this.props.body}</p>

        <div className='comment-count' onClick={this.handleShowingChild}>
          <CommentCount
            numOfComments={this.props.commentCount}
          />
        </div>
        <EditPost
          id={this.props.id}
          index={this.props.index}
        />
        {
          this.props.showComments &&
          <div className='replies'>
            <span onClick={this.handlePrev}>[ left ] </span>
            <span onClick={this.handleNext}>[ right ]</span>
              <Post
                {...this.props.childContext}
                dispatch={this.props.dispatch}
                isParentPost={false}
                key={this.props.childContext.id}
              />
          </div>
        }
        <hr/>
      </div>
    );
  }
};

Post.propTypes = {
  id: React.PropTypes.number,
  comments: React.PropTypes.arrayOf(React.PropTypes.object),
  showComments: React.PropTypes.bool,
  isParentPost: React.PropTypes.bool,
  realName: React.PropTypes.string,
  username: React.PropTypes.string,
  body: React.PropTypes.string,
  created_at: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  childId: React.PropTypes.number,
  childContext: React.PropTypes.object
};

const mapStateToProps = (state, ownProps) => {

  return {
    showComments: state.postReducer.get('posts').get(ownProps.index).get('showComments'),
    childId: state.postReducer.get('posts').get(ownProps.index).get('childId'),
    childContext: state.postReducer.get('posts').get(ownProps.index).get('childContext'),
  }
};

export default connect(
  mapStateToProps
)(Post);