import praw
import json


test_limit = 1 
r = praw.Reddit(user_agent='Test Script CS 467')

subreddit = r.get_subreddit('python')
submissions = subreddit.get_top_from_all(limit=test_limit)

uniqueusers = []
d = {}
f = open('users.txt', 'w')

for submission in submissions:
	submission.replace_more_comments(limit=64, threshold=10)
	flat_comments = praw.helpers.flatten_tree(submission.comments)
	for comment in flat_comments:
		if comment.author == None:
			continue
		user = comment.author.name
		if user not in uniqueusers:
			uniqueusers.append(user)
			d[user] = 0
		d[user] += comment.score
		
#	for i in comments:
#		if i.author not in uniqueusers:
#			uniqueusers.append(i)







# CREATES THE JSON DATA
json_data = json.dumps(d)







# Writes to file
for u in sorted(d, key=d.get, reverse=True):
	f.write(u)
	f.write(' ')
	f.write(str(d[u]))
	f.write("\n")








'''
for u in uniqueusers:
	f.write(u)
	f.write(' ')
	f.write(str(d[u]))
	f.write("\n")

'''


#f.write(comment.body.encode('utf-8'))