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




## The Build: Back-end

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

After delegating the work, I was assigned to the following tasks:

- Museum Index
- Museum Show
- Reviews
- Profile/Adding to favourites

## The Build: Front-end

NB: Code in different components was re-written to add in the feature of a 'filtered results', a component built by one of my partners in the group. 

The first component I built was the museum index, the page displaying all of the museums in the database. Using the 'museums' route we had established in the back-end, I used axios and an API request to set a piece of state with all the museums, as well as sorting them by alphabetical order. This is then mapped through and displayed in the form of a 'museum card', with each having the option to be clicked to lead to the page of the individual museum. The 'museum card' was refactored into a separate component to keep the code organised

```javascript
useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/museums')
        data.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          } else if (a.name > b.name) {
            return 1
          } else {
            return 0
          }
        })
        setMuseums(data)
        setFilteredMuseums(data)
      } catch (err) {
        setHasError(true)
      }
    }
    getData()
  }, [])
```
```javascript
{filteredMuseums.map(museum => {
  return (
    <div key={museum._id} className='column is-one-quarter-desktop animate__animated animate__faster museumCard'>
      <MuseumCard key={museum._id} {...museum} />
    </div>
  )
})}
```

```javascript
const MuseumCard = ({ _id, name, image, region }) => {

  return (

    <div className='card'>
      <div className='card-header is-flex is-align-items-center'>
        <div className='card-header-title cardTitle is-size-7'>{name}</div>
        <AddingDeletingToFavourites id={_id} />
      </div>
      <Link to={`/museums/${_id}`}>
        <div className='card-image'>
          <figure className='image is-1'>
            <img src={image} alt={`Picture of ${name}`} />
          </figure>
        </div>
        <div className='card-content p-2'>
          <h4 className='is-size-7 cardRegion'>{region}</h4>
        </div>
      </Link>
    </div>

  )

}
export default MuseumCard
```

I then created the 'museum show' component, displaying the information of each individual museum, accessing it through a targeted API request of the museum's ID which was passed into the component using react-router-dom's ```useParams()``` feature. I split the page into separate sections. using Bulma and CSS styling to efficiently organise them. As a group, we tried to use as little CSS styling as possible and try to work within Bulma's styling that comes as a default with different tags, using the documentation as a guidance.

```javascript
useEffect(() => {
  const getData = async () => {
    try {
      const { data } = await axios.get(`/api/museums/${id}`)
      setMuseum(data)
    } catch (err) {
      setHasError(true)
    }
  }
  getData()
}, [id])
```
The page also has a bookmark button for adding a museum to their favourites, the functions of which are in a separate component which makes a post request to the specific user's favourites schema. The ID of the user is required for this request, which is gained through accessing the token of the user logged in and setting a piece of state to their ID.

```javascript
const addMuseumToFaves = async () => {
  try {
    await axios.post(
      `/api/profile/${userId}/favourites`,
      {
        favourites: `${id}`
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
  } catch (err) {
    console.log(err)
  }
}
```

After displaying all of the museums information, I created the functionality of creating and deleting reviews, using post and delete CRUD requests. This involved uswing the relationship between the review schema and the museum itself. I separated the displaying of the reviews into a 'reviews list' component, which contained the functions necessary for acquring the token of the user logged in so the browser can assess whether or not the user has the ability to leave a review. This is also for cross referencing the ID of the logged in user and the ID of the user who left a review so the page can render the 'delete' button if they match. A map function on the original museum page uses dot notation to access the 'reviews' element from the API request and map into the 'reviews list' component, displaying the rating, comment and creator. The button to create a review is also different if a user isn't logged in, rendering as a sign to tell the user to create and account and log in to be able to gain this ability.

