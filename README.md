Discoveroute
============

##Search for convenient places to stop along a route. 

![CS147 Poster](/public/images/final_poster.jpg)

####Mobile mapping apps have made it easy to do two things, separately: 

* Get from point A to point B
* Find and compare local businesses to fill a need: food, drink, or entertainment

####But users often have to solve both these problems together: 

* Get from point A to point B, and make a convenient stop at a business along the way (for lunch, coffee, shopping, etc.) 

###Discoveroute helps users by providing time- and space-constrainted local business search. 

####Example use case: 

* It's your first day at a new job. You'd like to find a convenient place to stop for coffee on the way in. 

![Home screen](http://i102.photobucket.com/albums/m93/hwray/pic2s_zps15164cb2.png)
![Tutorial](http://i102.photobucket.com/albums/m93/hwray/pic1s_zpsd994f843.png)
![Start address entry](http://i102.photobucket.com/albums/m93/hwray/pic3_zps1e85f9fd.png)
![End address entry](http://i102.photobucket.com/albums/m93/hwray/pic4s_zps694710f7.png)

* Input your preferred arrival time at your final destination, and what type of detour you're interested in stopping at along the way. 
 * Your arrival time constrains the set of suggested results. If you don't have much time to stop, Discoveroute will suggest locations that won't take much time off your route (i.e. < 1 mile detour). 

![Arrival time input](http://i102.photobucket.com/albums/m93/hwray/pic5s_zpsbae3438f.png)
![Detour category selection 1](http://i102.photobucket.com/albums/m93/hwray/pic6s_zps883c8fbc.png)
![Detour category selection 2](http://i102.photobucket.com/albums/m93/hwray/pic7s_zpsa6c054c6.png)
![Retrieving Yelp results](http://i102.photobucket.com/albums/m93/hwray/pic8_zps48f3bc63.png)

* Choose from a list of convenient places to stop along your route. 
 * If you don't see a destination you like, use the sidebar navigation drawer to change your start, end, arrival time, or destination category, and try again. 

![Carousel list of detour destinations](http://i102.photobucket.com/albums/m93/hwray/pic9s_zps61993822.png)
![Sidebar nav drawer for changing past selections](http://i102.photobucket.com/albums/m93/hwray/pic17s_zpsde132188.png)
![Examining a destination](http://i102.photobucket.com/albums/m93/hwray/pic10s_zpsdc3283fe.png)
![Selecting a destination](http://i102.photobucket.com/albums/m93/hwray/pic11s_zps79e7ba0e.png)

* Select a detour destination, and you'll receive step-by-step instructions for how to navigate there. 

![Navigation instructions 1](http://i102.photobucket.com/albums/m93/hwray/pic12s_zpsf7696bac.png)
![Navigation instructions 2](http://i102.photobucket.com/albums/m93/hwray/pic13s_zps767162b1.png)

* Discoveroute will notify you with an alarm when it's time to proceed to your final destination. 
 * If you liked your stop, you can save it to come back again later. 

![Alarm notification to proceed to destination](http://i102.photobucket.com/albums/m93/hwray/pic15s_zpsc375af7f.png)
![Saving detour to come back some other time](http://i102.photobucket.com/albums/m93/hwray/pic16s_zps5708d612.png)

* Stanford CS147 Award: Best Interaction Design
* Stanford CS147 Award: Best Poster Design

* Discoveroute uses [Node.js](http://nodejs.org/), [MongoDB](http://www.mongodb.org/), and [Bootstrap](http://getbootstrap.com/) styling. 
* Discoveroute leverages the [Google Maps API](https://developers.google.com/maps/) and [Yelp API](http://www.yelp.com/developers). 
