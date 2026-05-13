---
layout: default
title: "Program 1: Hello World"
---

<script setup>
const helloCode = `// Write your code here`;
</script>

<style>
    .box1 {
        margin-top: -10px; 
        margin-left: -30px; 
        padding-bottom: 10px; 
        width: 107%; 
        max-height: 72vh; 
        color:#464646ff;
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
        border-radius: 4px; 
        display: flex;
        flex-direction: row;
        /* background-color: #121212; */
    }
    .box5{
        margin: 0; 
        font-size:1.2rem;
    }
    .box6{
        display: flex;
        flex-direction: row;
        padding: 10px 0px;
    }
    .box7{
        width:100%; 
        padding:0px 10px;
        margin-top: 10px;

        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
    .box8{
        border: 1px solid #cbd5e1; border-radius: 4px; padding:2px 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 160px;
        height: 100px;
    }
    .container1{
      /* background-color: #20588fff; */
      width: 65%;
      min-height: 10vh;
    }
    .container2{
      /* background-color: #20588fff; */
      width: 33%;
      min-height: 10vh;
      margin-left: 1%;
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
        text-align: center;
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
    <h2 class="box3">Structure of Java Program</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box4" style="margin-top:20px">
   <div  v-click class="container1"><JavaRunner :code="helloCode"/></div>
   <div class="container2">
    <div v-click class="mini-container-1">Class Declaration</div>
    <div v-click class="mini-container">Every Java program must have at least one class</div>
    <div v-click class="mini-container">Class name must match the filename</div>
    <div v-click class="mini-container">`Main.java` → class name must be `Main`</div>
    <div v-click class="mini-container-1">Main Method</div>
    <div v-click class="mini-container">public - access modifier</div>
    <div v-click class="mini-container">static - can be run without creating an object</div>
    <div v-click class="mini-container">void - does not return any value</div>
    <div v-click class="mini-container">String[] args - command-line arguments</div>
   </div>
  </div>
</div>


