# Fit Car

I am currently holding all my logbook information in my phone via
a propriatary note app on my Android phone.

This project represents my attempt at trying to make an open source
version of a log book but instead of an app for the web.

This is a react app. Most of the work is in learning and unpacking
CSS rules and properties and seeing how they play with the ever
growing landscape of the web.

Take note that there are no real tests because I just wanted to
see how far I could express the idea before the motivation weaned.

## `yarn start`

This runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Features

These are the use cases that I want to have on this app:

| Feature                          | Description                                                                                                                                      | Done          | Priority |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | -------- |
| view the mileage                 | when looking at the mileage for your car it show all the mileage that you have done thus far, but it relies on an active car being selected      | done          | high     |
| add mileage                      | just adding your mileage count for the car, this adds it to a dexie db on the browser                                                            | done          | high     |
| edit mileage                     | editing your exisitng mileage entries                                                                                                            |               | low      |
| add fuel level and cost          | for when you are filling up your car and you want to track how much you are spending                                                             | done          | high     |
| edit fuel level and cost         |                                                                                                                                                  |               | very low |
| read the aggregated reports      | this brings all the data together in one location for you to see the overall health of your car                                                  | working on it | high     |
| view your configured car proiles | seeing what cars you have currently configured on the app                                                                                        | done          | high     |
| add a new car profile            |                                                                                                                                                  | done          | high     |
| activate a new car profile       |                                                                                                                                                  | done          | high     |
| delete a car profile             | this is for when you want to delete a car profile, it needs to also delete all the associated data linked with the car (this is not recoverable) |               | very low |
| import external CSV              | you need to be able to import existing data into the app                                                                                         |               | high     |
| export external CSV              | dumping the data out from the database                                                                                                           |               | medium   |
| add animations to everything     |                                                                                                                                                  |               | medium   |

It should be reiterated that this is purely to track car information as you drive, you can think of it like a manual health tracker but for your car, so anything that helps you to track this information should be high priority
