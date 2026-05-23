# multi-vendor-backend
Backend Application Code for Multi-Vendor Web Application.
Implemnting Access and Refresh tokens.
Current Version: 4.2.1
------------------------------------------------------
Implemented Swagger for API Documentation.
On deleting Product, it removes the product at Cart too.
at this Version: 4.2.0
------------------------------------------------------
Added start for executing application.
Altered Cart Routes.
Installed eslint, prettier, nodemon development dependent libraries.
at this Version: 4.1.1
------------------------------------------------------
Altered Cart Controller for Cart Total Price.
at this Version: 4.1.0
------------------------------------------------------
Modified Store deletion functionality.
Added error stack trace at error middleware.
Replaced new: true to returnDocument: "after" on Updating API's.
at this Version: 4.0.9
------------------------------------------------------
On Store deletion, removed it's related Products, Orders and Cart Items.
at this Version: 4.0.8
------------------------------------------------------
Response Messages are updated.
at this Version: 4.0.7
------------------------------------------------------
Added validateToken middleware to the getOrderById for both customer & vendor functionality.
Populated store details for the product at getStoreDetailsById functionality.
Populated store & Owner details for the product at listProducts, listCustomerOrders, getOrderById, getCart functionalities.
Selling Price is added to create and update order, addToCart functionalities. 
at this Version 4.0.6
------------------------------------------------------
Added Profile Image, Gender fields at User model.
Altered user object at validateToken middleware functionality at authMiddleware.
Altered user object at Login & Signup functionalities at authController.
Added Store Image, Store Discount fields at Store model.
On deleting Store, the Store related Products are also gets deleted.
Altered store object at Creation & Updation at Store controller.
Altered product object at Creation & Updation at Product controller.
Modified price to selling price at calculating the cart items price.
Populated Store details of the Product at get cart items functionality.
Modified Selling Price to the Order functionality. 
Populated Store details of the Product at Order functionalities.
Added Selling Price virtual field and Product Discount field at Product model.
at this Version 4.0.5
------------------------------------------------------
Altered Orders Routes, modified dev script at package.json.
Populated Store and User details at Store & Vendor Order APIs.
Altered Canceled option at Status Enum in Order model.
at this Version 4.0.4
------------------------------------------------------
Altered Cart Functionalities on Decreasing or Removing Product. 
at this Version 4.0.3
------------------------------------------------------
Implemented Product Details while fetching Store Details.
at this Version 4.0.2
------------------------------------------------------
Implemented fetch user details function.
at this version 4.0.1
------------------------------------------------------
Implemented Order Module for creating, edit or remove Order by Customer.
Vendor can update the order either deliver or cancell the order.
Need to test the Order API Calls.
at this version 4.0.0
------------------------------------------------------
Implemented Product Module for creating, updating and deleting products if the user is a vendor of that particular store.
Also implemented fetching products irrespective of the user authentication.
at this version 3.0.0
------------------------------------------------------
Implemented Store Module for creating, updating and deleting stores if the user is a vendor.
To update, delete or fetch details of the store, only particular vendor who created the store can be able to operate these functionalities.
at this version 2.0.0
------------------------------------------------------
Installed jsonwebtoken library for generating token on successful register and login.
Added Error Handler function, incase of errors this function handles.
at this version 1.2.2
------------------------------------------------------
Emptied the .env file
at this version 1.2.1
------------------------------------------------------
Added mongo database configuration on installing mongoose library.
Added User model on having blueprint for User Data.
Added bcryptjs library for hashing passwords.
Implemented Login functionality.
at this version 1.2.0
------------------------------------------------------
Added Routes and Controllers into the Source folder.
Basic Server is being present at this version 1.1.1
------------------------------------------------------
Added cors package for accepting requests from the other port.
Added Routes and Controllers for the Login API Call.
Added .env file, please do add your values at the file.
Basic Server is being present at this version 1.0.0
------------------------------------------------------