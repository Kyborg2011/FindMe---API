const supertest = require( 'supertest' );

var server = supertest.agent( 'http://127.0.0.1:8080' );

describe( 'GET /user/:id', () => {
  it( 'returns a user', ( done ) => {
    return server
      .get( '/api/user' )
      .set( 'Accept', 'application/json' )
      .expect( 200, {
        id: '1',
        name: 'John Math'
      }, done );
  });
});
