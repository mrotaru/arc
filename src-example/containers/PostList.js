import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isPending, hasFailed } from 'redux-saga-thunk'
import { fromEntities, fromResource } from 'store/selectors'
import { resourceListReadRequest, resourceDetailReadRequest } from 'store/actions'

import { PostList } from 'components'

class PostListContainer extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    limit: PropTypes.number,
    loading: PropTypes.bool,
    failed: PropTypes.bool,
    readList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    limit: 20,
  }

  componentWillMount() {
    this.props.readList()
  }

  render() {
    const { list, loading, failed } = this.props
    return <PostList {...{ list, loading, failed }} />
  }
}

const postId = 1
const commentId = 20

const mapStateToProps = state => ({
  list: fromEntities.getList(state, 'comments', fromResource.getList(state, 'comments', { postId })),
  loading: isPending(state, 'commentListRead'),
  failed: hasFailed(state, 'commentListRead'),
})

const mapDispatchToProps = (dispatch, { limit }) => ({
  readList: () => dispatch(resourceListReadRequest('comments', { _limit: limit }, { postId })),
  readDetail: () => dispatch(resourceDetailReadRequest('comments', commentId))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostListContainer)
