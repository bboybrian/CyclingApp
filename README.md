# Outdoor Biking Time Prediction Web Application
## Demo: https://youtu.be/9cP1MaaF7i8
Jul 2022 - Nov 2022   
[React.js, Node.js, Microsoft Azure, Agile]

In a team of 9, following Agile methodologies, created a web application for predicting the time needed by an athlete to complete a biking trail. Team members take turns being Scrummaster, conducting meetings according to the Scrum agenda, and consulting the Product Owner on requirements.

This application is for athletes and coaches. Athletes input their physical stats, and also the stats of any bikes they own. They then upload a racecourse (as a .gpx file). (This file is stored on a Microsoft Azure Storage server). The racecourse includes details such as road surface, elevation, latitude and longitude for every point in the racecourse. With these 3 modules (Athlete, Bike, Course), the application fetches further weather data (from historical weather) and algorithmically produces a time output.

A coach manages multiple athletes, but does everything else similarly.