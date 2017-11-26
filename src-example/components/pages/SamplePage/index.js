import React from 'react'

import { PageTemplate, Header, Footer } from 'components'
import { PostForm, PostList } from 'containers'

const SamplePage = () => {
  return (
    <PageTemplate header={<Header />} footer={<Footer />}>
      <PostForm />
      <PostList limit={5} listId="1" />
      <PostList limit={5} listId="2" />
    </PageTemplate>
  )
}

export default SamplePage
