require('dotenv').config(); 
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema'); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); 

// GraphQL endpoint
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        graphiql: true, 
    })
);

app.listen(PORT, () => {
    console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
});
