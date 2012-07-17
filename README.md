FeedHenry Cloud Websocket Demo
==============

There are 2 versions of this Websocket demo. Both use the socket.io library http://socket.io/ (on client and server).

Shapes Demo
----------
Each new client is assigned the next available shape/colour. Clicking or touching the page will trigger an animation of that shape/colour combination across all clients.
All connected clients are shown as a list of shapes, with the current clients shape (i.e. 'your shape/colour') enlarged.

<img src="https://github.com/feedhenry/websocket-demo/raw/master/websocket-shapes.png"/>

Chat Demo (chat branch)
--------

Each new client is assigned the the next user id. Enter messages and click/touch 'Send' (or press Enter) to broadcast the message to all clients.
This works just like a normal chatroom.
All connected users are shown as a list at the top.
