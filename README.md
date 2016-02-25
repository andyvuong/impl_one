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

### Note
- Currently the data collection script is not connected to our search reddit feature. It has to be run manually. (See below). A few subreddits have been pre-crawled and have data sitting on the server. Those can be searched for on the subreddit search box and they include:
- "python"
- See the bottom section on getting more data and how it should be saved. No changes to the code need to be made.

### Getting more data
- The datacollection.py script runs as 'python datacollection.py <subreddit-name>' and will get data from that subreddit. It can be run separately from the main visualization. The name of the json file should be <subredditname>.json and be saved in the same directory as server.py. The input to the search box on the visualization would just be <subredditname> since .json will be appended to it programmatically. For the purposes of presentation, we have a few computed json script included that sit on the server. Try "python"
