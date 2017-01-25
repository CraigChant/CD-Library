# CD-Library
Catalogue your CD collection with a barcode reader! 

CD Library - Example ASP.NET MVC Web API(REST) C# Application

Using:- JQuery(UI, DataTables, QTips, Selectize), Bootstrap, IoC / Dependency Injection via Unity, Entity Framework ORM, MS-SQL MDF, JSON & Discogs API.

SYNOPSIS :-

As an oldschool DJ with a reasonable CD collection, I always meant to catalogue my CD's for insurance and sales purposes.
However the thought of manually typing the list was far to daunting to bother.

I decided I would build an app to enable me to catalogue my CD collection with nothing more than a barcode reader.

To use this app yourself all you need is Visual Studio (I am using VS2015), and a barcode reader (I got mine for less than a tenner on eBay!).

You will also need to sign up to Discogs.com and get yourself a developer API authorisation token (I removed mine from the published GitHub JS file).

Simply edit the CD_Library_Obj.js file and put your API code in the relevant place...

               Auth_Token: 'YOU NEED TO PUT YOUR OWN API TOKEN HERE', // Discogs Web API authorisation token

I have also included the SQL MDF data file with some of my CD's already populating the DB. Just to show it works!

To remove my data simply delete the contents of the CD table, replace the app_data MDF file, or use your own DB context. 

I've used interfaces / IoC / Dependency Injection, so using your own data source if you know ASP.NET / MVC should be a doddle.

Here are links to a couple of screen shots...

http://dance-music.org/CD-Library/CD-Library_1.png
http://dance-music.org/CD-Library/CD-Library_2.png

I hope you find it usefull and welcome all feedback.
