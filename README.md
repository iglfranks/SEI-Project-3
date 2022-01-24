# Museum Mapper, group project of 4 - 8 days

[Link to deployed version](https://if-museum-mapper.herokuapp.com/)

## Overview

My third project with General Assembly was to create a full-stack application using React and Mongo-DB, creating a working Express API. I was assigned into a group of 4, giving us the ability to increase the ambition and size of the project with more components as well as a large database size.

After discussing our group's interests, we landed on creating an API of natural history museums within England, and an app that allows a user to decide on museums to visit based on collections and location. 

![homepage](https://i.ibb.co/d2PDbCg/Screenshot-2022-01-24-at-13-57-42.png)



## Brief

- Build a full-stack application.
- Use an Express API.
- Consume your API with a separate React front-end.
- Be a complete product - multiple relationships and CRUD functionality.
- Implement thoughtful user stories/wireframes.
- Have visually impressive design.
- Be deployed online.

## Technologies used

- React/JavaScript
- HTML5
- CSS
- Bulma
- Express
- Mongoose
- JWT (json web token)
- Axios
- B-Crypt
- React-carousel-minimal
- React-router-dom
- React-star-ratings
- React-map-gl
- Insomnia
- Git/GitHub
- Yarn

## Getting started

1. After downloading and opening the code, open two terminals.
2. In one, run ‘front-end’ to enter the front-end.
3. Enter ‘yarn’ in both terminals to install all dependencies. 
4. In the back-end terminal, run ‘yarn seed’ to seed all data, then run ‘yarn serve’.
5. In the front-end terminal, run ‘yarn start’ to run the server.
6. Go to ‘localhost:3000’ in the browser to go to the running website.
7. Use username ‘admin59’ and password ‘admin59’ to login, as there is currently a bug with creating a new account.

## Planning

We began the planning process as a group, writing out plans for the back-end and front-end separately. Over Zoom calls we discussed front-end components and information that would be available on each one. When planning back-end, we defined routes and end-points, as well as creating templates for how the different models would look.

[Link to plan document](https://docs.google.com/document/d/1vmoCLMmk6y35XjgKDSoQSBKQ76i4u-jTM5_xHKJjBoY/edit)

In order to efficiently create the models, we needed to define the relationships we would have between different models first:

The user’s ‘favourites’ would have a reference relationship to the museum schema, as the user models should be populated with the data of the museums they add to their list.
The review model would be an embedded relationship, as it is embedded within the museum schema.
Each review can have an ‘owner’ which is a reference relationship to the user model.

We concluded the planning discussions with list of all of the fundamental components we would create for the project:

- Home
- Register
- Login
- Map
- Museum Index
- Museum Show (individual museum)
- Navbar
- Footer
- Profile (wishlist)

## Wireframes

![wireframes](https://i.ibb.co/Jrr1fss/Screenshot-2022-01-24-at-14-00-19.png)




## Back-end coding

Creating the back-end using Express and Mongoose required a lot of boilerplate code that our class had recently learnt, therefore our group thought it was most useful to ‘pair-code’, with one person reading instructions and another coding. We alternated the roles in order to give everyone in the group a good learning experience. 

We created the museum schema with multiple different key value pairs and then separately created at least 5 different museums to add to the database, using a wikipedia list to research from. The user schema was created with standard values (email, username, password) as its main use in context of the app was allowing users to favourite different museums. A virtual field for password confirmation was also added, as well as hashing the passwords using B-Crypt.

```javascript
const museumSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  address: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  date_established: { type: Number, required: true },
  description: { type: String, required: true, maxlength: 5000 },
  collection_types: [{ type: String, required: true }],
  exhibits_name: { type: String, required: false },
  exhibits_image: { type: String, required: false },
  exhibits_description: { type: String, required: false },
  website: { type: String, required: true },
  multiple_images: [{ type: String, required: false }],
  location_id: { type: Number, required: false, unique: true },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  reviews: [reviewSchema]
})

```

```javascript
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.ObjectId, ref: 'Museum', required: false, unique: false }]
})

```





## Delegation of front-end components

With the large scope of the front-end, we assigned different components to individual members of the group so we could all come together after 2-3 days of coding to put together the application. At the end of each day, the group would join a call where we would methodically push and pull down the code on our branches to fix merge conflicts and make sure the correct versions of code were on all of our computers before beginning the next day. 

After delegating the work, I chose to create:

- Museum Index
- Museum Show
- Reviews
- Profile/Adding to favourites

## User story 

The user can access a list of all museums in the database from the ‘All Museums’ tab (museum index), and from there can select one to be redirected to it’s individual ‘museum show’ page.

![index](https://i.ibb.co/mF49C49/Screenshot-2022-01-24-at-14-03-47.png)

![museum show](https://i.ibb.co/3C8J4gN/Screenshot-2022-01-24-at-14-04-27.png)


After logging in (use the details listed in ‘Getting Started’ to bypass the registering bug), the user has the ability to create reviews and add favourites. The option to delete a review is only visible if the user that is logged in is the creator of the review.

![reviews](https://i.ibb.co/NWCkfV8/Screenshot-2022-01-24-at-14-05-28.png)



I also added the ‘react-star-ratings’ package, which uses the average rating that is generated in the back-end and creates a more user-friendly interface for displaying the average rating of the museum.

![ratings](https://i.ibb.co/GRZhqR4/Screenshot-2022-01-24-at-14-06-19.png)



Clicking the bookmark symbol on a museum also adds it to the user’s favourites which they can then view on their profile page.

![favourites](https://i.ibb.co/1Z4pq8X/Screenshot-2022-01-24-at-14-07-06.png)







## Featured section of code

The back-end is where the average rating of the museum is generated, taking in the ratings that a user sends in the post request when posting a review.

```javascript
// Virtual Getter: virtual field added to object before it is set to json
museumSchema.virtual('averageRating')
  .get(function () {
    // if there are no comments return a string
    if (!this.reviews.length) return 'Not Reviewed'
    // iterate through reviews, add up all ratings
    const sumOfRatings = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    // return average of ratings to 2 dp
    return (sumOfRatings / this.reviews.length).toFixed(2)
  })

```


However, this function returned a string when no reviews had been added, therefore breaking the star-rating package code which required a number. I fixed this in the front-end, rather than simply changing it in the function above, to test my ability in creating logic to work around core functions in the back-end which can also create unwanted errors.

```javascript

useEffect(() => {
    const getRating = () => {
      if (!museum) return
      if (isNaN(museum.averageRating)) setAvgRat(0)
      else setAvgRat(museum.averageRating)
    }
    getRating()

  }, [museum])

```



## Known bugs

- Registering a new user seems to not work due to errors with the compatibility of the ‘favourites’ relationship, giving an error code 11000.
- Duplicates can be added to the wishlist. This could have been fixed with more time to refine the project. 
- Visual bugs when decreasing browser size, as mobile compatibility could have been refined more with time. 

## Future features

- Make the styling of the museum cards on the index page more consistent between different museums.
- Adding better mobile compatibility
- Add functionality to keep the bookmark symbol checked on museums the user has favourited, and being able to ‘un-favourite’ them from deselecting the button.

## Challenges

This project led me to tackle an uphill battle of relationships, learning about how they function fundamentally and deciding which types of relationships are most suitable for different situations. I spent a long time figuring out how to populate the user with their favourites and discovered I was having issues with the syntax of the function as well as in the back-end.

## Wins and take-aways

- I gained a greater understanding of relationships due to my struggles with formatting them correctly, and I was able to have more confidence going into the final project because of it. 
- I enjoyed the process of refactoring the code and deciding which sections of the individual museum page could be separated into new components, as shown with the reviews, the add review form, and the adding the favourites function.
- I had a lot of experience with using different packages such as react-star-ratings as well as helping one of my group members with the ‘Carousel’ package. Subsequently, I gained more experience in reading documentation of external dependencies and using them to tweak components to improve them.