```javascript
{museum.reviews.map(review => {
  return (
    <ReviewsList key={review._id} {...review} />
  )
})}
```
```javascript
return (
    <li key={props._id}>
      <div id='single-review-card' className='card p-3 m-1'>
        <div className='columns'>
          <div className='column is-four-fifths'>
            <p>{props.comment}</p>
          </div>
          <div className='column is-flex is-flex-direction-row-reverse'>
            <p>{props.rating}/5</p>
          </div>
        </div>
        <div className='is-flex is-flex-direction-row-reverse is-justify-content-space-between reviewOwner'>
          <div>
            {(props.owner._id === userId) ? <button className='button is-rounded has-background-danger has-text-white has-text-weight-bold' id={props._id} onClick=             {handleDelete}>X</button> : <div></div>}
          </div>
          <div>
            <p className='is-size-7'>- {props.owner.username}</p>
          </div> 
        </div>
      </div>
    </li>
  )
}
export default ReviewsList
```
I created the form for leaving a review as another component, containing a rating and comment text box. A post request creates the review, posting the form data that the user adds which uses pieces of state that are updated with the information as a result of a function which is called as the user types. A separate state for errors is also defined as a boolean which changes to true if a comment is too long or a rating isn't between 1-5.

```javascript
const handleChange = (event) => {
  const newFormData = { ...formData, [event.target.name]: event.target.value }
  setFormData(newFormData)
}
```
When a logged in user clicks the button the post the review, the API post request takes the token acquired from the prior functions that were called when the page was loaded and uses it in the headers to tell the API the user is authenticated as well as create the review with the information of the owner within itself. This same logic is also used for the function to delete a review, an option only availible when the logged in user matches the owner of a review. 

```javascript
const handleSubmit = async (event) => {
  event.preventDefault()
  try {
    await axios.post(
      `/api/museums/${id}/reviews`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    window.location.reload()
  } catch (err) {
    console.log(err)

    if (formData.rating > 5) {
      setRatingError(true)
    }

    if (formData.comment.length > 500) {
      setCommentError(true)
    }

  }
}
```
```javascript
const handleDelete = async (event) => {
  try {
    axios.delete(
      `/api/museums/${id}/reviews/${event.target.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    window.location.reload()
  } catch (err) {
    console.log(err)
  }
}
```
The final component I built out was the profile page, specifically the displaying of all the museums that a user has added to their favourites list. This similarly uses the token of the user to make a get request to the profiles in the API, specifying the user by adding the token in the headers as authorization. After a piece of state is set with the user's information, including their favourites list, a map function displays them all using the same museum card component used and refactored from the museum index page.

```javascript
if (!token) return
  const { data } = await axios.get(
    '/api/profile',
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  setUser(data.favourites)
  setUserId(data._id)
```

```javascript
{user.map(museum => {
  return (
    <div key={museum._id} className='column is-one-quarter-desktop animate__animated animate__faster  museumCard'>
      <MuseumCard key={museum._id} {...museum} />
      <button id={museum._id} className='button m-2 p-2 is-rounded has-background-danger has-text-white has-text-weight-bold' onClick={handleDelete}>
        <span id={museum._id} className='is-size-7'>Remove from Favourites</span>
      </button>
    </div>
  )
})}
```
There is also a button under each museum card for deleting it from the favourites list, once again gaining authorization from using the token in the request.

```javascript
const handleDelete = async (event) => {
  try {
    axios.delete(
      `/api/profile/${userId}/favourites/${event.target.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    window.location.reload()
  } catch (err) {
    setHasError(true)
  }
}
```


## User story 

The user can access a list of all museums in the database from the ‘All Museums’ tab (museum index), and from there can select one to be redirected to its individual ‘museum show’ page.

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


## Challenges

This project led me to tackle an uphill battle of relationships, learning about how they function fundamentally and deciding which types of relationships are most suitable for different situations. I spent a long time figuring out how to populate the user with their favourites and discovered I was having issues with the syntax of the function as well as in the back-end.

## Wins and take-aways

- I gained a greater understanding of relationships due to my struggles with formatting them correctly, and I was able to have more confidence going into the final project because of it. 
- I enjoyed the process of refactoring the code and deciding which sections of the individual museum page could be separated into new components, as shown with the reviews, the add review form, and the adding the favourites function.
- I had a lot of experience with using different packages such as react-star-ratings as well as helping one of my group members with the ‘Carousel’ package. Subsequently, I gained more experience in reading documentation of external dependencies and using them to tweak components to improve them.


## Future features

- Make the styling of the museum cards on the index page more consistent between different museums.
- Adding better mobile compatibility
- Add functionality to keep the bookmark symbol checked on museums the user has favourited, and being able to ‘un-favourite’ them from deselecting the button.
