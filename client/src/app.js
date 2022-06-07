import React from 'react';

import PostCreate from './components/postCreate';
import PostList from './components/postList';

const App = () => {
  return <div className='container'>
    <h1>Create post</h1>
    <PostCreate />
    <hr />
    <h1>Posts</h1>
    <PostList />
  </div>;
};

export default App;
