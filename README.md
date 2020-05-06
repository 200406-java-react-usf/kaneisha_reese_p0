# kaneisha_reese_p0
# Project 0
## Summary
Project 0 will build an API representing a Pet Grooming Salon. The Salon will have Animals, Groomers, and Services. The animals will be assigned an id, name, weight, groomerId, status (determines if the animal has been serviced), and size (which is determined by the animal's weight). The animal will also have a list of services associated with their id. Services have a name, id, cost and time. The cost and time associated with a service are dependent on the animal's size. Groomers have an id, first and last name, hours worked and earnings. Groomers will be assigned animals to service and their hours and earning will update to reflect this. 

When an animal is added to the database, the groomerId assigned to the animal is chosen by selecting the groomer's id with the least hours. The groomers hours and earning are then updated based on the services assigned to the added animal.
<img src="images/Project0ERD.jpg">


## Instructions
For Project 0, you will be building a RESTful API using TypeScript and Express. Associates are allowed to come up with their own API idea, but it must be approved by the trainer; suggested ideas are provided below.

Suggestions: 
- resource management system API
- learning management system API
- any kind of social media API
- mobile banking application API

## Features
- [ ] RESTful API (At least Level 2 of the [Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html))
- [ ] Documentation (all methods have basic documentation)
- [ ] Unit testing (>= 80% coverage)
- [ ] SQL Data Persistance (at least 3 tables; all 3NF)
- [ ] Logging (extra)
- [ ] Authentication/Authorization (extra)

## Tech Stack
- [ ] TypeScript
- [ ] PostGreSQL
- [ ] node-postgre
- [ ] Express
- [ ] Jest
- [ ] Git SCM (on GitHub)

## Init Instructions
- Select a project idea and submit it to trainer for approval. Be sure to include:
  - The 3 data entities that you will be persisting
  - Any external APIs that you will be using (not required if none are used)
- Once approved, create a new repository within this organization (naming convention: `firstname_lastname_p0`)

## Presentation
- [ ] 5 minute live demonstration of endpoint consumption using Postman
