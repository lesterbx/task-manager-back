# Task Manager Backend

Backend made with node for the TaskManger app.<br>
The server endpoints are:
- Post request to <code>'/workspace'</code>: Creates a workspace
- Delete request to <code>'/workspace/:workspaceID'</code>: Removes a workspace
- Post request to <code>'/workspace/:workspaceID/user'</code>: Adds a user to the workspace
- Delete request to <code>'/workspace/:workspaceID/user/:userID'</code>: Removes a user from the workspace
- Post request to <code>'/workspace/:workspaceID/admin'</code>: Adds an admin to the workspace
- Delete request to <code>'/workspace/:workspaceID/admin/:adminID'</code>: Removes an admin from the workspace

<p>
The users must provide a header called 'auth' with the credentials in the format 'email:password'.<br>
All the actions but create a workspace must be done by an admin of the workspace.
</p>

<p>
The app is dockerized to be easier to deploy. There is included a deploy.sh script to deploy it in an environment with docker installed.
</p>

TaskManager front: <a href="https://github.com/lesterbx/task-manager">https://github.com/lesterbx/task-manager</a>
