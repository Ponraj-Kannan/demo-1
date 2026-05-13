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
        margin-top:10px;
        background-color: #ff914d4e;
        border: 1px solid #ff914dd3;
    }
</style>

<div class="box1">
  <div class="box2">
    <h2 class="box3">Java Built-in Functions</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box4" style="margin-top:20px">
   <div class="container1">
   <div v-click class="mini-container-1" style="margin-bottom: 10px; margin-top: -10px;">Math Functions</div>
   <JavaRunner v-click/></div>
   <div class="container2" style="margin-top: 38px">
    <div v-click class="mini-container">Using <span style="font-weight:1000">Math.max()</span>, find the largest number between 147 and 238</div>
    <div v-click class="mini-container">Using <span style="font-weight:1000">Math.min()</span>, find the smallest number between 560 and 324.</div>
    <div v-click class="mini-container"> Using <span style="font-weight:1000">Math.abs()</span>, find the absolute value of -456.</div>
    <div v-click class="mini-container">Using <span style="font-weight:1000">Math.pow()</span>, calculate the power of 3 raised to 6.</div>
    <div v-click class="mini-container">Using <span style="font-weight:1000">Math.sqrt()</span>, find the square root of 256.</div>
    <div v-click class="mini-container">Using <span style="font-weight:1000">Math.round()</span>, round the value 7.4 to nearest integer.</div>

   </div>
  </div>
</div>


