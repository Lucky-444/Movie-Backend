/***SOFTWARE DESIGN PATTERN USED: MVC (MODEL VIEW CONTROLLER) ***/

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


/***PAGINATION : 
we will implement pagination for the GET /mba/api/v1/theaters endpoint to efficiently handle large datasets and improve performance. Pagination allows us to limit the number of records returned in a single response, making it easier for clients to consume the data.
when we google search then we don;t get all results in one page we get some results and then we can go to next page to get more results. we hardly get 9 - 10 results in one page.then we have to click on next page to get more results. this is called pagination.
To implement pagination, we will use query parameters to specify the page number and the number of records per page. The two common parameters used for pagination are:
- page: The current page number (default is 1)
- limit: The number of records to return per page (default is 10)
For example, a request to GET /mba/api/v1/theaters?page=2&limit=5 would return the second page of theaters with 5 theaters per page.
we will modify the GET /mba/api/v1/theaters endpoint to accept these query parameters and adjust the database query accordingly. We will also include metadata in the response to provide information about the total number of records, total pages, current page, and records per page. ****/


/mongoose has a find function which expects a json as input parameters
if object is empty then  {} = returning all data
if {} object is not empty then based on key value pair present in the object 
mongoose does filtration on the database 

the key is generally the attribute name of the document of the collection 
and in value of the pair we put some custom value to it

all those documents with given keys and corresponding values are found and then we return that data 
/

<!-- QUERY PARAMS : -->
for query params we dont need different routes
due to excess amount of combination that may occur
due to query params we can not define so many routes so the query params 
are considered differently and the route will be the route except them 
Query params are NOT part of the route.
there can be many combinations
we can’t create routes for every one of them
Everything after ? is optional filtering, not routing:
All of these hit the same route handler:

We do NOT want to create routes like:

/api/theatres/city/Bhubaneswar
/api/theatres/city/Cuttack/page/2
/api/theatres/page/3/limit/10/sort/name


That becomes messy, hard to maintain, and impossible to scale.

Because filters are:

optional

flexible

combinable

So instead of infinite routes, we have one route + multiple filters.
Query params are not part of the route.
They are used for filtering, sorting, and pagination because there can be many combinations, and creating separate routes for each would be impossible.
The route remains the same — only the query changes.

<!-- End of query params -->


//**AUTHENTICATION AND AUTHORIZATION **//
now after the setup of theatre and Movies resource , we want to start Authentication and Authorization Part 

1.Understand Authentication and Authorization
2.Token Based Authentication

Set Up model for User Collection
Apis For User Registrations (for New Users); 
Api's for User Login (Basic -> Modified -> Token Based Auth);
Secure Storage Of Passwords
Api's for password Reset 

__AUTHORIZATION__ 
Registration & set up of client and Admins 


BOTH Authentication and Authorization are are often USed as conjuction with each Other in terms Of security 
Both Terms are very Different with totally Different Concepts 
The Big Difference Btw Gaining SuccessFull Entrance To a place and WHat you are allowed to do inside To understand the different


__AUTHENTICATION__
It is the process of verifying the identity of a User by obtaining their credentials and Use those to verify the User is valid Or not 
Authentication Always Comes Before Authorization 
We are Already Familier With process of authentication Becoz most of US perform it everyday 
most of the things on internet becomes accessible after authenticating to the app 
How ever once You AUthenticate There are many decision that happens Simultaneously in the backgroud thanks to secret power of Admin 
AUthentication Factors determine the varius elements and system use to verify ones identity and prior to granting Him access


