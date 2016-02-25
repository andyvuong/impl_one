import praw
import json
from collections import defaultdict

test_limit = 1
test_karma = 100
chosen_subreddit = 'Python'
maxusers = 5



r = praw.Reddit(user_agent='Test Script CS 467')

subreddit = r.get_subreddit(chosen_subreddit)
submissions = subreddit.get_top_from_all(limit=test_limit)

uniqueusers = []
user_karma_dict = {}
f = open('users.txt', 'w')
a = 0
for submission in submissions:
	submission.replace_more_comments(limit=64, threshold=10)
	flat_comments = praw.helpers.flatten_tree(submission.comments)

	for comment in flat_comments:
		a = a+1
		print(a)
		if comment.author == None:
			continue
		user = comment.author.name
		if user not in uniqueusers:
			uniqueusers.append(user)
#			user_karma_dict[user] = 0
#		user_karma_dict[user] += comment.score


testusers = []
for i in range (0, maxusers):
	if i < len(uniqueusers):
		testusers.append(uniqueusers[i])

user_subkarma_dict = {}

for u in testusers:
	subreddit_karma_dict = defaultdict(int)

	redditor = r.get_redditor(u)
	comments = redditor.get_comments(time='month', limit=None)
	for comment in comments:
		sub = str(comment.subreddit)
		score = comment.score
		print sub
		print score
		#if sub not in subreddit_karma_dict.keys():
		#	subreddit_karma_dict[sub] = 0
		subreddit_karma_dict[sub] += score
		print subreddit_karma_dict[sub]

	user_subkarma_dict[u] = subreddit_karma_dict


for u in testusers:
	temp_dict = user_subkarma_dict[u]
	for key in temp_dict.keys():
		if int(temp_dict[key]) < 100:
			temp_dict[key] = None
			temp_dict.pop(key, None)
			continue
		print (u)
		print (str(key))
		print (str(temp_dict[key]))
		f.write(u)
		f.write(' ')
		f.write(str(key))
		f.write(' ')
		f.write(str(temp_dict[key]))
		f.write("\n")


edgelist = []
for i in range(0,len(testusers)):
	for j in range(i+1,len(testusers)):
		temp_edge = {}
		userA = testusers[i]
		userB = testusers[j]
		dictA = user_subkarma_dict[userA]
		dictB = user_subkarma_dict[userB]
		commonSubs = []
		for key in dictA.keys():
			if key in dictB.keys() and str(key) != chosen_subreddit:
				commonSubs.append(str(key))
		if commonSubs: # If list is not empty, create an edge
			temp_edge["source"] = i
			temp_edge["target"] = j
			temp_edge["list"] = commonSubs
			edgelist.append(temp_edge)


nodelist = []
for u in testusers:
	temp_dict = {}
	temp_dict["name"] = u
	nodelist.append(temp_dict)
 
json_dict = {}
json_dict["nodes"] = nodelist
json_dict["edges"] = edgelist

with open('testdata2.json', 'w') as outfile:
    json.dump(json_dict, outfile)




'''
{
	"nodes":[
		{"name":"User 1"},
		{"name":"User 2"},
		{"name":"User 3"},
		{"name":"User 4"},
		{"name":"User 5"},
		{"name":"User 6"}
	],
	"links":[
		{"source":0, "target":1,"list":["Sub A", "Sub B", "Sub C"]},
		{"source":0, "target":3,"list":["Sub A", "Sub B"]},
		{"source":0, "target":5,"list":["Sub A"]},
		{"source":2, "target":4,"list":["Sub A", "Sub B", "Sub C", "Sub D"]}
	]
}
'''

'''for u in uniqueusers:
	subreddit_karma_dict = defaultdict(int)

	redditor = get_redditor(u.name)
	comments = user.get_comments(time='month', limit=None)
	for comment in comments:
		subreddit_karma_dict[comment.subreddit.name] += comment.score

	user_subkarma_dict[u] = subreddit_karma_dict

for u in uniqueusers:
	temp_dict = user_subkarma_dict[u]
	for key in temp_dict.keys():
		f.write(u.name)
		f.write(' ')
		f.write(key)
		f.write(' ')
		f.write(str(temp_dict[u]))
		f.write("\n")
	f.write("\n")
'''






# CREATES THE JSON DATA
#json_data = json.dumps(user_karma_dict)







# Writes to file
'''for u in sorted(user_karma_dict, key=user_karma_dict.get, reverse=True):
	f.write(u)
	f.write(' ')
	f.write(str(user_karma_dict[u]))
	f.write("\n")
'''







'''
for u in uniqueusers:
	f.write(u)
	f.write(' ')
	f.write(str(d[u]))
	f.write("\n")

'''


#f.write(comment.body.encode('utf-8'))