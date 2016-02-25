# Redditmendations

A visualization application that explores the similarity between users on reddit based on their interests
and interactions in online reddit communities.

###467 Project - First Implementation

- Jason Pao
- Sophia Soong
- Gary Szeto
- Andy Vuong

### Installation & Running the Project
- Install python (2.7)
- Open a terminal
- cd into the directory the server.py file is
- Run "python server.py"
- Visit http://localhost:9000 from your browser
- Ctl + c from the terminal to exit

### Getting more data
- The datacollection.py script runs as 'python datacollection.py <subreddit-name>' and will get data from that subreddit. It can be run separately from the main visualization. To load the script, you can hard code the name of
the file and its path directly in app.js (excuse the spaghetti code, we know it's bad) where gen_vis() is. For the purposes of presentation, we have a few computed json script included that sit on the server. Just change the file name and it should work!
