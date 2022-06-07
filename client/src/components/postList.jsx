import React, { useState, useEffect } from "react";
import axios from "axios";

import CommentCreate from "./commentCreate";
import CommentList from "./commentList";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://posts.com/posts");
    setPosts(res.data);
  }

  useEffect(() => { fetchData() }, [])

  const renderedPosts = posts.map(({ title, id, comments }) => {
    return <div key={id} className="card" style={{ width: "30%", marginBottom: "20px" }}>
      <div className="card-body">
        <h3>{title}</h3>
        <CommentList comments={comments} />
        <CommentCreate postId={id} />
      </div>
    </div>
  })

  return <div className="d-flex flex-wrap flex-row justify-content-between">
    {renderedPosts}
  </div>
}

export default PostList;