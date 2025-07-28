// A simple array of users with unique IDs
const users = [
    { id: '1', name: 'Alice', email: 'alice@example.com', city: 'New York' },
    { id: '2', name: 'Bob', email: 'bob@example.com', city: 'London' },
    { id: '3', name: 'Charlie', email: 'charlie@example.com', city: 'New York' },
    { id: '4', name: 'David', email: 'david@example.com', city: 'Paris' },
    { id: '5', name: 'Eve', email: 'eve@example.com', city: 'London' },
];

// A simple array of posts
const posts = [
    { id: 'p1', title: 'First Post', content: 'This is the first post content.', authorId: '1' },
    { id: 'p2', title: 'Second Post', content: 'Another post content.', authorId: '2' },
    { id: 'p3', title: 'Third Post', content: 'Content for the third post.', authorId: '1' },
    { id: 'p4', title: 'Fourth Post', content: 'More content here.', authorId: '3' },
];


// Helper function to get an object by its global ID
function getObjectById(id) {
    let obj = users.find(u => u.id === id);
    if (obj) return { ...obj, __typename: 'User' }; 
  
    // Try to find in posts
    obj = posts.find(p => p.id === id);
    if (obj) return { ...obj, __typename: 'Post' }; 

    return null;
}

// Helper to get a user by ID
function getUser(id) {
    return users.find(user => user.id === id);
}

// Helper to get posts by author ID
function getPostsByAuthor(authorId) {
    return posts.filter(post => post.authorId === authorId);
}

module.exports = {
    users,
    posts,
    getObjectById,
    getUser,
    getPostsByAuthor
};
