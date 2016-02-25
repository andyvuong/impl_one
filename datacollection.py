import praw
import json
from collections import defaultdict

print ("Starting script.")

# Specify Parameters
test_limit = 1
test_karma = 100
chosen_subreddit = 'Python'
maxusers = 10
matching_threshold = 3

r = praw.Reddit(user_agent='Test Script CS 467')
subreddit = r.get_subreddit(chosen_subreddit)
submissions = subreddit.get_top_from_all(limit=test_limit)

listofusers = []
for submission in submissions:
	submission.replace_more_comments(limit=64, threshold=10)
	flat_comments = praw.helpers.flatten_tree(submission.comments)

	for comment in flat_comments:
		if comment.author == None:
			continue
		user = comment.author.name
		if user not in listofusers:
			listofusers.append(user)

print ("Finished loading users from comments.")

# Limit the number of users
testusers = []
for i in range (0, maxusers):
	if i < len(listofusers):
		testusers.append(listofusers[i])

user_subreddit_karma_dict = {}
for u in testusers:
	subreddit_karma_dict = defaultdict(int)

	redditor = r.get_redditor(u)
	comments = redditor.get_comments(time='month', limit=None)
	for comment in comments:
		sub = str(comment.subreddit)
		score = comment.score
		subreddit_karma_dict[sub] += score
	user_subreddit_karma_dict[u] = subreddit_karma_dict

print ("Finished calculating breakdown of user's comment karma in the past month.")

f = open('users.txt', 'w')
for u in testusers:
	temp_dict = user_subreddit_karma_dict[u]
	for key in temp_dict.keys():
		if int(temp_dict[key]) < test_karma:
			temp_dict[key] = None
			temp_dict.pop(key, None)
			continue
		f.write(u)
		f.write(' ')
		f.write(str(key))
		f.write(' ')
		f.write(str(temp_dict[key]))
		f.write("\n")

print("Filtered out subreddits below a certain karma level.")

connectedusers = defaultdict(list)
edgelist = []
for i in range(0,len(testusers)):
	for j in range(i+1,len(testusers)):
		temp_edge = {}
		userA = testusers[i]
		userB = testusers[j]
		dictA = user_subreddit_karma_dict[userA]
		dictB = user_subreddit_karma_dict[userB]
		commonSubs = []
		for key in dictA.keys():
			if key in dictB.keys() and str(key) != chosen_subreddit:
				commonSubs.append(str(key))
		if len(commonSubs) > matching_threshold: # If list is not empty, create an edge
			temp_edge["source"] = i
			temp_edge["target"] = j
			temp_edge["list"] = commonSubs
			edgelist.append(temp_edge)

			connectedusers[userA].append(userB)
			connectedusers[userB].append(userA)

print ("Finished user comparisons and creating edges.")

nodelist = []
maxconnections = -1
for i in range(0,len(testusers)):
	u = testusers[i]
	temp_dict = {}
	temp_dict["name"] = u
	temp_dict["connectedusers"] = connectedusers[u]
	if len(connectedusers[u]) > maxconnections:
		maxconnections = len(connectedusers[u])
	nodelist.append(temp_dict)

print ("Finished creating nodes.")

json_dict = {}
json_dict["nodes"] = nodelist
json_dict["links"] = edgelist
json_dict["maxconnections"] = maxconnections

with open('testdata2.json', 'w') as outfile:
    json.dump(json_dict, outfile)

print ("Finished exporting to JSON.")








'''
f = open('users.txt', 'w')
for u in testusers:
	temp_dict = user_subreddit_karma_dict[u]
	for key in temp_dict.keys():
		if int(temp_dict[key]) < 100:
			temp_dict[key] = None
			temp_dict.pop(key, None)
			continue
		f.write(u)
		f.write(' ')
		f.write(str(key))
		f.write(' ')
		f.write(str(temp_dict[key]))
		f.write("\n")
'''