

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




