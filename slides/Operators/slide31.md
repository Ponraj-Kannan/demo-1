---
layout: default
title: "Program 1: Hello World"
---

<script setup>
const helloCode = `public class Main 
{
    public static void main(String[] args) 
    {
        // Write your code here
    }
}`;
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
        gap: 0.75rem;
        border-radius: 4px; 
        display: flex;
        flex-direction: column;
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
      width: 97%;
      min-height: 10vh;
    }
    .mini-container {
        border-radius: 4px; 
        padding: 0px 4px;
        font-size: 1rem; 
        color: #374151; 
        background-color: #e2f0feff;
        border: 1px solid #a9c4d2ff;
        display: inline-block; 
        min-width: 32px;
        text-align: center;
        margin-right: 3px;
    }
</style>

<div class="box1">
  <div class="box2">
    <h2 class="box3">Operators</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box4" style="margin-top:0px">
    <div v-click class="box5" style="padding-top: 20px; font-weight: 500;">Practice Problem</div>
    <div v-click class="box5" style="padding-top: 0px;">
    <div class="mini-container">Swap the values of two integer variables <b>A</b> and <b>B</b> <b>without using a temporary variable</b>.</div>
    </div>
    <div v-click></div>
   <div class="container1"><JavaRunner v-click/></div>
  </div>
</div>
