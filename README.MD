

/***For Theater Backend ***/
setUp schema and model for Theaters with fields:

we will decipher our business logic and requirements to create a comprehensive schema for Theaters in our Movie Backend application. The Theater schema will include the following fields:

after that we will setUp model , service, controller and routes for Theater entity with full CRUD operations and validation middlewares.

we need to write APIS 
//must authorize all the APIs using JWT token and role based access control (RBAC) for admin and user roles 
1. Create Theater
2. Get Theater by ID
3. Update Theater by ID
4. Delete Theater by ID
5. Get Theaters with Query Filters (like location, name, etc.)

//API looks Like below
POST /mba/api/v1/theaters : Create Theater
GET /mba/api/v1/theaters?location=xyz&name=abc : Get Theaters with Query Filters
PUT /mba/api/v1/theaters/:id : Update Theater by ID
GET /mba/api/v1/theaters/:id : Get Theater by ID
DELETE /mba/api/v1/theaters/:id : Delete Theater by ID
Make sure to include proper error handling, input validation, and response formatting in each layer of the application.

SCHEMA FIELDS:
- name: String (required)
- location: String (required)
- numberOfScreens: Number (required)
- amenities: [String] (optional, e.g., ["3D", "IMAX", "Dolby Atmos"])
- createdAt: Date (default to current date)
- updatedAt: Date (default to current date)
- movies : [ObjectId] (references to Movie model, optional)
- owner: ObjectId (reference to User model, required)


/***main important ***/
we will try to create association between Theater and Movie models such that each Theater can have multiple Movies associated with it. This will allow us to efficiently manage and query the movies being shown in each theater.

and we will create an endpoint to fetch all movies being shown in a specific theater.
and all the theatres running that movies

we intend to set a relationship between the Theater and Movie models using Mongoose's referencing system. This association will enable us to link multiple movies to a single theater, facilitating efficient data retrieval and management.

A theatre has many movies 

we wll create meaning full endpoints from users prospective
then we will create some endpoints that will used by admin to manage the association between theaters and movies.

APIS are like below
1. GET /mba/api/v1/theatres/:id/movies : Fetch all movies being shown in a specific theater.
2. GET /mba/api/v1/movies/:id/theatres : Fetch all theatres running a specific movie.
3. PUT /mba/api/v1/theatres/:id : Update theater details including the list of movies being shown. or add new movies to the theater's movie list.
4. DELETE /mba/api/v1/theatres/:theatreId/movies/:movieId : Remove a specific movie from a theater's list of movies.
5. GET /mba/api/v1/theatres/:id/movies/:id : Fetch details of a specific movie being shown in a specific theater.


/***concept of database references and associations in MongoDB using Mongoose. In this case, we are establishing a one-to-many relationship between Theatres and Movies, where a single Theatre can have multiple Movies associated with it. This is achieved through the use of ObjectId references in the Theatre schema. and that single movie can will be running in multiple theaters also ***/

/*** this is the association we will create ***/




