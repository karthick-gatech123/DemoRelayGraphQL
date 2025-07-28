const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

async function sendGraphQLQuery(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
            return { errors: data.errors };
        }
        return data;
    } catch (error) {
        console.error('Network or GraphQL error:', error);
        return { errors: [{ message: error.message }] };
    }
}

document.getElementById('queryViewerBtn').addEventListener('click', async () => {
    const query = `
        query GetViewerData {
            viewer {
                id
                name
                email
                city
                posts(first: 2) { # Requesting first 2 posts
                    edges {
                        node {
                            id
                            title
                            content
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    totalCount
                }
            }
        }
    `;

    document.getElementById('viewerResult').textContent = 'Loading...';
    const result = await sendGraphQLQuery(query);
    document.getElementById('viewerResult').textContent = JSON.stringify(result, null, 2);
});

// --- Query Node by Global ID (Relay Refetching) ---
document.getElementById('queryNodeBtn').addEventListener('click', async () => {
    const nodeIdInput = document.getElementById('nodeIdInput').value;
    const query = `
        query GetNodeById($id: ID!) {
            node(id: $id) {
                id
                # Using GraphQL fragments to conditionally get fields based on type
                ... on User {
                    name
                    email
                    city
                }
                ... on Post {
                    title
                    content
                }
            }
        }
    `;
    const variables = { id: nodeIdInput };

    document.getElementById('nodeResult').textContent = 'Loading...';
    const result = await sendGraphQLQuery(query, variables);
    document.getElementById('nodeResult').textContent = JSON.stringify(result, null, 2);
});

document.getElementById('queryUsersBtn').addEventListener('click', async () => {
    const query = `
        query GetAllUsers {
            allUsers {
                id
                name
                email
            }
        }
    `;

    document.getElementById('usersResult').textContent = 'Loading...';
    const result = await sendGraphQLQuery(query);
    document.getElementById('usersResult').textContent = JSON.stringify(result, null, 2);
});
