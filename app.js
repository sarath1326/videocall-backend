
const express= require("express")
const bodyparser=require("body-parser")
const app=express()
const {Server}=require("socket.io")



app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyparser.json())
 

const io= new Server({
    cors:true
})

const emailToSocketMapping=new Map()
const sockettoEmailmapping=new Map()

io.on("connection",(socket)=>{

       socket.on("join_room",(data)=>{

          console.log("new connection ")

         const {room,email}=data
         
         console.log("user",email , "room",room)
         
         emailToSocketMapping.set(email,socket.id)
         sockettoEmailmapping.set(socket.id,email)

         socket.join(room)

         socket.emit("room_joined",{room})

         socket.broadcast.to(room).emit("user_joined",{email})
        
        })


        socket.on("call_user",(data)=>{

            const {email,signalData}=data
          


            const fromemail=sockettoEmailmapping.get(socket.id)
            const socketid= emailToSocketMapping.get(email)

            socket.to(socketid).emit("incoming_call",{from:fromemail,signal:signalData})

            

             
        })


        socket.on("answerCall",(data)=>{

            const {signal,email}=data

            const socketid= emailToSocketMapping.get(email)

            socket.to(socketid).emit("call_accepted",{signal})




       
       
        })



    
    
    
    })












app.listen(3001,()=>{

      console.log("server started")
})


io.listen(8000)