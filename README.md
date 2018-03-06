# Udacity Full-Stack Nanodegree Neighborhood Map Project

This project is a single-page client-side web app that uses the Knockout Javascript framework. It demonstrates a familiarity with building applications that run client-side, interact with third-party APIs, and use a MVVM pattern for structuring Javascript for ease of extensibility and maintainability.

## Getting Started and App Features

The app uses Google Maps and Foursquare to show all of the Caribbean restaurants in Crown Heights, which is highlighted and outlined on the map. The visited and favorited buttons in the header will toggle the filter to only show the restaurants that have been marked accordingly. Favoriting a restaurant will automatically mark it as visited as well. Clicking the hamburger icon opens the sidebar, which lists the restaurants shown. Clicking on a restaurant will open a details pane for it and show an info window above the corresponding marker on the map with the street view and restaurant name. The details pane gives you the option to mark a restaurant as visited, favorited, or to add a note. If there is an existing note, the note icon allows you to edit or remove it. Visited and favorited status and notes are stored persistently and will remain after you reload the page.

### Prerequisites

The app runs entirely in the browser using only HTML, CSS, and Javascript. If you clone the repository, the app will run simply by loading the index.html file in a browser. The API keys are mine and are hard-coded into the script files as this site was built for demo purposes only. Please don't abuse! It's also hosted by Github Pages if you just want to see it run:

https://terencefox.github.io/neighborhoodmap/

## Built With

* [Knockout](http://knockoutjs.com/index.html) - The web framework used
* [jQuery](https://jquery.com/)
* [Yarn](https://yarnpkg.com/en/)

## Author

* **Terence Fox**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Min Tran made the vector icons [Dribble](https://dribbble.com/mintran)
* Vasile Coțovanu made a [nifty tool](http://maps.vasile.ch/geomask/) that I used to create the polygon mask for the Google Map.
* Tania Rascia wrote a [tutorial on JS Local Storage](https://www.taniarascia.com/how-to-use-local-storage-with-javascript/) that was very helpful for deciding how to implement it in my own project.
* The great [TodoMVC](http://todomvc.com/) project provided examples on how an app can be structured in terms of breaking separation of concerns into files that are organized into folders.
