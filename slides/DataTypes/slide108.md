---
layout: default
title: "Program 1: Hello World"
---

<script setup>
const helloCode = `public class Main {
    public static void main(String[] args) {
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
        padding:10px; 
        margin-top:10px;
        display: flex;
        height:60vh;
        flex-direction: column; 
        /* background-color: #576eb8ff; */
    }
    .box5{
        margin: 0; 
        font-size:1rem;
    }
    .box6{
        display: flex;
        flex-direction: row;
        padding: 10px 0px;
    }
    .box7{

        display: flex;
        flex-direction: row;
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
</style>

<div class="box1">
  <div class="box2">
    <h2 class="box3">Data Types</h2>
    <img src="../assets/logo.png"/>
  </div>

  <div class="box4 box7" v-click style="margin-top:10px">
    <img src="../assets/data_types_in_java.webp" style="width: 70%;"/>
  </div>
</div>
