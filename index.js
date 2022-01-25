const express = require("express");
const {v4: uuidv4} = require("uuid"); 
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});


const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true
});

//set View
app.set("view engine", "ejs")
app.use("/peerjs", peerServer)
//Allow Public File Access
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`)
    console.log("Video Chat in Progresss");
})
app.get("/:room", (req, res) => {
    res.status(200).render("rooms", {
        roomId: req.params.room
    })
});
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName)
        })
    });
})

server.listen(process.env.PORT || 3030);