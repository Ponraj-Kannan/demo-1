---
layout: default
title: "Program 1: Hello World"
---

<script setup>
const helloCode = `class Main 
{
    public static void main(String[] args) 
    {
        // Your code
    }
}`;
</script>

<style>
    .box1 {
        margin-top: -10px; 
        margin-left: -30px; 
        padding-bottom: 10px; 
        width: 107%; max-height: 
        72vh; 
        background-color: #ffffffff; 
        font-size: .8rem; 
        font-weight: 400; 
        overflow-x: auto; 
        scrollbar-width: none; 
        overflow-y: auto;
    }

    .box2{
        display: flex; 
        flex-direction:row; 
        justify-content: space-between; 
        align-items:center; 
        gap: 0.75rem; 
        padding:0px 10px; 
        color: #ffffff; 
        margin-bottom: 4px; 
    }

    .box2 > img {
        height: 30px;
    }

    .box3{
        margin: 0; 
        font-size: 1.5rem; 
        font-weight: 700; 
        background-color: #ef5050ff; 
        color: #ffffffff; 
        width: 80%; 
        padding-left:10px; 
        margin-left:-10px
    }

    .box4{
        display: flex; 
        align-items: left; 
        gap: 0.75rem; 
        background-color: #f8fafc;
        border: 1px solid #cbd5e1; 
        border-radius: 4px; 
        padding:10px; 
        margin-top:10px
    }
    .box5{
        margin: 0; 
        font-size:.9rem;
        font-weight: 1000;
    }
    .box6{
        display: flex;
        flex-direction: row;
        padding: 10px 0px;
    }
    .box7{
        width:40%; 
        padding:0px 10px;

    }
    .box8{
      font-size: 0.7rem;
      border: 1px solid #cbd5e1; border-radius: 4px; padding:2px 10px;
      display: flex; 
      flex-direction:row;
    }
    .mini-container {
        border-radius: 4px; 
        padding: 0px 4px;
        font-size: .9rem; 
        color: #374151; 
        background-color: #e2f0feff;
        border: 1px solid #a9c4d2ff;
        display: inline-block; 
        min-width: 32px;
        margin-right: 3px;
        padding: 5px;
        width:100%;
        margin-bottom: 5px;
    }
    .mini-container-1{
        border-radius: 4px; 
        padding: 0px 4px;
        font-size: 1rem;
        display: inline-block; 
        min-width: 32px;
        margin-right: 3px;

        background-color: white; 
        padding:5px 10px; 
        background-color: #ff914d4e;
        border: 1px solid #ff914dd3;
        margin-bottom: 5px;
    }
</style>

<div class="box1">
  <div class="box2">
    <h2 class="box3">Data Types</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box6" >
    <JavaRunner :initial-code="helloCode"/>
    <div class="box7" >
        <div class = "mini-container" v-click>
            Declare and display a byte value
            → Example: Store a small number 
            (i.e. 10) and print it
        </div>
        <div class="mini-container" v-click>
            Declare and display a short value
            → Example: Store a medium range number 
            (e.g. 20000) and pr 
        </div>
        <div class="mini-container" v-click>
            Declare and display an int value
            → Example: Store and print age
        </div>
        <div class="mini-container" v-click>
            Declare and display a long value
            → Example: Store a large number 
            (e.g., 10,000,000,000) and print it
        </div>
    </div>
  </div>
</div>
