export const nestComments = (comments) => {
    const map = new Map(comments.map(c => [c.id, { ...c, replies: [] }]));
    const nested = [];
  
    comments.forEach((comment) => {
      if (comment.parentId && map.has(comment.parentId)) {
        map.get(comment.parentId).replies.push(map.get(comment.id));
      } else {
        nested.push(map.get(comment.id));
      }
    });
  
    return nested;
  };
  