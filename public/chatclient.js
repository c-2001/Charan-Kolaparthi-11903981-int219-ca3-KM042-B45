(function() {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;
    app.querySelector(".join #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join #username").value;
        if (username.length == 0) {
            alert("Please enter Username!")
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join").classList.remove("active");
        app.querySelector(".chat").classList.add("active");

    });

    app.querySelector(".chat #send-message").addEventListener("click", function() {
        let message = app.querySelector(".chat #message-input").value.trim();
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });

        app.querySelector(".chat #message-input").value = " ";

    });


    app.querySelector(".chat #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messagecontainer = app.querySelector(".chat .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div> 
                <div class = "name" > You </div>  
                <div class = "text" > ${ message.text } </div> 
            </div> `;
            messagecontainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div> 
            <div class = "name" > ${message.username} </div>  
            <div class = "text" > ${message.text} </div> 
            </div> `;
            messagecontainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messagecontainer.appendChild(el);
        }
        messagecontainer.scrollTop = messagecontainer.scrollHeight - messagecontainer.clientHeight;
    }



})();