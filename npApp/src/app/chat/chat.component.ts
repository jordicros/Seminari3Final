import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client' ;
import * as app from 'express';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  socket: SocketIOClient.Socket;
  name: string;
  message: string;  
  dest: string;
  finalDest: string;
  type: string;
  outputList: string[] = [];
  visible: boolean = false;
  messages: string[] = [];
  sala: string[] = [];

  constructor() { 
    this.socket = io.connect('http://localhost:3000');

    //Listen events
    this.socket.on('chat', function(mensaje, name, type, dest){
      console.log("Recibiendo mensaje: "+type);
      if (type == 'individual'){
        
          if (dest == this.socket.id || name == this.name){
            this.sala.push(name + ":" + mensaje);        
            
            }
         }
      //multiple si no pongo destino
      if (type == 'multichat'){  
        this.messages.push(name + ":" + mensaje);   
        }
      }.bind(this));  

      this.socket.on('user', function(socket){
        var socketlength = socket.length;
        console.log("Recibiendo usuarios conectados, hay " + socketlength);
        this.outputList = [];
        for (var i = 0; i <= socketlength-1; i++) {
            this.outputList.push(socket[i]);            
        }      
    }.bind(this));  
  }

  ngOnInit() {
  }

  openForm(){
    this.visible = true;
  }
  sendMessage(){
    console.log("Enviando mensaje");
    this.socket.emit("chat", this.message, this.name, this.type, this.dest.split(" ")[1]);
  }
  closeForm() {
    this.visible = false;
  }
  sendName(){
    this.socket.emit('nickname', this.name);
    console.log("Iniciando sesión en el chat como: " + this.name);
}
}
