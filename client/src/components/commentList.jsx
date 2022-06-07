import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(({ id, content, status }) => {
    let msg;

    switch (status) {
      case "pending":
        msg = "This comment is awaiting moderation"; break;
      case "rejected":
        msg = "This comment has been rejected"; break;
      default:
        msg = content;
    }

    return <li key={id}>{msg}</li>
  })

  return <ul>
    {renderedComments}
  </ul>
}

export default CommentList;